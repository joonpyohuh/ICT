"use client";

import { useMemo, useState } from "react";
import { PERSONAS, SCHOLARSHIPS, type PersonaId, type TestRound, type ScholarshipPost } from "@/data/scholarships";
import { ExperimentProvider, useExperiment } from "@/context/ExperimentContext";

function Experiment() {
  const experiment = useExperiment();
  const [participantId, setParticipantId] = useState("");
  const [round, setRound] = useState<TestRound>("1");
  const [persona, setPersona] = useState<PersonaId>("A");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [selectedPost, setSelectedPost] = useState<ScholarshipPost | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const posts = useMemo(() => SCHOLARSHIPS.filter((post) =>
    (category === "전체" || post.category === category) &&
    `${post.title} ${post.body}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  ), [category, query]);

  function openPost(post: ScholarshipPost) {
    const visit = experiment.markVisit(post.id);
    experiment.log({ type: "POST_CLICK", post_id: post.id, post_title: post.title });
    if (visit.isRevisit) experiment.log({ type: "POST_REVISIT", post_id: post.id, post_title: post.title, is_revisit: true, visit_count: visit.visitCount });
    setSelectedPost(post);
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const result = await experiment.submit();
      if (!result) throw new Error("실험을 먼저 시작해 주세요.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (!experiment.ready) return <main className="p-8">불러오는 중…</main>;
  if (experiment.completeResult) return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-3xl font-bold">제출이 완료되었습니다</h1><p className="mt-4">완료 코드: <strong>{experiment.completeResult.complete_code}</strong></p><button className="mt-6 rounded bg-zinc-900 px-4 py-2 text-white" onClick={experiment.resetLocal}>새 참가자 시작</button></main>;

  if (!experiment.meta) return <main className="mx-auto flex min-h-screen max-w-xl items-center p-6"><form className="w-full space-y-5 rounded-2xl border bg-white p-8 shadow-sm" onSubmit={(e) => { e.preventDefault(); if (participantId.trim()) void experiment.start({ participant_id: participantId.trim(), test_round: round, persona_type: persona }); }}>
    <div><p className="text-sm font-semibold text-blue-700">아주대학교 장학공지 사용성 실험</p><h1 className="mt-2 text-3xl font-bold">참가자 정보</h1><p className="mt-2 text-zinc-600">공지 목록을 살펴보고 해당하는 장학금을 선택해 주세요.</p></div>
    <label className="block text-sm font-medium">참가자 ID<input required value={participantId} onChange={(e) => setParticipantId(e.target.value)} className="mt-1 w-full rounded border p-2" /></label>
    <label className="block text-sm font-medium">실험 회차<select value={round} onChange={(e) => setRound(e.target.value as TestRound)} className="mt-1 w-full rounded border p-2"><option value="1">1차</option><option value="2">2차</option></select></label>
    <label className="block text-sm font-medium">페르소나<select value={persona} onChange={(e) => setPersona(e.target.value as PersonaId)} className="mt-1 w-full rounded border p-2"><option value="A">A</option><option value="B">B</option></select></label>
    <button className="w-full rounded bg-blue-700 px-4 py-3 font-semibold text-white">실험 시작</button>
  </form></main>;

  return <main className="min-h-screen bg-zinc-50 text-zinc-900">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"><div><p className="text-xs font-semibold text-blue-700">아주대학교</p><h1 className="text-xl font-bold">장학 공지사항</h1></div><div className="text-right text-sm"><span className="font-semibold">{experiment.meta.participant_id}</span><br />{experiment.meta.test_round === "1" ? "1차" : "2차"} · Persona {experiment.meta.persona_type} · {Math.floor(experiment.elapsedMs / 1000)}초</div></div></header>
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_300px]">
      <section><div className="mb-4 flex flex-col gap-3 sm:flex-row"><input aria-label="공지 검색" placeholder="제목 또는 본문 검색" value={query} onChange={(e) => { setQuery(e.target.value); experiment.log({ type: "SEARCH", query: e.target.value, search_scope: "title_body" }); }} className="min-w-0 flex-1 rounded-lg border bg-white px-4 py-3" /><select aria-label="카테고리" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border bg-white px-3"><option>전체</option><option>교내장학</option><option>교외장학</option><option>국가장학</option></select></div>
        <div className="overflow-hidden rounded-xl border bg-white"><div className="grid grid-cols-[1fr_auto] gap-3 border-b bg-zinc-100 px-4 py-3 text-sm font-semibold"><span>제목</span><span>분류 · 게시일</span></div>{posts.map((post) => <button key={post.id} onClick={() => openPost(post)} className="grid w-full grid-cols-[1fr_auto] gap-3 border-b px-4 py-4 text-left last:border-0 hover:bg-blue-50"><span className="font-medium">{post.isPinned && <span className="mr-2 rounded bg-zinc-200 px-2 py-0.5 text-xs">공지</span>}{post.title}</span><span className="whitespace-nowrap text-xs text-zinc-500">{post.category}<br />{post.postedAt}</span></button>)}{!posts.length && <p className="p-8 text-center text-zinc-500">검색 결과가 없습니다.</p>}</div>
      </section>
      <aside className="h-fit rounded-xl border bg-white p-5"><h2 className="font-bold">선택한 장학금</h2><p className="mt-1 text-sm text-zinc-500">해당되는 공지를 선택하세요.</p><ul className="my-4 space-y-2">{experiment.selectedIds.map((id) => <li key={id} className="flex items-start justify-between gap-2 text-sm"><span>{SCHOLARSHIPS.find((p) => p.id === id)?.title ?? id}</span><button aria-label="선택 취소" onClick={() => { const p = SCHOLARSHIPS.find((item) => item.id === id); if (p) experiment.toggleSelect(id, p.title); }} className="text-red-600">취소</button></li>)}</ul><button disabled={busy} onClick={() => void submit()} className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? "제출 중…" : "최종 제출"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</aside>
    </div>
    {selectedPost && <div role="dialog" aria-modal="true" aria-labelledby="post-title" className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedPost(null)}><article className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between gap-4"><div><p className="text-sm text-blue-700">{selectedPost.category} · {selectedPost.postedAt}</p><h2 id="post-title" className="mt-1 text-xl font-bold">{selectedPost.title}</h2></div><button aria-label="닫기" onClick={() => setSelectedPost(null)} className="text-2xl">×</button></div><pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7">{selectedPost.body}</pre>{selectedPost.attachments.map((file) => <button key={file.name} onClick={() => experiment.log({ type: "ATTACHMENT_CLICK", post_id: selectedPost.id, post_title: selectedPost.title, attachment_name: file.name })} className="mr-2 mt-4 rounded border px-3 py-2 text-sm">첨부파일: {file.name}</button>)}<div className="mt-6 flex justify-between"><button onClick={() => { experiment.toggleSelect(selectedPost.id, selectedPost.title); }} className="rounded bg-blue-700 px-4 py-2 text-white">{experiment.selectedIds.includes(selectedPost.id) ? "선택 해제" : "장학금 선택"}</button><button onClick={() => setSelectedPost(null)} className="rounded border px-4 py-2">닫기</button></div></article></div>}
  </main>;
}

export default function Home() {
  return <ExperimentProvider><Experiment /></ExperimentProvider>;
}
