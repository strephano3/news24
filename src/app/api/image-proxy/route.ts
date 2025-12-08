import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Missing or invalid url" }, { status: 400 });
  }

  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy failed", url, error);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
