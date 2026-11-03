import { createClient } from "@supabase/supabase-js";
import { SCHOLARSHIPS } from "@/data/scholarships";
import type { SessionLog } from "@/lib/types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수를 설정해야 합니다.");
  return createClient(url, key);
}

export async function saveLog(log: SessionLog): Promise<void> {
  const { error } = await getSupabase().from("experiment_logs").insert({
    participant_id: log.participant_id,
    test_round: log.test_round === "1" ? "1차" : "2차",
    persona_type: log.persona_type,
    ip_address: log.ip_address,
    total_duration_ms: log.summary.total_duration_ms,
    post_click_count: log.summary.posts_clicked,
    revisit_count: log.summary.revisit_count,
    attachment_click_count: log.summary.attachment_clicks,
    search_count: log.summary.search_count,
    selected_scholarships: log.selected_ids.map((id) => ({
      id,
      title: log.selected_scholarships?.find((post) => post.id === id)?.title ?? SCHOLARSHIPS.find((post) => post.id === id)?.title ?? id,
    })),
    raw_events: log.events,
  });
  if (error) throw error;
}

export async function listLogs(): Promise<SessionLog[]> {
  const { data, error } = await getSupabase()
    .from("experiment_logs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const selected = (row.selected_scholarships ?? []) as { id: string; title: string }[];
    const events = row.raw_events ?? [];
    const start = events.find((event: { type: string }) => event.type === "EXPERIMENT_START");
    const end = [...events].reverse().find((event: { type: string }) => event.type === "EXPERIMENT_SUBMIT");
    const submitted_at = end?.timestamp ?? row.created_at;
    const started_at = start?.timestamp ?? submitted_at;
    const session_id = row.id ?? `${row.participant_id}-${row.created_at}`;
    return {
      participant_id: row.participant_id,
      session_id,
      persona_type: row.persona_type,
      test_round: row.test_round === "1차" ? "1" : "2",
      started_at,
      ip_address: row.ip_address,
      submitted_at,
      complete_code: "",
      summary: {
        total_duration_ms: row.total_duration_ms,
        posts_clicked: row.post_click_count,
        unique_posts_clicked: new Set(events.filter((e: { type: string }) => e.type === "POST_CLICK").map((e: { post_id?: string }) => e.post_id).filter(Boolean)).size,
        revisit_count: row.revisit_count,
        attachment_clicks: row.attachment_click_count,
        search_count: row.search_count,
        selected_ids: selected.map((item) => item.id),
        selected_titles: selected.map((item) => item.title),
      },
      events,
      selected_ids: selected.map((item) => item.id),
    } as SessionLog;
  });
}
