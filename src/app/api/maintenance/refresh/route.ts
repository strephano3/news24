import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/cms/sanity-client";
import { createArticleBrief } from "@/lib/bot/services/generator";
import { composeArticle } from "@/lib/bot/services/composer";
import { KeywordMetric } from "@/lib/bot/types";
import { toPortableText } from "@/lib/bot/services/publisher";

type ExistingArticle = {
  _id: string;
  targetKeyword: string;
  trafficPotential?: number;
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing SANITY_WRITE_TOKEN" }, { status: 500 });
  }

  const client = sanityClient({ token, useCdn: false });
  const articles = await client.fetch<ExistingArticle[]>(
    `*[_type == "article" && defined(targetKeyword)]{ _id, targetKeyword, trafficPotential }`
  );

  const updated = [] as Array<{ id: string; keyword: string }>;

  for (const article of articles) {
    const metric: KeywordMetric = {
      keyword: article.targetKeyword,
      volume: article.trafficPotential ?? 600,
      difficulty: 40,
      cpc: 0.9,
    };

    const brief = await createArticleBrief(metric);
    const composed = await composeArticle(brief);

    try {
      await client
        .patch(article._id)
        .set({
          title: composed.title,
          description: composed.metaDescription,
          body: toPortableText(composed.body),
          bodyMarkdown: composed.body,
          faq: composed.faq,
          ctaBlock: composed.cta ?? undefined,
          lastAuditAt: new Date().toISOString(),
        })
        .commit();
      updated.push({ id: article._id, keyword: article.targetKeyword });
    } catch (error) {
      console.error("Failed to refresh article", article._id, error);
    }
  }

  return NextResponse.json({ refreshed: updated.length });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
