"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PERSONAS, type Persona, type PersonaId, type TestRound } from "@/data/scholarships";
import { completeCode, summarize } from "@/lib/summary";
import type { LogEvent, SessionLog, SessionMeta } from "@/lib/types";

const LS_KEY = "ut-scholarship-session-v1";

type StartInput = {
  participant_id: string;
  persona_type: PersonaId;
  test_round: TestRound;
};

type Ctx = {
  ready: boolean;
  meta: SessionMeta | null;
  persona: Persona | null;
  events: LogEvent[];
  selectedIds: string[];
  visitCounts: Record<string, number>;
  submitted: boolean;
  completeResult: SessionLog | null;
  elapsedMs: number;
  ip: string;
  start: (input: StartInput) => Promise<void>;
  log: (partial: Omit<LogEvent, "timestamp" | "t_ms">) => void;
  toggleSelect: (postId: string, title: string) => void;
  markVisit: (postId: string) => { isRevisit: boolean; visitCount: number };
  submit: () => Promise<SessionLog | null>;
  resetLocal: () => void;
};

const ExperimentContext = createContext<Ctx | null>(null);

function nowIso() {
  return new Date().toISOString();
}

export function ExperimentProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<SessionMeta | null>(null);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [completeResult, setCompleteResult] = useState<SessionLog | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [ip, setIp] = useState("unknown");
  const [hydrated, setHydrated] = useState(false);
  const startMs = useRef<number>(0);
  const eventsRef = useRef<LogEvent[]>([]);
  const selectedRef = useRef<string[]>([]);

  const persist = useCallback((patch: Record<string, unknown>) => {
    try {
      const prev = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch {
      /* ignore quota */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.meta) {
          setMeta(s.meta);
          setEvents(s.events || []);
          eventsRef.current = s.events || [];
          setSelectedIds(s.selectedIds || []);
          selectedRef.current = s.selectedIds || [];
          setVisitCounts(s.visitCounts || {});
          setSubmitted(!!s.submitted);
          setCompleteResult(s.completeResult || null);
          setIp(s.ip || "unknown");
          startMs.current = s.meta?.started_at
            ? new Date(s.meta.started_at).getTime()
            : Date.now();
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!meta || submitted) return;
    const tick = () => setElapsedMs(Date.now() - startMs.current);
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [meta, submitted]);

  const log = useCallback(
    (partial: Omit<LogEvent, "timestamp" | "t_ms">) => {
      if (!startMs.current) return;
      const ev: LogEvent = {
        ...partial,
        timestamp: nowIso(),
        t_ms: Date.now() - startMs.current,
      };
      eventsRef.current = [...eventsRef.current, ev];
      setEvents(eventsRef.current);
      persist({ events: eventsRef.current });
    },
    [persist],
  );

  const start = useCallback(
    async (input: StartInput) => {
      const session_id = crypto.randomUUID();
      const started_at = nowIso();
      startMs.current = Date.now();
      const nextMeta: SessionMeta = { ...input, session_id, started_at };
      let nextIp = "unknown";
      try {
        const r = await fetch("/api/ip");
        const j = await r.json();
        nextIp = j.ip || "unknown";
      } catch {
        nextIp = "unknown";
      }
      setIp(nextIp);
      setMeta(nextMeta);
      setSubmitted(false);
      setCompleteResult(null);
      setSelectedIds([]);
      selectedRef.current = [];
      setVisitCounts({});
      const first: LogEvent = {
        type: "EXPERIMENT_START",
        timestamp: started_at,
        t_ms: 0,
        page: "list",
      };
      eventsRef.current = [first];
      setEvents(eventsRef.current);
      persist({
        meta: nextMeta,
        events: eventsRef.current,
        selectedIds: [],
        visitCounts: {},
        submitted: false,
        completeResult: null,
        ip: nextIp,
      });
    },
    [persist],
  );

  const toggleSelect = useCallback(
    (postId: string, title: string) => {
      const has = selectedRef.current.includes(postId);
      const next = has
        ? selectedRef.current.filter((id) => id !== postId)
        : [...selectedRef.current, postId];
      selectedRef.current = next;
      setSelectedIds(next);
      persist({ selectedIds: next });
      log({
        type: has ? "DESELECT_SCHOLARSHIP" : "SELECT_SCHOLARSHIP",
        post_id: postId,
        post_title: title,
      });
    },
    [log, persist],
  );

  const markVisit = useCallback(
    (postId: string) => {
      let result = { isRevisit: false, visitCount: 1 };
      setVisitCounts((prev) => {
        const prevN = prev[postId] || 0;
        const visitCount = prevN + 1;
        result = { isRevisit: prevN > 0, visitCount };
        const next = { ...prev, [postId]: visitCount };
        persist({ visitCounts: next });
        return next;
      });
      return result;
    },
    [persist],
  );

  const submit = useCallback(async () => {
    if (!meta) return null;
    const submitEv: LogEvent = {
      type: "EXPERIMENT_SUBMIT",
      timestamp: nowIso(),
      t_ms: Date.now() - startMs.current,
      page: "submit",
    };
    const allEvents = [...eventsRef.current, submitEv];
    eventsRef.current = allEvents;
    setEvents(allEvents);
    const summary = summarize(allEvents, selectedRef.current);
    const payload: SessionLog = {
      ...meta,
      ip_address: ip,
      submitted_at: submitEv.timestamp,
      complete_code: completeCode(meta.participant_id, meta.session_id),
      summary,
      events: allEvents,
      selected_ids: selectedRef.current,
    };
    persist({ events: allEvents, submitted: true, completeResult: payload });
    setSubmitted(true);
    setCompleteResult(payload);
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* localStorage still has it */
    }
    return payload;
  }, [ip, meta, persist]);

  const resetLocal = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setMeta(null);
    setEvents([]);
    eventsRef.current = [];
    setSelectedIds([]);
    selectedRef.current = [];
    setVisitCounts({});
    setSubmitted(false);
    setCompleteResult(null);
    startMs.current = 0;
  }, []);

  const persona = meta ? PERSONAS[meta.persona_type] : null;

  const value = useMemo<Ctx>(
    () => ({
      ready: hydrated,
      meta,
      persona,
      events,
      selectedIds,
      visitCounts,
      submitted,
      completeResult,
      elapsedMs,
      ip,
      start,
      log,
      toggleSelect,
      markVisit,
      submit,
      resetLocal,
    }),
    [
      hydrated,
      meta,
      persona,
      events,
      selectedIds,
      visitCounts,
      submitted,
      completeResult,
      elapsedMs,
      ip,
      start,
      log,
      toggleSelect,
      markVisit,
      submit,
      resetLocal,
    ],
  );

  return <ExperimentContext.Provider value={value}>{children}</ExperimentContext.Provider>;
}

export function useExperiment() {
  const ctx = useContext(ExperimentContext);
  if (!ctx) throw new Error("useExperiment outside provider");
  return ctx;
}
