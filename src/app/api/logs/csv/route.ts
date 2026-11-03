import { NextRequest, NextResponse } from "next/server";
import { listLogs } from "@/lib/log-store";
import { eventsToCsv, sessionsToCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const kind = req.nextUrl.searchParams.get("kind") === "events" ? "events" : "summary";
  const logs = await listLogs();
  const csv = kind === "events" ? eventsToCsv(logs) : sessionsToCsv(logs);
  const bom = "\uFEFF";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ut-${kind}-${Date.now()}.csv"`,
    },
  });
}
