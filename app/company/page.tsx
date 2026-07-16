import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";
import {
  ORGANIZATION_ID,
  SITE_URL,
  breadcrumbJsonLd,
  organizationJsonLd,
  serializeJsonLd
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "티케이디지랩스 회사·운영팀 소개",
  description:
    "티케이디지랩스 주식회사와 턴키하우스 운영팀을 소개합니다. 채동우·양현·손현우가 전략, 채널 운영, 촬영을 고정 담당합니다.",
  alternates: { canonical: `${SITE_URL}/company` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/company`,
    title: "회사·운영팀 소개 | 턴키하우스 by TKDG",
    description: "처음 진단한 팀이 기획, 촬영, 발행, 월간 리뷰까지 이어서 맡습니다.",
    images: [{ url: `${SITE_URL}${content.seo.ogImagePath}`, width: 1200, height: 630 }]
  }
};

const shell = "mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-12";

export default function CompanyPage() {
  const peopleJsonLd = content.leadership.people.map((person) => {
    const education = person.specs.find((spec) => spec.category === "학력")?.items ?? [];
    const credentials = person.specs.find((spec) => spec.category === "자격")?.items ?? [];

    return {
      "@type": "Person",
      "@id": `${SITE_URL}/company#${person.name === "채동우" ? "chae-dongwoo" : person.name === "양현" ? "yang-hyun" : "son-hyunwoo"}`,
      name: person.name,
      alternateName: person.englishName,
      jobTitle: person.role,
      description: person.body,
      image: `${SITE_URL}${person.image.src}`,
      worksFor: { "@id": ORGANIZATION_ID },
      knowsAbout: person.responsibilities,
      alumniOf: education.map((name) => ({ "@type": "EducationalOrganization", name })),
      hasCredential: credentials.map((name) => ({ "@type": "EducationalOccupationalCredential", name }))
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd,
      ...peopleJsonLd,
      breadcrumbJsonLd([
        { name: "홈", path: "/" },
        { name: "회사·운영팀", path: "/company" }
      ]),
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/company#webpage`,
        url: `${SITE_URL}/company`,
        name: "티케이디지랩스·턴키하우스 회사와 운영팀 소개",
        inLanguage: "ko-KR",
        about: { "@id": ORGANIZATION_ID }
      }
    ]
  };

  return (
    <main id="main-content" className="min-h-screen bg-white pt-[82px] text-[#0b0b0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      <section className="border-b border-black/15">
        <div className={`${shell} py-7 md:py-9`}>
          <nav aria-label="현재 위치" className="flex items-center gap-2 text-[12px] font-semibold text-black/48">
            <Link href="/">홈</Link><span aria-hidden="true">/</span><span>회사·운영팀</span>
          </nav>
        </div>
      </section>

      <section className="border-b border-black/15">
        <div className={`${shell} grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#149c83]">TKDG Labs Co., Ltd. · TURNKEYHAUS</p>
            <h1 className="mt-6 max-w-[900px] break-keep text-[clamp(44px,6vw,88px)] font-semibold leading-[1.12] tracking-[-0.055em]">
              처음 진단한 팀이<br />운영의 끝까지 함께합니다.
            </h1>
          </div>
          <p className="max-w-[39rem] break-keep text-[17px] leading-[1.9] text-black/68 md:text-[19px]">
            턴키하우스 by TKDG는 티케이디지랩스 주식회사의 유튜브 운영 브랜드입니다. 전략, 채널 운영, 촬영 책임자를 고정해 매달 같은 설명을 다시 하지 않아도 되는 구조를 만듭니다.
          </p>
        </div>
      </section>

      <section className="border-b border-black/15 bg-[#f4f3ef]">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.72fr_1.28fr] md:py-20`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-black/48">회사 개요</p>
            <h2 className="mt-4 break-keep text-[34px] font-semibold leading-[1.18] tracking-[-0.04em] md:text-[48px]">한 편의 제작보다<br />운영의 연속성을 봅니다.</h2>
          </div>
          <dl className="divide-y divide-black/15 border-y border-black/15">
            {[
              ["법인명", content.footer.companyName],
              ["설립", "2025년"],
              ["브랜드", "턴키하우스 by TKDG"],
              ["대표이사", "채동우"],
              ["사업자등록번호", "763-87-03415"],
              ["주소", "인천광역시 서구 파랑로 451, 10층 1010호"],
              ["연락처", "0507-1463-3664 · contact@tkdglabs.com"],
              ["주요 업무", "전문직 유튜브 월간 운영 · 인하우스 영상팀 구축 · 영상 인재 실무평가"]
            ].map(([label, value]) => (
              <div key={label} className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                <dt className="text-[13px] font-bold tracking-[0.06em] text-black/48">{label}</dt>
                <dd className="break-keep text-[16px] font-medium leading-[1.75]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-7 border-b border-black/15 pb-10 md:grid-cols-[1fr_0.65fr] md:items-end">
            <h2 className="break-keep text-[40px] font-semibold leading-[1.08] tracking-[-0.05em] md:text-[64px]">실제로 채널을 맡는 사람들</h2>
            <p className="break-keep text-[16px] leading-[1.85] text-black/62">홈페이지에서 보인 팀이 미팅, 기획, 촬영, 월간 리뷰를 직접 이어갑니다. 각 담당자의 경력과 역할을 공개합니다.</p>
          </div>

          <div className="divide-y divide-black/15">
            {content.leadership.people.map((person, index) => (
              <article id={person.name === "채동우" ? "chae-dongwoo" : person.name === "양현" ? "yang-hyun" : "son-hyunwoo"} key={person.name} className="grid gap-8 py-12 lg:grid-cols-[70px_260px_0.72fr_1.28fr] lg:items-start lg:gap-10 lg:py-16">
                <span className="text-[13px] font-bold text-[#149c83]">0{index + 1}</span>
                <figure className="relative aspect-[4/5] overflow-hidden bg-[#eee]">
                  <Image src={person.image.src} alt={person.image.alt} fill sizes="(max-width: 1024px) 70vw, 260px" className="object-cover" />
                </figure>
                <div>
                  <p className="text-[12px] font-bold uppercase leading-[1.7] tracking-[0.08em] text-black/48">{person.role}</p>
                  <h3 className="mt-3 text-[44px] font-semibold leading-none tracking-[-0.05em]">{person.name}</h3>
                  <p className="mt-2 text-[13px] text-black/45">{person.englishName}</p>
                  <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
                    {person.responsibilities.map((item) => <li key={item} className="text-[13px] font-semibold text-[#117c69]">{item}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="max-w-[50rem] whitespace-pre-line break-keep text-[17px] leading-[1.95] text-black/70">{person.body}</p>
                  <div className="mt-8 grid gap-7 sm:grid-cols-3">
                    {person.specs.map((spec) => (
                      <div key={spec.category} className="border-t border-black/18 pt-4">
                        <h4 className="text-[12px] font-bold tracking-[0.12em] text-black/45">{spec.category}</h4>
                        <ul className="mt-3 space-y-2">
                          {spec.items.map((item) => <li key={item} className="break-keep text-[14px] leading-[1.65] text-black/72">{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0b0a] text-white">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-20`}>
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#21c1a2]">다음 단계</p>
            <h2 className="mt-5 max-w-[850px] break-keep text-[38px] font-semibold leading-[1.15] tracking-[-0.045em] md:text-[58px]">우리 팀과 맞는지<br />채널 이야기부터 나눠보세요.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={content.contact.kakaoChatUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center bg-[#21c1a2] px-6 text-[14px] font-bold text-[#06211c]">카카오톡 상담 ↗</a>
            <Link href="/youtube-channel-management" className="inline-flex min-h-12 items-center border border-white/30 px-6 text-[14px] font-bold">서비스 범위 보기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
