/** 10월 장학공지 실험 데이터. 엑셀 컬럼을 여기 인터페이스에 맞춰 복붙하면 됨. */

export type ScholarshipCategory = "교내장학" | "교외장학" | "국가장학";

export type PersonaId = "A" | "B";
export type TestRound = "1" | "2";

export interface Attachment {
  name: string;
  kind: "pdf" | "hwp";
}

export interface ScholarshipPost {
  id: string;
  number: number;
  category: ScholarshipCategory;
  title: string;
  department: string;
  postedAt: string;
  views: number;
  isPinned: boolean;
  applyPeriod: string;
  applyMethod: string;
  interview: string;
  income: string;
  gpa: string;
  year: string;
  major: string;
  region: string;
  amount: string;
  duplicateBenefit: string;
  attachmentRequired: boolean;
  attachments: Attachment[];
  body: string;
}

export interface Persona {
  id: PersonaId;
  label: string;
  year: string;
  major: string;
  gpa: string;
  income: string;
  status: string;
  region: string;
  extra: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  A: {
    id: "A",
    label: "프로필 1",
    year: "1학년 2학기 재학 중, 2027-1학기 2학년 1학기 진학 예정",
    major: "경영학과",
    gpa: "전체 3.25, 직전 학기 11학점 이수",
    income: "6구간",
    status: "재학생",
    region: "지역 특수 조건 없음",
    extra:
      "일반 학생 · 기존 교외장학 미수혜 · 토요일 전일 세미나 및 프로그램 참여 불가",
  },
  B: {
    id: "B",
    label: "프로필 2",
    year: "3학년 1학기 재학 중, 2027-1학기 3학년 2학기 진학 예정",
    major: "환경안전공학과",
    gpa: "전체 3.20, 매학기 12학점 이상, 직전 학기 15학점 이수",
    income: "9구간",
    status: "재학생",
    region: "지역 특수 조건 없음",
    extra:
      "일반 학생 · 기존 교외장학 미수혜 · 토요일 종일 외부 프로그램 참여 불가",
  },
};

export function personaBanner(p: Persona): string {
  return `${p.year} / ${p.major} / ${p.gpa} / 소득 ${p.income} / ${p.status} / ${p.region}`;
}

const DEPT = "학생지원팀";

function files(need: boolean): Attachment[] {
  if (!need) return [];
  return [
    { name: "공고문.pdf", kind: "pdf" },
    { name: "신청서.hwp", kind: "hwp" },
  ];
}

function noticeBody(p: {
  title: string;
  year: string;
  major: string;
  gpa: string;
  income: string;
  region: string;
  amount: string;
  applyPeriod: string;
  applyMethod: string;
  interview: string;
  duplicateBenefit: string;
}): string {
  return [
    "학생지원팀에서는 아래와 같이 장학 사업을 안내하오니, 지원 자격을 확인하신 후 기한 내에 신청하여 주시기 바랍니다.",
    "",
    "□ 사업명",
    `  ${p.title}`,
    "",
    "□ 지원대상",
    `  - 학년/학적: ${p.year}`,
    `  - 학과: ${p.major}`,
    `  - 성적기준: ${p.gpa}`,
    `  - 소득구간: ${p.income}`,
    `  - 지역: ${p.region}`,
    "",
    "□ 지원금액",
    `  ${p.amount}`,
    "",
    "□ 신청기간",
    `  ${p.applyPeriod} (마감일 18:00까지 도착분에 한함. 별도 공지가 없는 경우 해당 기간을 준수)`,
    "",
    "□ 신청방법",
    `  ${p.applyMethod}`,
    "",
    "□ 면접여부",
    `  ${p.interview === "O" ? "면접 실시 (일정은 서류 합격자에 한해 개별 안내)" : "면접 없음 (서류 심사)"}`,
    "",
    "□ 중복수혜 가능여부",
    `  ${p.duplicateBenefit}`,
    "",
    "□ 제출서류 (예시)",
    "  1. 장학금 신청서 1부",
    "  2. 개인정보 수집·이용 동의서 1부",
    "  3. 성적증명서 1부",
    "  4. 가족관계증명서 및 소득 관련 증빙 (해당자에 한함)",
    "  5. 기타 공고문에 명시된 서류",
    "",
    "□ 유의사항",
    "  - 첨부된 공고문 및 신청서 양식을 반드시 확인한 후 신청하시기 바랍니다.",
    "  - 자격 미달, 서류 미비, 허위 기재 시 선발에서 제외되며 기 지급된 장학금은 환수될 수 있습니다.",
    "  - 문의: 학생지원팀 장학담당 (031-219-XXXX)",
    "",
    "붙임  1. 공고문 1부",
    "      2. 신청서 서식 1부.  끝.",
  ].join("\n");
}

