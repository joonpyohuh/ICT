import type { PersonaId, TestRound } from "@/data/scholarships";

export type EventType =
  | "EXPERIMENT_START"
  | "PAGE_VIEW"
  | "SEARCH"
  | "POST_CLICK"
  | "POST_DWELL_TIME"
  | "POST_REVISIT"
  | "ATTACHMENT_CLICK"
  | "SELECT_SCHOLARSHIP"
  | "DESELECT_SCHOLARSHIP"
  | "EXPERIMENT_SUBMIT";

export interface LogEvent {
  type: EventType;
  timestamp: string;
  t_ms: number;
  page?: string;
  page_number?: number;
  query?: string;
  search_scope?: "title" | "title_body";
  post_id?: string;
  post_title?: string;
  dwell_ms?: number;
  is_revisit?: boolean;
  visit_count?: number;
  attachment_name?: string;
}

export interface SessionMeta {
  participant_id: string;
  session_id: string;
  persona_type: PersonaId;
  test_round: TestRound;
  started_at: string;
}

export interface SessionSummary {
  total_duration_ms: number;
  posts_clicked: number;
  unique_posts_clicked: number;
  revisit_count: number;
  attachment_clicks: number;
  search_count: number;
  selected_ids: string[];
  selected_titles: string[];
}

export interface SessionLog extends SessionMeta {
  selected_scholarships?: { id: string; title: string }[];
  ip_address: string;
  submitted_at: string;
  complete_code: string;
  summary: SessionSummary;
  events: LogEvent[];
  selected_ids: string[];
}
