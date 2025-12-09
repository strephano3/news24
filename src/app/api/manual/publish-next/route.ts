import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sanityClient } from "@/lib/cms/sanity-client";
import { toPortableText } from "@/lib/bot/services/publisher";
import { loadManualQueue, ManualArticle } from "@/lib/manualQueue";
import { normalizeHeroImage } from "@/lib/heroImages";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing SANITY_WRITE_TOKEN" }, { status: 500 });
  }

  const queue = await loadManualQueue();
  if (!queue.length) {
    return NextResponse.json({ status: "empty", message: "Manual queue not found or empty" });
  }

  const client = sanityClient({ token, useCdn: false });

  for (const entry of queue) {
    const slug = slugify(entry.slug ?? entry.title);
    if (!slug) continue;

    const exists = await client.fetch(
      `count(*[_type == "article" && slug.current == $slug])`,
      { slug },
    );
    if (exists > 0) {
      continue;
    }

    const heroImage = await normalizeHeroImage(entry.heroImage, slug);
    const doc = buildSanityDoc(entry, slug, heroImage);
    try {
      const created = await client.create(doc);
      await Promise.all([
        revalidatePath("/"),
        revalidatePath("/feed"),
        revalidatePath(`/articoli/${slug}`),
      ]);
      return NextResponse.json({
        status: "published",
        slug,
        id: created._id,
        title: created.title,
      });
    } catch (error) {
      console.error("Failed to publish manual article", entry.title, error);
      return NextResponse.json({ error: "Publish failed" }, { status: 500 });
    }
  }

  return NextResponse.json({
    status: "done",
    message: "All queued articles already exist in Sanity",
  });
}

function buildSanityDoc(entry: ManualArticle, slug: string, heroImage: string) {
  const now = new Date().toISOString();
  return {
    _type: "article",
    title: entry.title,
    description: entry.summary ?? entry.title,
    slug: { current: slug },
    body: toPortableText(entry.bodyMarkdown),
    bodyMarkdown: entry.bodyMarkdown,
    heroImage,
    keywords: entry.targetKeyword ? [entry.targetKeyword] : [],
    faq: (entry.faq ?? []).map((item) => ({
      _key: randomUUID(),
      ...item,
    })),
    eeatScore: 80,
    publishedAt: now,
    targetKeyword: entry.targetKeyword ?? entry.title,
    ctaBlock: entry.cta ?? undefined,
    isEvergreen: entry.isEvergreen ?? false,
    lastAuditAt: now,
    trafficPotential: entry.trafficPotential ?? undefined,
  };
}

function slugify(value?: string) {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isAuthorized(request: NextRequest) {
  // Requests triggered by Vercel Cron jobs include this header automatically.
  if (request.headers.has("x-vercel-cron")) {
    return true;
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
