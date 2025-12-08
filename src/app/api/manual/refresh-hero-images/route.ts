import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/cms/sanity-client";
import { normalizeHeroImage, shouldUseFallbackHero } from "@/lib/heroImages";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing SANITY_WRITE_TOKEN" }, { status: 500 });
  }

  const client = sanityClient({ token, useCdn: false });
  const docs = await client.fetch<Array<{ _id: string; heroImage?: string | null; slug?: string }>>(
    `*[_type == "article"]{_id, heroImage, "slug": slug.current}`,
  );

  let updated = 0;
  for (const doc of docs) {
    if (!shouldUseFallbackHero(doc.heroImage)) continue;
    const freshUrl = await normalizeHeroImage(doc.heroImage, doc.slug ?? doc._id);
    if (!freshUrl || freshUrl === doc.heroImage) continue;
    await client.patch(doc._id).set({ heroImage: freshUrl }).commit();
    updated++;
  }

  return NextResponse.json({ checked: docs.length, updated });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
