(() => {
  let rows = [];
  const session = { participant_id: '', test_round: '1', persona_type: 'A', session_id: crypto.randomUUID(), ip_address: 'unknown', started_at: '', events: [], selected_ids: [] };
  const chosen = new Map();
  const visits = new Map();
  let current = null;
  let openedAt = 0;
  let listBoard = document.querySelector('.ko.board');
  let page = new URL(location.href).searchParams.get('article.offset') === '10' ? 2 : 1;
  const firstPageIds = ['378223','378058','366852','339252','214755','378549','378276','378243','378203','378186','378178','377875','377873','377860','377824'];
  const secondPageIds = ['378223','378058','366852','339252','214755','377769','377754','377730','377722','377718','377668','377613','377612','377470','377206'];
  const profiles = {
    A: '프로필 1 · 경영학과 · 1학년 2학기 재학 중 (2027-1학기 2학년 1학기 진학 예정) · 전체 평점 3.25 · 직전 학기 11학점 이수 · 한국장학재단 6구간 · 일반 학생, 기존 교외장학 수혜 없음 · 주말 고정 아르바이트로 토요일 전일 세미나 및 프로그램 참여 불가',
    B: '프로필 2 · 환경안전공학과 · 3학년 1학기 재학 중 (2027-1학기 3학년 2학기 진학 예정) · 전체 평점 3.20 · 매학기 12학점 이상 이수, 직전 학기 15학점 · 한국장학재단 9구간 · 일반 학생, 기존 교외장학 수혜 없음 · 주말 학회와 연구실 일정으로 토요일 종일 외부 프로그램 참석 불가'
  };
  const style = document.createElement('style');
  style.textContent = '#ut-start{position:fixed;inset:0;z-index:99999;background:#0009;display:flex;align-items:center;justify-content:center;padding:16px} .ut-card{box-sizing:border-box;background:white;width:min(560px,100%);max-height:90vh;overflow:auto;padding:30px;border-top:5px solid #0067b3;box-shadow:0 10px 40px #0004;font:16px Arial,sans-serif;color:#222} .ut-card h2{font-size:24px;margin:0 0 16px} .ut-card label{display:block;margin:15px 0} .ut-card input,.ut-card select{display:block;width:100%;box-sizing:border-box;padding:10px;margin-top:6px;border:1px solid #bbb} .ut-card button,#ut-bar button,.ut-select{cursor:pointer;background:#0067b3;color:#fff;border:0;padding:10px 16px} #ut-bar{position:fixed;z-index:99998;right:16px;bottom:16px;background:white;box-shadow:0 3px 18px #0004;border:1px solid #ddd;padding:12px;display:none;font:14px Arial,sans-serif} .ut-select{margin-left:8px;font-size:12px;padding:5px 8px} #ut-error{color:#b00020;max-width:280px} .board-table tr[hidden]{display:none!important}';
  document.head.append(style);
  const el = html => { const container = document.createElement('div'); container.innerHTML = html; return container.firstElementChild; };
  const start = el('<div id="ut-start"><form class="ut-card"><h2>장학공지 사용성 실험</h2><p>1차와 2차에 모두 참여한다면 <strong>같은 참가자 ID</strong>를 입력해 주세요. 공지 1·2페이지를 확인하고 프로필에 해당하는 장학금을 선택하세요.</p><label>참가자 ID<input name="participant" required></label><label>실험 회차<select name="round"><option value="1">1차</option><option value="2">2차</option></select></label><label>페르소나<select name="persona"><option value="A">프로필 1</option><option value="B">프로필 2</option></select></label><p id="ut-profile" style="background:#f2f6fa;padding:14px;line-height:1.7"></p><button>실험 시작</button></form></div>');
  const bar = el('<div id="ut-bar"><strong>선택한 장학금: <span id="ut-count">0</span>개</strong> <button id="ut-profile-button">프로필 보기</button> <button id="ut-submit">최종 제출</button><div id="ut-error" role="alert"></div></div>');
  document.body.append(start, bar);
  start.querySelector('#ut-profile').textContent = profiles.A;
  start.querySelector('[name="persona"]').onchange = event => start.querySelector('#ut-profile').textContent = profiles[event.target.value];
  bar.querySelector('#ut-profile-button').onclick = () => alert(profiles[session.persona_type]);
  const log = (type, extra = {}) => session.events.push({ type, timestamp: new Date().toISOString(), t_ms: Date.now() - Date.parse(session.started_at), ...extra });
  start.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    session.participant_id = form.participant.value.trim();
    session.test_round = form.round.value;
    session.persona_type = form.persona.value;
    if (!session.participant_id) return;
    try { const response = await fetch('/api/ip'); session.ip_address = (await response.json()).ip || 'unknown'; } catch {}
    session.started_at = new Date().toISOString();
    log('EXPERIMENT_START', { page: 'list' });
    start.remove(); bar.style.display = 'block';
  });
  function bindList(board, ids) {
  rows = [...board.querySelectorAll('.board-table tbody tr')].filter(row => row.querySelector('.b-title-box a'));
  rows.forEach((row, index) => {
    const link = row.querySelector('.b-title-box a');
    const id = ids[index];
    const title = link.textContent.trim().replace(/\s+/g, ' ');
    link.addEventListener('click', event => {
      event.preventDefault(); event.stopImmediatePropagation();
      void showArticle(id, title, true);
    }, true);
    const button = document.createElement('button'); button.className = 'ut-select'; button.textContent = '선택';
    button.addEventListener('click', event => { event.preventDefault(); toggle(id, title); });
    row.querySelector('.b-title-box').append(button);
  });
  board.querySelector('#searchForm')?.addEventListener('submit', event => {
    event.preventDefault(); const query = board.querySelector('#search_val').value.trim().toLowerCase();
    log('SEARCH', { query, search_scope: 'title_body' });
    rows.forEach(row => row.hidden = !row.textContent.toLowerCase().includes(query));
  }, true);
  board.querySelectorAll('.board-tab-ul01 a[data-id]').forEach(tab => tab.addEventListener('click', event => {
    event.preventDefault(); event.stopImmediatePropagation();
    const category = tab.textContent.trim();
    rows.forEach(row => row.hidden = category !== '전체' && row.cells[1]?.textContent.trim() !== category);
    board.querySelectorAll('.board-tab-ul01 li').forEach(li => li.classList.remove('active'));
    tab.closest('li').classList.add('active');
  }, true));
  board.querySelectorAll('.board-table .btn-popup-file, .board-table .b-popup-file-wrap a').forEach(link => link.addEventListener('click', () => log('ATTACHMENT_CLICK', { attachment_name: link.textContent.trim() }), true));
  board.querySelectorAll('.b-paging-wrap a').forEach(link => {
    const label = link.textContent.trim();
    const targetPage = label === '1' || /첫 페이지|이전 페이지/.test(link.title) ? 1 : label === '2' || /다음 페이지|마지막 페이지/.test(link.title) ? 2 : 0;
    if (!targetPage) { link.closest('li').hidden = true; return; }
    link.addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); if (targetPage !== page) void showPage(targetPage); }, true);
    if (targetPage === page && /다음 페이지|마지막 페이지|이전 페이지|첫 페이지/.test(link.title)) link.closest('li').hidden = true;
  });
  }
  bindList(listBoard, page === 2 ? secondPageIds : firstPageIds);
  async function showPage(nextPage, updateHistory = true) {
    if (current) leaveArticle();
    if (nextPage === page) return;
    try {
      const response = await fetch(nextPage === 2 ? '/?article.offset=10&articleLimit=10' : '/');
      if (!response.ok) throw new Error('목록을 불러오지 못했습니다.');
      const board = new DOMParser().parseFromString(await response.text(), 'text/html').querySelector('.ko.board.list');
      if (!board) throw new Error('목록 화면을 찾지 못했습니다.');
      listBoard.replaceWith(board); listBoard = board; page = nextPage;
      bindList(board, page === 2 ? secondPageIds : firstPageIds);
      log('PAGE_VIEW', { page: 'list', page_number: page });
      if (updateHistory) history.pushState({ page }, '', page === 2 ? '/?article.offset=10&articleLimit=10' : '/');
      window.scrollTo(0, 0);
    } catch (error) { bar.querySelector('#ut-error').textContent = error.message; }
  }
  function toggle(id, title) {
    if (chosen.has(id)) { chosen.delete(id); log('DESELECT_SCHOLARSHIP', { post_id: id, post_title: title }); }
    else { chosen.set(id, title); log('SELECT_SCHOLARSHIP', { post_id: id, post_title: title }); }
    bar.querySelector('#ut-count').textContent = chosen.size;
    document.querySelector('.ko.board.view .ut-select')?.replaceChildren(document.createTextNode(chosen.has(id) ? '선택 취소' : '장학금 선택'));
  }
  async function showArticle(id, title, updateHistory) {
    if (current) leaveArticle();
    try {
      const response = await fetch(`/?mode=view&articleNo=${id}`);
      if (!response.ok) throw new Error('상세 내용을 불러오지 못했습니다.');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const board = doc.querySelector('.ko.board.view');
      if (!board) throw new Error('상세 화면을 찾지 못했습니다.');
      const count = (visits.get(id) || 0) + 1; visits.set(id, count);
      log('POST_CLICK', { post_id: id, post_title: title });
      if (count > 1) log('POST_REVISIT', { post_id: id, post_title: title, visit_count: count, is_revisit: true });
      current = { id, title }; openedAt = Date.now();
      document.querySelector('.ko.board').replaceWith(board);
      board.querySelector('.b-btn-wrap ul')?.insertAdjacentHTML('beforeend', '<li><button class="b-btn-type01 b-btn-c-blue ut-select" type="button">장학금 선택</button></li>');
      const select = board.querySelector('.ut-select');
      if (select) { select.textContent = chosen.has(id) ? '선택 취소' : '장학금 선택'; select.onclick = () => toggle(id, title); }
      board.querySelectorAll('a[href*="mode=list"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); history.pushState({}, '', page === 2 ? '/?article.offset=10&articleLimit=10' : '/'); leaveArticle(); }, true));
      board.querySelectorAll('a[href*="mode=view"]').forEach(link => link.addEventListener('click', event => {
        const nextId = new URL(link.href).searchParams.get('articleNo');
        if (!nextId) return;
        event.preventDefault(); event.stopImmediatePropagation(); void showArticle(nextId, link.textContent.trim(), true);
      }, true));
      board.querySelectorAll('a.file-down-btn').forEach(link => link.addEventListener('click', event => {
        event.preventDefault(); event.stopImmediatePropagation();
        log('ATTACHMENT_CLICK', { post_id: id, post_title: title, attachment_name: link.textContent.trim() });
        window.open(`https://www.ajou.ac.kr/kr/ajou/notice_scholarship.do${link.getAttribute('href')}`, '_blank', 'noopener');
      }, true));
      log('PAGE_VIEW', { page: 'detail', post_id: id, post_title: title });
      if (updateHistory) history.pushState({ articleNo: id }, '', `/?mode=view&articleNo=${id}`);
      window.scrollTo(0, 0);
    } catch (error) { bar.querySelector('#ut-error').textContent = error.message; }
  }
  function leaveArticle() {
    if (!current) return;
    log('POST_DWELL_TIME', { post_id: current.id, post_title: current.title, dwell_ms: Date.now() - openedAt });
    document.querySelector('.ko.board.view')?.replaceWith(listBoard);
    current = null;
  }
  window.addEventListener('popstate', () => {
    const id = new URL(location.href).searchParams.get('articleNo');
    if (id) void showArticle(id, rows.find((row, index) => (page === 2 ? secondPageIds : firstPageIds)[index] === id)?.querySelector('.b-title-box a')?.textContent.trim() || '', false);
    else { leaveArticle(); void showPage(new URL(location.href).searchParams.get('article.offset') === '10' ? 2 : 1, false); }
  });
  bar.querySelector('#ut-submit').onclick = async () => {
    const button = bar.querySelector('#ut-submit'); button.disabled = true; bar.querySelector('#ut-error').textContent = '';
    const end = { type: 'EXPERIMENT_SUBMIT', timestamp: new Date().toISOString(), t_ms: Date.now() - Date.parse(session.started_at), page: 'submit' };
    const events = [...session.events, end];
    const summary = { total_duration_ms: end.t_ms, posts_clicked: events.filter(e => e.type === 'POST_CLICK').length, revisit_count: events.filter(e => e.type === 'POST_REVISIT').length, attachment_clicks: events.filter(e => e.type === 'ATTACHMENT_CLICK').length, search_count: events.filter(e => e.type === 'SEARCH').length };
    try {
      const response = await fetch('/api/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...session, summary, events, selected_ids: [...chosen.keys()], selected_scholarships: [...chosen].map(([id, title]) => ({ id, title })) }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || '저장 실패');
      session.events = events; bar.innerHTML = '<strong>제출이 완료되었습니다.</strong>';
    } catch (error) { bar.querySelector('#ut-error').textContent = error.message; button.disabled = false; }
  };
})();
