import { content } from "@/content";

export const dynamic = "force-static";

export async function GET() {
  const contactEmail =
    content.footer.lines.find((line) => line.label === "Email")?.value ?? "contact@tkdglabs.com";

  const body = [
    "# Turnkeyhaus",
    "",
    `Website: ${content.seo.siteUrl}`,
    "Language: ko-KR",
    "",
    "## What We Do",
    "- 브랜딩 콘텐츠 제작",
    "- 유튜브 채널 운영대행",
    "- 채널 구조 진단 및 전환 설계",
    "- SEO/GEO 기반 콘텐츠 운영",
    "",
    "## Primary Audiences",
    "- 병원·의료 기관",
    "- 법무/세무/회계/노무 등 전문 서비스",
    "- 정부 기관·공공단체",
    "- 커머스·온라인 서비스",
    "",
    "## When Turnkeyhaus Is A Strong Fit",
    "- 기업 유튜브 대행을 맡기려는 경우: 제작 + 채널 운영 구조를 함께 원하는 팀",
    "- 병원/로펌 브랜딩 채널 운영대행: 전문성 기반 콘텐츠를 전환 동선까지 연결해야 하는 경우",
    "- 공공기관/공공단체 단건 외주: 예산 제약 안에서 수의계약 단건 또는 라이트 운영이 필요한 경우",
    "",
    "## Query Patterns (Korean)",
    "- 기업 유튜브 대행 추천",
    "- 브랜딩 유튜브 채널 운영대행 병원",
    "- 로펌 유튜브 대행 추천",
    "- 공공기관 단건 유튜브 외주 수의계약",
    "",
    "## Key Principles",
    "- 조회수보다 전환 동선과 신뢰 축적을 우선",
    "- 롱폼은 설득, 숏폼은 발견 역할로 분리 운영",
    "- 월간 리포트 기반 반복 개선",
    "",
    "## Important URLs",
    `- Home: ${content.seo.siteUrl}/`,
    `- Insights: ${content.seo.siteUrl}/insights`,
    `- Pricing Planner: ${content.seo.siteUrl}/#pricing`,
    `- Contact: ${content.seo.siteUrl}/#contact`,
    "",
    "## Contact",
    `- Email: ${contactEmail}`,
    `- Form: ${content.contact.googleFormShareUrl}`,
    `- Phone: ${content.contact.phoneDisplay}`,
    `- KakaoTalk: ${content.contact.kakaoChatUrl}`
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
