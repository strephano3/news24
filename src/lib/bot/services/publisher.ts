import { randomUUID } from "crypto";
import { sanityClient } from "@/lib/cms/sanity-client";
import { GeneratedArticle } from "../types";

export async function publishArticles(articles: GeneratedArticle[]) {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    console.warn("Missing SANITY_WRITE_TOKEN, skipping publish");
    return [];
  }

  const client = sanityClient({ token, useCdn: false });
  const results = [] as Array<{ id: string; title: string }>;

  for (const article of articles) {
    const doc = {
      _id: `article-${randomUUID()}`,
      _type: "article",
      title: article.title,
      description: article.metaDescription,
      slug: { current: slugify(article.slug ?? article.title ?? article.targetKeyword) },
      body: toPortableText(article.body),
      bodyMarkdown: article.body,
      heroImage: article.heroImage ?? null,
      keywords: [article.targetKeyword],
      faq: article.faq,
      eeatScore: 75,
      publishedAt: new Date().toISOString(),
      targetKeyword: article.targetKeyword,
      ctaBlock: article.cta ?? undefined,
      isEvergreen: article.isEvergreen,
      lastAuditAt: new Date().toISOString(),
      trafficPotential: article.trafficPotential ?? undefined,
    };

    try {
      const created = await client.create(doc);
      results.push({ id: created._id, title: created.title });
    } catch (error) {
      console.error("Failed to publish article", article.title, error);
    }
  }

  return results;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function toPortableText(body: string) {
  return body.split("\n\n").map((paragraph) => ({
    _key: randomUUID(),
    _type: "block",
    style: "normal",
    children: [
      {
        _key: randomUUID(),
        _type: "span",
        text: paragraph,
      },
    ],
    markDefs: [],
  }));
}
