import { NextRequest, NextResponse } from "next/server";
import { runDailyPipeline } from "@/lib/bot/pipeline";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyPipeline();
  return NextResponse.json({ status: "ok", result });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}
