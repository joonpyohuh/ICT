import { listLogs } from "@/lib/log-store";
import type { SessionLog } from "@/lib/types";

export const instant = false;

export default async function AdminPage() {
  let logs: SessionLog[] = [];
  let error = "";
  try {
    logs = await listLogs();
  } catch (e) {
    error = e instanceof Error ? e.message : "Supabase 조회에 실패했습니다.";
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-6 text-zinc-900">
      <h1 className="mb-5 text-2xl font-bold">실험 로그 관리자</h1>
      <div className="mb-4 flex flex-wrap gap-3">
        <a className="rounded bg-blue-700 px-4 py-2 text-white" href="/api/logs/csv?kind=summary">요약 데이터 CSV 다운로드</a>
        <a className="rounded bg-zinc-800 px-4 py-2 text-white" href="/api/logs/csv?kind=events">상세 이벤트 로그 CSV 다운로드</a>
      </div>
      {error && <p role="alert" className="mb-4 text-red-700">데이터를 불러오지 못했습니다: {error}</p>}
      <div className="overflow-x-auto rounded border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-100"><tr>{["참가자 ID", "회차", "페르소나", "IP", "소요 시간(ms)", "게시글 클릭", "재방문", "첨부 클릭", "검색", "선택 장학금"].map((h) => <th key={h} className="whitespace-nowrap border-b p-3">{h}</th>)}</tr></thead>
          <tbody>{logs.map((log) => <tr key={log.session_id} className="odd:bg-white even:bg-zinc-50">
            <td className="border-b p-3">{log.participant_id}</td><td className="border-b p-3">{log.test_round === "1" ? "1차" : "2차"}</td><td className="border-b p-3">{log.persona_type}</td><td className="border-b p-3">{log.ip_address}</td><td className="border-b p-3">{log.summary.total_duration_ms}</td><td className="border-b p-3">{log.summary.posts_clicked}</td><td className="border-b p-3">{log.summary.revisit_count}</td><td className="border-b p-3">{log.summary.attachment_clicks}</td><td className="border-b p-3">{log.summary.search_count}</td><td className="border-b p-3">{log.summary.selected_titles.join(", ")}</td>
          </tr>)}
          {!logs.length && !error && <tr><td className="p-6 text-center text-zinc-500" colSpan={10}>저장된 로그가 없습니다.</td></tr>}</tbody>
        </table>
      </div>
    </main>
  );
}
