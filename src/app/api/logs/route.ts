import { NextResponse } from "next/server";
import { listLogs, saveLog } from "@/lib/log-store";
import type { SessionLog } from "@/lib/types";

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "database error";
}

export async function GET() {
  try {
    const logs = await listLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let log: SessionLog;
  try {
    log = (await req.json()) as SessionLog;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!log?.session_id || !log?.participant_id || !log.summary || !Array.isArray(log.events)) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
  try {
    await saveLog(log);
    return NextResponse.json({ ok: true, session_id: log.session_id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: errorMessage(error) }, { status: 500 });
  }
}
