import { NextRequest, NextResponse } from "next/server";
import { runEvergreenJob } from "@/lib/bot/pipeline";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(5, Number(limitParam))) : 3;
  const result = await runEvergreenJob(limit);
  return NextResponse.json({ status: "ok", result });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
