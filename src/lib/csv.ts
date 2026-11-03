import type { SessionLog } from "@/lib/types";

function esc(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function sessionsToCsv(logs: SessionLog[]): string {
  const headers = [
    "participant_id",
    "session_id",
    "complete_code",
    "ip_address",
    "persona_type",
    "test_round",
    "started_at",
    "submitted_at",
    "total_duration_ms",
    "posts_clicked",
    "unique_posts_clicked",
    "revisit_count",
    "attachment_clicks",
    "search_count",
    "selected_titles",
    "selected_ids",
  ];
  const rows = logs.map((l) =>
    [
      l.participant_id,
      l.session_id,
      l.complete_code,
      l.ip_address,
      l.persona_type,
      l.test_round,
      l.started_at,
      l.submitted_at,
      l.summary.total_duration_ms,
      l.summary.posts_clicked,
      l.summary.unique_posts_clicked,
      l.summary.revisit_count,
      l.summary.attachment_clicks,
      l.summary.search_count,
      l.summary.selected_titles.join(" | "),
      l.summary.selected_ids.join(" | "),
    ]
      .map(esc)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function eventsToCsv(logs: SessionLog[]): string {
  const headers = [
    "participant_id",
    "session_id",
    "persona_type",
    "test_round",
    "type",
    "timestamp",
    "t_ms",
    "page",
    "page_number",
    "query",
    "search_scope",
    "post_id",
    "post_title",
    "dwell_ms",
    "is_revisit",
    "visit_count",
    "attachment_name",
  ];
  const rows: string[] = [];
  for (const l of logs) {
    for (const e of l.events) {
      rows.push(
        [
          l.participant_id,
          l.session_id,
          l.persona_type,
          l.test_round,
          e.type,
          e.timestamp,
          e.t_ms,
          e.page ?? "",
          e.page_number ?? "",
          e.query ?? "",
          e.search_scope ?? "",
          e.post_id ?? "",
          e.post_title ?? "",
          e.dwell_ms ?? "",
          e.is_revisit ?? "",
          e.visit_count ?? "",
          e.attachment_name ?? "",
        ]
          .map(esc)
          .join(","),
      );
    }
  }
  return [headers.join(","), ...rows].join("\n");
}
