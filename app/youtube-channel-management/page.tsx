import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import {
  ORGANIZATION_ID,
  SERVICE_ID,
  SITE_URL,
  breadcrumbJsonLd,
  serializeJsonLd
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "전문직 유튜브 채널 운영대행",
  description:
    "병원·로펌·기업의 유튜브 채널을 기획, 질문지, 촬영, 편집, 썸네일, 업로드, 검색 최적화, 월간 리뷰까지 한 팀이 운영합니다.",
  alternates: { canonical: `${SITE_URL}/youtube-channel-management` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/youtube-channel-management`,
    title: "전문직 유튜브 채널 운영대행 | 턴키하우스 by TKDG",
    description: "영상 납품이 아니라 매달 판단이 쌓이는 채널 운영 구조를 만듭니다.",
    images: [{ url: `${SITE_URL}${content.seo.ogImagePath}`, width: 1200, height: 630 }]
  }
};

const shell = "mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-12";
const process = [
  ["01", "채널 진단", "현재 채널, 경쟁 채널, 검색 질문과 문의 동선을 함께 확인합니다."],
  ["02", "월간 기획", "주제 우선순위, 촬영 질문지, 롱폼과 숏폼의 역할을 정합니다."],
  ["03", "촬영 운영", "출연자가 짧은 시간에 자연스럽게 말할 수 있도록 현장 흐름을 관리합니다."],
  ["04", "편집·검수", "제목, 썸네일, 표현 리스크와 내부 검수 의견을 반영합니다."],
  ["05", "발행·검색 세팅", "설명란, 재생목록, 고정 댓글, 문의 연결을 콘텐츠 의도에 맞게 정리합니다."],
  ["06", "월간 리뷰", "조회수만 보고하지 않고 다음 달에 유지할 것과 바꿀 것을 제안합니다."]
];

const faq = [
  ["유튜브 운영대행 범위는 어디까지인가요?", "채널 진단, 월간 주제 기획, 질문지와 대본, 촬영, 편집, 썸네일, 업로드 세팅, 검색·추천 유입 점검, 월간 리뷰를 운영 범위에 맞춰 한 팀이 맡습니다."],
  ["병원이나 로펌처럼 표현이 민감한 업종도 가능한가요?", "의료·법률·세무 등 전문 분야는 촬영 전에 주의 표현을 표시하고, 편집본은 클라이언트 내부 담당자의 최종 확인을 거쳐 발행합니다."],
  ["성과는 언제 판단하나요?", "첫 90일은 채널의 기준을 수집하는 기간으로 봅니다. 클릭률, 초반 유지율, 검색 유입, 상담성 반응을 같은 포맷끼리 비교해 다음 분기 운영 방향을 정합니다."],
  ["장기계약부터 해야 하나요?", "아닙니다. 현재 채널과 운영 목적을 먼저 확인한 뒤 진단, 검증 운영, 월간 운영 중 맞는 방식을 제안합니다."],
  ["단건 촬영이나 편집만 맡길 수 있나요?", "현재는 채널 성과와 운영 책임을 연결하기 위해 월간 운영과 시스템 구축을 중심으로 진행합니다. 단건 제작만 별도로 진행하지 않습니다."]
];

export default function YoutubeChannelManagementPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": SERVICE_ID,
        name: "전문직 유튜브 채널 운영대행",
        alternateName: ["유튜브 월간 운영", "유튜브 채널 관리 대행"],
        serviceType: "유튜브 채널 기획·제작·발행·성과 리뷰",
        description: "병원·로펌·기업 등 전문직과 고관여 브랜드의 유튜브 채널을 기획부터 월간 리뷰까지 운영하는 서비스입니다.",
        url: `${SITE_URL}/youtube-channel-management`,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: "대한민국" },
        audience: [
          { "@type": "BusinessAudience", audienceType: "병원·의원" },
          { "@type": "BusinessAudience", audienceType: "변호사·로펌" },
          { "@type": "BusinessAudience", audienceType: "기업·공공기관" }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "유튜브 운영 범위",
          itemListElement: process.map(([, name, description]) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, description }
          }))
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      },
      breadcrumbJsonLd([
        { name: "홈", path: "/" },
        { name: "전문직 유튜브 채널 운영대행", path: "/youtube-channel-management" }
      ])
    ]
  };

  const coreCases = content.portfolio.items.filter((item) => item.caseType !== "format").slice(0, 3);

  return (
    <main id="main-content" className="min-h-screen bg-white pt-[82px] text-[#0b0b0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      <section className="border-b border-black/15">
        <div className={`${shell} py-7 md:py-9`}>
          <nav aria-label="현재 위치" className="flex items-center gap-2 text-[12px] font-semibold text-black/48">
            <Link href="/">홈</Link><span aria-hidden="true">/</span><span>유튜브 채널 운영대행</span>
          </nav>
        </div>
      </section>

      <section className="border-b border-black/15">
        <div className={`${shell} grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#149c83]">PROFESSIONAL YOUTUBE OPERATIONS</p>
            <h1 className="mt-6 max-w-[900px] break-keep text-[clamp(44px,6vw,88px)] font-semibold leading-[1.04] tracking-[-0.055em]">전문직 유튜브를<br />한 팀으로 운영합니다.</h1>
          </div>
          <div>
            <p className="max-w-[41rem] break-keep text-[17px] leading-[1.9] text-black/68 md:text-[19px]">병원, 로펌, 기업처럼 설명이 곧 신뢰가 되는 채널을 맡습니다. 주제 기획부터 촬영, 편집, 발행, 다음 달 판단까지 담당자가 바뀌지 않습니다.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={content.contact.kakaoChatUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center bg-[#21c1a2] px-6 text-[14px] font-bold text-[#06211c]">카카오톡으로 채널 보내기 ↗</a>
              <a href="/proposal.html" className="inline-flex min-h-12 items-center border border-black/25 px-6 text-[14px] font-bold">공식 제안서 보기</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b0b0a] text-white">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-8 border-b border-white/20 pb-10 md:grid-cols-[1fr_0.68fr] md:items-end">
            <h2 className="break-keep text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] md:text-[62px]">영상 제작과<br />채널 운영은 다릅니다.</h2>
            <p className="break-keep text-[16px] leading-[1.9] text-white/66">잘 찍은 한 편보다 중요한 것은 다음 주제와 다음 판단이 이어지는 구조입니다. 결과물과 함께 운영 기준을 남깁니다.</p>
          </div>
          <div className="divide-y divide-white/20">
            {process.map(([number, title, body]) => (
              <article key={number} className="grid gap-3 py-7 md:grid-cols-[100px_0.75fr_1.25fr] md:items-start md:gap-10">
                <span className="text-[13px] font-bold text-[#21c1a2]">{number}</span>
                <h3 className="text-[25px] font-semibold tracking-[-0.035em] md:text-[32px]">{title}</h3>
                <p className="max-w-[48rem] break-keep text-[15px] leading-[1.85] text-white/65 md:text-[16px]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/15 bg-[#f4f3ef]">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-8 md:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[12px] font-bold tracking-[0.14em] text-black/48">운영 대상</p>
              <h2 className="mt-4 break-keep text-[36px] font-semibold leading-[1.16] tracking-[-0.045em] md:text-[52px]">누구에게나 맞는<br />서비스는 아닙니다.</h2>
            </div>
            <div className="divide-y divide-black/15 border-y border-black/15">
              {[
                ["병원·의원", "진료 기준과 원장님의 설명 방식을 내원 전 신뢰로 연결해야 하는 조직"],
                ["변호사·로펌", "사건 분야별 검색 질문과 상담 전 불안을 정확한 표현으로 풀어야 하는 조직"],
                ["기업·공공기관", "복잡한 서비스와 정책을 반복 가능한 월간 콘텐츠로 정리해야 하는 조직"],
                ["내부 영상팀 준비 조직", "외주 운영 이후 장비, 인력, 제작 기준을 내부에 남기고 싶은 조직"]
              ].map(([title, body], index) => (
                <article key={title} className="grid gap-3 py-6 sm:grid-cols-[48px_190px_1fr] sm:gap-5">
                  <span className="text-[12px] font-bold text-[#149c83]">0{index + 1}</span>
                  <h3 className="text-[19px] font-semibold">{title}</h3>
                  <p className="break-keep text-[15px] leading-[1.8] text-black/65">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-6 border-b border-black/15 pb-9 md:grid-cols-[1fr_0.65fr] md:items-end">
            <h2 className="break-keep text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] md:text-[62px]">운영 전후를 확인할 수 있는 사례</h2>
            <p className="break-keep text-[15px] leading-[1.85] text-black/62">시작 상태, 실제 담당 범위, 운영 결과와 확인 가능한 증거를 사례별로 공개합니다.</p>
          </div>
          <div className="divide-y divide-black/15">
            {coreCases.map((item, index) => (
              <Link href={`/cases/${item.caseSlug}`} key={item.caseSlug} className="group grid gap-4 py-7 sm:grid-cols-[60px_0.8fr_1.2fr_auto] sm:items-center sm:gap-7">
                <span className="text-[12px] font-bold text-[#149c83]">0{index + 1}</span>
                <div><p className="text-[12px] font-semibold text-black/45">{item.clientName}</p><h3 className="mt-1 text-[23px] font-semibold tracking-[-0.035em]">{item.title}</h3></div>
                <p className="break-keep text-[15px] leading-[1.75] text-black/62">{item.before} → {item.after}</p>
                <span className="text-[20px] transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/15 bg-[#f4f3ef]">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.72fr_1.28fr] md:py-24`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-black/48">자주 묻는 질문</p>
            <h2 className="mt-4 break-keep text-[36px] font-semibold leading-[1.16] tracking-[-0.045em] md:text-[52px]">맡기기 전에<br />확인할 기준입니다.</h2>
          </div>
          <div className="divide-y divide-black/15 border-y border-black/15">
            {faq.map(([question, answer], index) => (
              <details key={question} className="group py-5">
                <summary className="grid cursor-pointer list-none grid-cols-[42px_1fr_auto] items-start gap-3 text-[17px] font-semibold leading-[1.55] marker:hidden">
                  <span className="text-[12px] font-bold text-[#149c83]">0{index + 1}</span><span>{question}</span><span aria-hidden="true">＋</span>
                </summary>
                <p className="ml-[55px] mt-4 max-w-[50rem] break-keep text-[15px] leading-[1.85] text-black/65">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0b0a] text-white">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-20`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#21c1a2]">운영 가능 여부 확인</p>
            <h2 className="mt-5 max-w-[850px] break-keep text-[38px] font-semibold leading-[1.15] tracking-[-0.045em] md:text-[58px]">채널 링크와 이번 분기 목표를<br />먼저 보내주세요.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={content.contact.kakaoChatUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center bg-[#21c1a2] px-6 text-[14px] font-bold text-[#06211c]">카카오톡 상담 ↗</a>
            <Link href="/company" className="inline-flex min-h-12 items-center border border-white/30 px-6 text-[14px] font-bold">운영팀 확인</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
