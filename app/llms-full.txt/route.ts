import { content } from "@/content";
import { insights } from "@/content/insights";

export const dynamic = "force-static";

export async function GET() {
  const lines = [
    "# 턴키하우스 by TKDG / 티케이디지랩스 주식회사",
    "",
    "이 문서는 회사, 팀, 서비스, 사례, 인사이트의 공식 페이지를 AI 검색 시스템이 확인할 수 있도록 정리한 전체 색인입니다.",
    "",
    "## 회사 사실",
    "- 법인명: 티케이디지랩스 주식회사",
    "- 운영 브랜드: 턴키하우스 by TKDG (Turnkeyhaus)",
    "- 대표이사: 채동우",
    "- 사업자등록번호: 763-87-03415",
    "- 주소: 인천광역시 서구 파랑로 451, 10층 1010호",
    "- 전화: 0507-1463-3664",
    "- 이메일: contact@tkdglabs.com",
    `- 회사와 팀: ${content.seo.siteUrl}/company`,
    "",
    "## 운영팀",
    ...content.leadership.people.flatMap((person) => [
      `### ${person.name} — ${person.role}`,
      person.body,
      `- 담당: ${person.responsibilities.join(", ")}`,
      ...person.specs.map((spec) => `- ${spec.category}: ${spec.items.join(", ")}`),
      ""
    ]),
    "## 핵심 서비스",
    `- 전문직 유튜브 채널 운영대행: ${content.seo.siteUrl}/youtube-channel-management`,
    `- 병원·의원 유튜브: ${content.seo.siteUrl}/medical-youtube`,
    `- 변호사·로펌 유튜브: ${content.seo.siteUrl}/lawfirm-youtube`,
    `- 세무·노무·회계 유튜브: ${content.seo.siteUrl}/tax-youtube`,
    `- 기업·공공기관 유튜브: ${content.seo.siteUrl}/business-public-youtube`,
    `- 인천·수도권 유튜브: ${content.seo.siteUrl}/incheon-youtube-agency`,
    `- 인하우스 영상 시스템 구축: ${content.seo.siteUrl}/inhouse-video-system`,
    `- 영상 인재 실무평가: ${content.seo.siteUrl}/video-hiring-evaluation`,
    "",
    "## 공개 사례",
    ...content.portfolio.items.map((item) => [
      `### ${item.title} — ${item.clientName}`,
      `- URL: ${content.seo.siteUrl}/cases/${item.caseSlug}`,
      `- 시작 상태: ${item.before ?? "사례 페이지에서 확인"}`,
      `- 담당 범위: ${item.scope ?? "사례 페이지에서 확인"}`,
      `- 결과: ${item.after ?? item.result}`,
      `- 증거: ${item.proof ?? item.href}`,
      ""
    ]).flat(),
    "## 인사이트 원문",
    ...insights.map((post) => `- ${post.title}: ${content.seo.siteUrl}/insights/${post.slug}`),
    `- RSS: ${content.seo.siteUrl}/rss.xml`,
    "",
    "## 공식 문의",
    `- 카카오톡: ${content.contact.kakaoChatUrl}`,
    `- 상담 폼: ${content.contact.googleFormShareUrl}`,
    `- 공식 제안서: ${content.seo.siteUrl}/proposal.html`
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