function post(
  partial: Omit<ScholarshipPost, "department" | "body" | "attachments"> & {
    attachments?: Attachment[];
  },
): ScholarshipPost {
  return {
    department: DEPT,
    attachments: partial.attachments ?? files(partial.attachmentRequired),
    body: noticeBody(partial),
    ...partial,
  };
}

/** 핀 공지 + 2026년 10월 아주대 장학공지 15건 (엑셀 원본) */
export const SCHOLARSHIPS: ScholarshipPost[] = [
  post({
    id: "pin-guide",
    number: 0,
    category: "교외장학",
    title: "[공지] 장학금 통합 안내(교내, 교외, 국가장학)",
    postedAt: "2023-05-16",
    views: 165906,
    isPinned: true,
    applyPeriod: "상시",
    applyMethod: "해당 공지 확인",
    interview: "X",
    income: "장학 종류별 상이",
    gpa: "장학 종류별 상이",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "장학 종류별 상이",
    duplicateBenefit: "장학 종류별 상이",
    attachmentRequired: false,
    attachments: [],
  }),
  post({
    id: "pin-letter",
    number: 0,
    category: "교외장학",
    title: "[공지] 장학생 신청을 위한 추천서 발급 안내",
    postedAt: "2025-02-05",
    views: 141050,
    isPinned: true,
    applyPeriod: "상시",
    applyMethod: "학생지원팀 방문/이메일",
    interview: "X",
    income: "제한X",
    gpa: "제한X",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "해당없음",
    duplicateBenefit: "해당없음",
    attachmentRequired: true,
  }),
  post({
    id: "s-15",
    number: 1073,
    category: "교외장학",
    title: "전기공사공제조합장학회",
    postedAt: "2026-10-29",
    views: 313,
    isPinned: false,
    applyPeriod: "11/2~11/13",
    applyMethod: "외부홈페이지",
    interview: "X",
    income: "가구 월평균 소득이 2025년도 기준 중위소득(4인가구기준) 대비 200% 미만인 자",
    gpa: "직전학기 12학점 이상 취득&전체학점평균 3.0이상",
    year: "재학생",
    major: "전기관련학과",
    region: "제한X",
    amount: "500만원",
    duplicateBenefit: "제한X",
    attachmentRequired: false,
  }),
  post({
    id: "s-14",
    number: 1072,
    category: "교외장학",
    title: "통영시 저소득 대학생 장학금",
    postedAt: "2026-10-29",
    views: 247,
    isPinned: false,
    applyPeriod: "11/2~11/23",
    applyMethod: "방문 또는 우편접수",
    interview: "X",
    income: "기초생활 수급자 또는 차상위계층",
    gpa: "26-1학기 기준 학점평균 C 이상",
    year: "재학생",
    major: "제한X",
    region: "통영시",
    amount: "100만원",
    duplicateBenefit:
      "통영시 저소득 대학생 장학금 4회 이상 수혜자, 생활비 성격의 장학금 수혜자, 2026년 통영시 성적우수 장학금, 지역대상 장학금, 인재육성 장학금 수혜자는 불가",
    attachmentRequired: true,
  }),
  post({
    id: "s-13",
    number: 1071,
    category: "교내장학",
    title: "바르게/1-1-1 캠페인 장학",
    postedAt: "2026-10-23",
    views: 858,
    isPinned: false,
    applyPeriod: "9/30~10/26",
    applyMethod: "이메일",
    interview: "X",
    income: "0~8구간 해당자",
    gpa: "직전학기 12학점 이상 취득&전체학점평균 2.0이상",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "최대 100만원",
    duplicateBenefit: "제한X",
    attachmentRequired: false,
  }),
  post({
    id: "s-12",
    number: 1070,
    category: "교외장학",
    title: "선원가족장학",
    postedAt: "2026-10-23",
    views: 472,
    isPinned: false,
    applyPeriod: "9/1~10/30",
    applyMethod: "방문 또는 우편접수",
    interview: "X",
    income: "2025년 기준 선원월평균 임금 이하",
    gpa: "직전학기 학점평균 2.0 이상",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "최대 350만원",
    duplicateBenefit: "등록금을 초과하여 사내학자금 또는 타기관 장학 받는 경우 불가",
    attachmentRequired: true,
  }),
  post({
    id: "s-11",
    number: 1069,
    category: "교외장학",
    title: "엔지니어링인지육성재단장학",
    postedAt: "2026-10-21",
    views: 428,
    isPinned: false,
    applyPeriod: "10/19~11/13",
    applyMethod: "이메일제출 & 폼작성",
    interview: "X",
    income: "구체적인 조건X",
    gpa: "학기별 12학점 이상 이수 & 학점평균 3.0 이상",
    year: "3학기 이상 재학중인 자",
    major: "엔지니어링 및 에너지 관련 학과",
    region: "제한X",
    amount: "500만원",
    duplicateBenefit: "제한X",
    attachmentRequired: true,
  }),
  post({
    id: "s-10",
    number: 1068,
    category: "교내장학",
    title: "국가고시,국가자격장학",
    postedAt: "2026-10-20",
    views: 512,
    isPinned: false,
    applyPeriod: "10/20~11/1",
    applyMethod: "이메일제출",
    interview: "X",
    income: "제한X",
    gpa: "직전학기 12학점 이상 이수&전체학점평균 2.0 이상",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "시험에 따라 상이",
    duplicateBenefit: "동일한 시험으로 수혜한 적이 있는 경우 불가",
    attachmentRequired: false,
  }),
  post({
    id: "s-09",
    number: 1067,
    category: "교외장학",
    title: "한국지도자육성장학",
    postedAt: "2026-10-20",
    views: 390,
    isPinned: false,
    applyPeriod: "10/20~11/4",
    applyMethod: "이메일제출",
    interview: "O",
    income: "제한X",
    gpa: "학점평균 3.5 이상",
    year: "27-1학기 기준 3-1 진학예정자",
    major: "제한X",
    region: "제한X",
    amount: "학기당 350만원 (최대 4학기)",
    duplicateBenefit: "제한X",
    attachmentRequired: false,
  }),
  post({
    id: "s-08",
    number: 1066,
    category: "교외장학",
    title: "두산연강재단",
    postedAt: "2026-10-20",
    views: 641,
    isPinned: false,
    applyPeriod: "10/14~11/13",
    applyMethod: "외부홈페이지",
    interview: "O",
    income: "6분위 이내",
    gpa: "학점평균 3.0 이상",
    year: "27-1학기 기준 2-1 진학예정자",
    major: "제한X",
    region: "제한X",
    amount: "학기당 400만원 (요건충족시 졸업까지 지원)",
    duplicateBenefit: "국가장학금 및 교내장학금(ex. 성적장학)은 중복가능",
    attachmentRequired: true,
  }),
  post({
    id: "s-07",
    number: 1065,
    category: "교외장학",
    title: "거창군지역출신 등록금지원사업",
    postedAt: "2026-10-19",
    views: 288,
    isPinned: false,
    applyPeriod: "10/16~11/16",
    applyMethod: "외부홈페이지",
    interview: "X",
    income: "제한X",
    gpa: "직전학기 12학점 이상 이수&전체학점평균 2.5 이상",
    year: "3학년 이상",
    major: "제한X",
    region: "거창군",
    amount: "100만원",
    duplicateBenefit: "제한X (단, 국가장학금을 신청한 자여야함)",
    attachmentRequired: true,
  }),
  post({
    id: "s-06",
    number: 1064,
    category: "교외장학",
    title: "인재림 제7기 장학생",
    postedAt: "2026-10-19",
    views: 355,
    isPinned: false,
    applyPeriod: "10/8~10/29",
    applyMethod: "외부홈페이지",
    interview: "O",
    income: "제한X",
    gpa: "제한X",
    year: "28년 2월까지 학부생 신분인 사람",
    major: "제한X",
    region: "제한X",
    amount: "800만원",
    duplicateBenefit: "제한X",
    attachmentRequired: true,
  }),
  post({
    id: "s-05",
    number: 1063,
    category: "교외장학",
    title: "북한이탈청소년 장학생",
    postedAt: "2026-10-08",
    views: 190,
    isPinned: false,
    applyPeriod: "10/6~10/26",
    applyMethod: "외부홈페이지",
    interview: "O",
    income: "구체적인 조건X",
    gpa: "학점평균 3.0 이상",
    year: "27-1학기 기준 2학년 이상 진학예정자",
    major: "제한X",
    region: "제한X",
    amount: "학기당 300만원(최대 6학기)",
    duplicateBenefit: "타기관 장학금 수혜자는 불가",
    attachmentRequired: true,
  }),
  post({
    id: "s-04",
    number: 1062,
    category: "교외장학",
    title: "아산사회복지재단 의생명과학",
    postedAt: "2026-10-08",
    views: 274,
    isPinned: false,
    applyPeriod: "10/6~10/26",
    applyMethod: "외부홈페이지",
    interview: "O",
    income: "구체적인 조건X",
    gpa: "학점평균 3.7 이상",
    year: "27-1학기 기준 2학년 이상 진학예정자",
    major: "의생명 과학분야",
    region: "제한X",
    amount: "학기당 300만원(최대 6학기)",
    duplicateBenefit: "타기관 장학금 수혜자는 불가",
    attachmentRequired: true,
  }),
  post({
    id: "s-03",
    number: 1061,
    category: "교외장학",
    title: "우양재단 동행장학생",
    postedAt: "2026-10-06",
    views: 221,
    isPinned: false,
    applyPeriod: "10/6~10/18",
    applyMethod: "외부홈페이지",
    interview: "X",
    income: "가족돌봄청년&2구간 이내",
    gpa: "제한X",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "100만원",
    duplicateBenefit: "현재 우양재단장학금 수혜자는 불가",
    attachmentRequired: true,
  }),
  post({
    id: "s-02",
    number: 1060,
    category: "교외장학",
    title: "2027 대상장학생",
    postedAt: "2026-10-06",
    views: 498,
    isPinned: false,
    applyPeriod: "10/6~11/11",
    applyMethod: "이메일제출",
    interview: "O",
    income: "제한X",
    gpa: "학점평균 3.5 이상",
    year: "2-2 이상 재학생",
    major: "제한X",
    region: "제한X",
    amount: "4학기 등록금 전액",
    duplicateBenefit: "제한X",
    attachmentRequired: true,
  }),
  post({
    id: "s-01",
    number: 1059,
    category: "교외장학",
    title: "든든학업지원금",
    postedAt: "2026-10-02",
    views: 1333,
    isPinned: false,
    applyPeriod: "9/1~10/8",
    applyMethod: "외부홈페이지",
    interview: "X",
    income: "5구간 이내",
    gpa: "제한X",
    year: "재학생",
    major: "제한X",
    region: "제한X",
    amount: "200만원",
    duplicateBenefit: "기존선발학생은 불가",
    attachmentRequired: true,
  }),
];

export const PAGE_SIZE = 10;

export function getPost(id: string): ScholarshipPost | undefined {
  return SCHOLARSHIPS.find((p) => p.id === id);
}

export function searchableText(p: ScholarshipPost, includeBody: boolean): string {
  const base = `${p.title} ${p.category} ${p.department}`;
  return includeBody
    ? `${base} ${p.body} ${p.income} ${p.gpa} ${p.year} ${p.major} ${p.region} ${p.amount}`
    : base;
}
