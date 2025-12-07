import { NextResponse } from "next/server";
import { fetchFeaturedArticles } from "@/lib/cms/fetch-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  try {
    const articles = await fetchFeaturedArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Failed to fetch latest articles", error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
