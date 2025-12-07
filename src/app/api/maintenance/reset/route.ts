import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/cms/sanity-client";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing SANITY_WRITE_TOKEN" }, { status: 500 });
  }

  const client = sanityClient({ token, useCdn: false });

  try {
    await client.delete({ query: '*[_type == "article"]' });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete articles", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
