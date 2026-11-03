import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const id = query.get("articleNo");
  let html: string;
  if (query.get("mode") === "view" && id && /^\d+$/.test(id)) {
    try {
      html = await readFile(path.join(process.cwd(), "public", "details", `${id}.html`), "utf8");
    } catch {
      const response = await fetch(`https://www.ajou.ac.kr/kr/ajou/notice_scholarship.do?mode=view&articleNo=${id}`);
      if (!response.ok) return new Response("공지 내용을 불러오지 못했습니다.", { status: 502 });
      html = await response.text();
    }
  } else {
    html = await readFile(path.join(process.cwd(), "public", "ajou.html"), "utf8");
  }
  return new Response(html.replace("</body>", '<script src="/experiment.js"></script></body>'), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
