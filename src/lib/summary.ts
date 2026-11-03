import { SCHOLARSHIPS } from "@/data/scholarships";
import type { LogEvent, SessionSummary } from "@/lib/types";

export function summarize(events: LogEvent[], selectedIds: string[]): SessionSummary {
  const clicks = events.filter((e) => e.type === "POST_CLICK");
  const unique = new Set(clicks.map((e) => e.post_id).filter(Boolean));
  const titles = selectedIds.map(
    (id) => SCHOLARSHIPS.find((p) => p.id === id)?.title ?? id,
  );
  const start = events.find((e) => e.type === "EXPERIMENT_START");
  const end = events.findLast?.((e) => e.type === "EXPERIMENT_SUBMIT") ??
    events.filter((e) => e.type === "EXPERIMENT_SUBMIT").at(-1);
  const duration =
    start && end ? Math.max(0, end.t_ms - start.t_ms) : events.at(-1)?.t_ms ?? 0;

  return {
    total_duration_ms: duration,
    posts_clicked: clicks.length,
    unique_posts_clicked: unique.size,
    revisit_count: events.filter((e) => e.type === "POST_REVISIT").length,
    attachment_clicks: events.filter((e) => e.type === "ATTACHMENT_CLICK").length,
    search_count: events.filter((e) => e.type === "SEARCH").length,
    selected_ids: selectedIds,
    selected_titles: titles,
  };
}

export function completeCode(participantId: string, sessionId: string): string {
  const p = participantId.replace(/[^a-zA-Z0-9가-힣]/g, "").slice(0, 8) || "P";
  const s = sessionId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `UT-${p}-${s}`;
}

// ponytail: one assert check for summary math; upgrade = vitest
if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
  const s = summarize(
    [
      { type: "EXPERIMENT_START", timestamp: "", t_ms: 0 },
      { type: "POST_CLICK", timestamp: "", t_ms: 10, post_id: "a" },
      { type: "POST_CLICK", timestamp: "", t_ms: 20, post_id: "a" },
      { type: "POST_REVISIT", timestamp: "", t_ms: 20, post_id: "a", is_revisit: true },
      { type: "SEARCH", timestamp: "", t_ms: 30, query: "x" },
      { type: "ATTACHMENT_CLICK", timestamp: "", t_ms: 40, post_id: "a" },
      { type: "EXPERIMENT_SUBMIT", timestamp: "", t_ms: 1000 },
    ],
    ["a"],
  );
  console.assert(s.posts_clicked === 2 && s.unique_posts_clicked === 1 && s.revisit_count === 1);
  console.assert(s.search_count === 1 && s.attachment_clicks === 1 && s.total_duration_ms === 1000);
}
