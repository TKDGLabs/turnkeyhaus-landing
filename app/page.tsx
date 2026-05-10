import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
import { getSortedInsights } from "../content/insights";

const shell = "mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-10";
const labelClass =
  "inline-flex items-center border border-black/10 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-black/50 uppercase";
const sectionTitle =
  "whitespace-pre-line break-keep text-[32px] font-bold leading-[1.22] tracking-tight text-black md:text-[48px]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ActionLink({
  href,
  className,
  children
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const mergedClass = `${className} ${focusRing}`;

  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClass}>
      {children}
    </Link>
  );
}

function SectionHeader({
  label,
  title,
  lead,
  dark = false
}: {
  label: string;
  title: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div className="space-y-5">
      <span
        className={
          dark
            ? "inline-flex items-center border border-white/20 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/60 uppercase"
            : labelClass
        }
      >
        {label}
      </span>
      <h2 className={dark ? `${sectionTitle} text-white` : sectionTitle}>{title}</h2>
      {lead ? (
        <p
          className={
            dark
              ? "max-w-[62ch] whitespace-pre-line break-keep text-[17px] leading-[1.9] text-white/70 md:text-lg"
              : "max-w-[62ch] whitespace-pre-line break-keep text-[17px] leading-[1.9] text-black/60 md:text-lg"
          }
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

const formatInteger = (n: number) => new Intl.NumberFormat("ko-KR").format(Math.round(n));

function formatViewsKorean(n: number) {
  if (n >= 10000) {
    const tenThousands = n / 10000;
    const hasDecimal = tenThousands % 1 !== 0;
    return `${tenThousands.toFixed(hasDecimal ? 1 : 0)}만`;
  }
  return formatInteger(n);
}

function isGoogleFormEmbedUrl(url: string) {
  return (
    url.startsWith("https://docs.google.com/forms/d/e/") &&
    url.includes("/viewform?embedded=true")
  );
}

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const formEmbedUrl = content.contact.googleFormEmbedUrl.trim();
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoChatUrl = content.contact.kakaoChatUrl.trim();
  const hasFormEmbedUrl = isGoogleFormEmbedUrl(formEmbedUrl);
  const hasPhoneHref = phoneHref.startsWith("tel:");
  const hasKakaoChatUrl = kakaoChatUrl.startsWith("http://") || kakaoChatUrl.startsWith("https://");
  const [problemSupport = "", problemDetail = ""] = content.problem.lead.split("\n\n");

  const totalSubscribers = content.portfolio.items.reduce((sum, item) => sum + item.subscriberCurrent, 0);
  const totalVideoViews = content.heroStats.totalVideoViews;
  const totalVideoViewsInMan = `${formatInteger(totalVideoViews / 10000)}만+`;
  const homepageStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "유튜브 월간 운영대행 및 인하우스 영상 시스템 구축 컨설팅",
      serviceType: [
        "유튜브 월간 운영대행",
        "채널 구조 진단",
        "인하우스 영상 시스템 구축",
        "영상 인재 실무평가 지원",
        "SEO/GEO 기반 콘텐츠 운영"
      ],
      provider: {
        "@type": "Organization",
        name: content.brand.name,
        url: content.seo.siteUrl
      },
      areaServed: "KR",
      audience: [
        { "@type": "BusinessAudience", audienceType: "병원·의료 기관" },
        { "@type": "BusinessAudience", audienceType: "변호사·로펌" },
        { "@type": "BusinessAudience", audienceType: "세무·회계·노무 등 전문 서비스" },
        { "@type": "BusinessAudience", audienceType: "고관여 브랜드·공공기관·기업" }
      ],
      description: content.seo.description,
      url: content.seo.siteUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "턴키하우스 추천 질의 시나리오",
      itemListElement: content.aiRecommendation.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.prompt,
        description: item.fit,
        url: `${content.seo.siteUrl}/#fit`
      }))
    }
  ];

  return (
    <main className="bg-white pb-[88px] text-black md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur-xl">
        <div className={`${shell} flex items-center justify-between py-4`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image
              src="/logo.png"
              alt="Turnkeyhaus"
              width={176}
              height={48}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {content.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-9 items-center px-3 text-[14px] font-bold text-black/50 transition-colors hover:text-black ${focusRing}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ActionLink
            href="https://sclu.io/share/bulk/file/bf2w8ioROJvw"
            className="inline-flex h-10 items-center rounded-full bg-[#21c1a2] px-6 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            소개서 다운로드
          </ActionLink>
        </div>
      </header>

      {/* 🚀 압도적인 100% 풀스크린 시네마틱 히어로 섹션 */}
      <section id="top" className="relative flex h-[100svh] min-h-[700px] w-full flex-col justify-end overflow-hidden bg-black pb-16 md:pb-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-70"
        >
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>

        {/* 텍스트 가독성을 위한 부드러운 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className={`${shell} relative z-10 w-full`}>
          <div className="max-w-[900px] space-y-6 text-white">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#21c1a2]">턴키하우스 by TKDG</p>
            <h1 className="whitespace-pre-line break-keep text-[42px] font-bold leading-[1.15] tracking-tight md:text-[72px]">
              {content.heroValue.headline}
            </h1>
            <p className="max-w-[60ch] whitespace-pre-line break-keep text-[18px] leading-[1.8] text-white/80 md:text-[22px]">
              {content.heroValue.body}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <ActionLink
                href={content.heroValue.primaryCta.href}
                className="inline-flex items-center rounded-full bg-[#21c1a2] px-8 py-4 text-[16px] font-bold text-black transition-transform hover:scale-105"
              >
                {content.heroValue.primaryCta.label}
              </ActionLink>
              <ActionLink
                href={content.heroValue.secondaryCta.href}
                className="inline-flex items-center rounded-full border border-white/30 bg-black/40 backdrop-blur-md px-8 py-4 text-[16px] font-bold text-white transition-colors hover:bg-white/20"
              >
                {content.heroValue.secondaryCta.label}
              </ActionLink>
            </div>

            <ul className="mt-12 grid gap-3 border-t border-white/20 pt-8 text-[14px] font-medium leading-[1.6] text-white/70 sm:grid-cols-2 lg:grid-cols-4">
              {content.heroValue.trustBadges.map((badge) => (
                <li key={badge} className="break-keep flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#21c1a2]" /> {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 히어로 아래에 붙는 깔끔한 통계 섹션 */}
      <div className="border-b border-black/10 bg-white">
        <div className={`${shell} py-10 md:py-14`}>
          <dl className="grid gap-8 text-black sm:grid-cols-3">
            <div className="space-y-2">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">대표 사례</dt>
              <dd className="text-[34px] font-bold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">현재 구독자 합산</dt>
              <dd className="text-[34px] font-bold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">전체 영상 누적 조회수</dt>
              <dd className="text-[34px] font-bold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section id="problem" className="border-b border-black/10">
        <div className={`${shell} grid gap-8 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-28`}>
          <div className="space-y-6 md:sticky md:top-28 md:self-start">
            <span className={labelClass}>{content.problem.label}</span>
            <h2 className={`${sectionTitle} max-w-[13ch]`}>{content.problem.h2}</h2>
          </div>

          <div className="space-y-9">
            <p className="whitespace-pre-line break-keep text-[18px] leading-[1.9] text-black/70">{problemSupport}</p>
            <p className="whitespace-pre-line break-keep text-[17px] leading-[1.95] text-black/60">{problemDetail}</p>

            {content.problem.items.length > 0 ? (
              <ul className="grid gap-3 border-y border-black/10 py-6 text-[15px] leading-[1.8] text-black/70 md:grid-cols-3">
                {content.problem.items.map((item) => (
                  <li key={item} className="break-keep">
                    - {item}
                  </li>
                ))}
              </ul>
            ) : null}

            <figure className="overflow-hidden rounded-xl border border-black/5 bg-[#FAFAFA]">
              <Image
                src="/images/reality-illustration-optimized.jpg"
                alt="채널 진단과 운영 구조를 정리한 시각 자료"
                width={1600}
                height={1030}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </figure>

            <p className="border-t border-black/10 pt-6 text-[19px] font-bold leading-[1.75] text-black">
              {content.problem.emphasis}
            </p>
          </div>
        </div>
      </section>

      <section id="presenter-ops" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} grid gap-10 py-20 md:grid-cols-[0.76fr_1.24fr] md:gap-14 md:py-28`}>
          <SectionHeader
            label={content.presenterOps.label}
            title={content.presenterOps.h2}
            lead={content.presenterOps.lead}
          />

          <div className="space-y-8">
            <div className="border-y border-black/10">
              {content.presenterOps.points.map((point) => (
                <div key={point} className="border-b border-black/5 py-5 last:border-b-0">
                  <p className="break-keep text-[18px] font-bold leading-[1.55] text-black">
                    {point}
                  </p>
                </div>
              ))}
            </div>
            <p className="max-w-[70ch] break-keep border-l-2 border-[#21c1a2] pl-5 text-[16px] font-medium leading-[1.85] text-black/60">
              {content.presenterOps.note}
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} py-20 md:py-28`}>
          <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="space-y-8 md:sticky md:top-28 md:self-start">
              <SectionHeader
                label={content.servicePillars.label}
                title={content.servicePillars.h2}
                lead={content.servicePillars.lead}
              />
            </div>

            <div className="border-y border-black/10">
              {content.servicePillars.cards.map((card, index) => (
                <article
                  key={card.title}
                  className="grid gap-5 border-b border-black/5 py-8 last:border-b-0 md:grid-cols-[190px_1fr] md:gap-8"
                >
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#21c1a2]">
                      SERVICE 0{index + 1}
                    </p>
                    <p className="mt-2 break-keep text-[17px] font-bold leading-[1.55] text-black/60">
                      {card.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="break-keep text-[28px] font-bold leading-[1.24] tracking-tight text-black md:text-[36px]">
                      {card.headline}
                    </h3>
                    <p className="mt-4 max-w-[66ch] break-keep text-[16px] font-medium leading-[1.85] text-black/60">
                      {card.body}
                    </p>
                    <ul className="mt-6 grid gap-2 border-t border-black/5 pt-5 text-[15px] leading-[1.75] text-black/60 sm:grid-cols-2">
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                    <ActionLink
                      href={card.href}
                      className="mt-6 inline-flex items-center border-b border-[#21c1a2] pb-1 text-[15px] font-bold text-[#21c1a2] transition-colors hover:text-[#1db197]"
                    >
                      {card.ctaLabel}
                    </ActionLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="not-single" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-14">
            <SectionHeader
              label={content.exclusions.label}
              title={content.exclusions.h2}
              lead={content.exclusions.lead}
            />

            <div className="border-y border-black/10">
              {content.exclusions.items.map((item) => (
                <article key={item.title} className="border-b border-black/5 py-8 last:border-b-0">
                  <h3 className="break-keep text-[24px] font-bold leading-[1.35] tracking-tight text-black">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[74ch] break-keep text-[16px] font-medium leading-[1.85] text-black/60">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quality" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} grid gap-10 py-20 md:grid-cols-[0.76fr_1.24fr] md:gap-14 md:py-28`}>
          <SectionHeader
            label={content.videoQuality.label}
            title={content.videoQuality.h2}
            lead={content.videoQuality.lead}
          />

          <div className="space-y-8">
            <div className="grid gap-x-8 gap-y-0 border-y border-black/10 sm:grid-cols-2">
              {content.videoQuality.points.map((point, index) => (
                <div
                  key={point}
                  className={`border-b border-black/5 py-5 ${
                    index === content.videoQuality.points.length - 1 ? "border-b-0" : ""
                  } ${index >= content.videoQuality.points.length - 2 ? "sm:border-b-0" : ""}`}
                >
                  <p className="break-keep text-[17px] font-bold leading-[1.55] text-black">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <p className="max-w-[70ch] break-keep border-l-2 border-[#21c1a2] pl-5 text-[16px] font-medium leading-[1.85] text-black/60">
              {content.videoQuality.note}
            </p>
          </div>
        </div>
      </section>

      <section id="approach" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader
            label={content.strategyFrame.label}
            title={content.strategyFrame.h2}
            lead={content.approach.lead}
          />
          <StrategyChapterDeck />
          <p className="mt-10 whitespace-pre-line break-keep text-[18px] font-bold leading-[1.9] text-black text-center">
            {content.approach.keyline}
          </p>
        </div>
      </section>

      <section id="professional" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader
            label={content.professionalTargets.label}
            title={content.professionalTargets.h2}
            lead={content.professionalTargets.lead}
          />

          <div className="mt-16 space-y-16">
            {content.professionalTargets.cards.map((card, index) => (
              <article key={card.title} className="grid items-center gap-8 border-t border-black/10 pt-12 md:grid-cols-2 md:gap-12">
                <figure className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#FAFAFA] border border-black/5">
                    {card.image ? (
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col justify-end p-8">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-black/40 uppercase mb-2">
                          {card.imageFallback?.eyebrow ?? "MODEL PREVIEW"}
                        </p>
                        <div className="space-y-1">
                          {(card.imageFallback?.lines ?? ["이미지 자료 준비 중"]).map((line) => (
                            <p key={line} className="text-[22px] font-bold leading-[1.45] tracking-tight text-black">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </figure>

                <div className={`space-y-6 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <h3 className="text-[32px] font-bold tracking-tight text-black">{card.title}</h3>
                  <p className="text-[17px] leading-[1.9] text-black/60 font-medium">{card.oneLiner}</p>

                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {(card.tags ?? []).map((tag) => (
                      <span key={tag} className="text-[13px] font-bold tracking-[0.03em] text-black/50 md:text-[14px] bg-black/5 px-3 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2 border-t border-black/5 pt-5 text-[15px] font-medium leading-[1.85] text-black/60">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>- {bullet}</li>
                    ))}
                  </ul>

                  <ActionLink
                    href={card.href}
                    className="inline-flex items-center border-b border-[#21c1a2] pb-1 text-[15px] font-bold text-[#21c1a2] transition-colors hover:text-[#1db197]"
                  >
                    {card.ctaLabel}
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} grid gap-12 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-start md:py-28`}>
          <figure className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <Image
              src={content.studioProof.images[0]?.src ?? "/images/showreel-cover-optimized.jpg"}
              alt={content.studioProof.images[0]?.alt ?? "Turnkeyhaus 운영 리포트 시각 자료"}
              width={1400}
              height={840}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
          </figure>

          <div className="space-y-8 text-black">
            <SectionHeader
              label={content.studioProof.label}
              title={content.studioProof.h2}
              lead={content.studioProof.crewLead}
            />

            <ul className="space-y-3 border-y border-black/10 py-6">
              {content.studioProof.operationSystem.map((item) => (
                <li key={item} className="text-[15px] font-medium leading-[1.8] text-black/60">
                  - {item}
                </li>
              ))}
            </ul>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.studioProof.crewCards.map((crew) => (
                <div key={crew.role} className="border-t border-black/5 pt-4 bg-white p-5 rounded-xl">
                  <p className="text-[11px] font-bold tracking-[0.12em] text-black/40 uppercase mb-1">{crew.role}</p>
                  <p className="text-[17px] font-bold text-black">{crew.headline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="report-sample" className="border-b border-black/10 bg-white">
        <div className={`${shell} grid gap-10 py-20 md:grid-cols-[0.78fr_1.22fr] md:gap-14 md:py-28`}>
          <SectionHeader
            label={content.reportSample.label}
            title={content.reportSample.h2}
            lead={content.reportSample.lead}
          />

          <div className="space-y-8">
            <dl className="divide-y divide-black/5 border-y border-black/10">
              {content.reportSample.rows.map((row) => (
                <div key={row.label} className="grid gap-3 py-5 md:grid-cols-[170px_1fr] md:gap-8 items-center">
                  <dt className="text-[13px] font-bold tracking-[0.08em] text-black/40 uppercase">{row.label}</dt>
                  <dd className="break-keep text-[16px] font-bold leading-[1.7] text-black">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="break-keep text-[15px] font-medium leading-[1.85] text-black/50">{content.reportSample.note}</p>
          </div>
        </div>
      </section>

      <section id="team" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} py-20 md:py-28`}>
          <div className="grid gap-10 md:grid-cols-[0.74fr_1.26fr] md:gap-14">
            <SectionHeader
              label={content.leadership.label}
              title={content.leadership.h2}
              lead={content.leadership.lead}
            />

            <div className="border-t border-black/10">
              {content.leadership.people.map((person) => (
                <article key={person.name} className="grid gap-6 border-b border-black/5 py-8 last:border-b-0 md:grid-cols-[150px_180px_1fr] md:gap-8">
                  <figure className="relative aspect-[4/5] overflow-hidden rounded-xl border border-black/5 bg-white">
                    <Image
                      src={person.image.src}
                      alt={person.image.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 150px"
                    />
                  </figure>
                  <div className="md:pt-1">
                    <h3 className="text-[28px] font-bold tracking-tight text-black">{person.name}</h3>
                    <p className="mt-1 text-[12px] font-bold tracking-[0.12em] text-black/40 uppercase">
                      {person.englishName}
                    </p>
                    {/* 🚀 Lead 직함 대신 실제 실무 역량을 해시태그 기반으로 표시하여 전문성 강조 */}
                    <p className="mt-3 break-keep text-[14px] font-bold leading-[1.55] text-[#21c1a2]">
                      {person.responsibilities.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <div>
                    <p className="break-keep text-[16px] font-medium leading-[1.85] text-black/60">{person.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 border-t border-black/5 pt-5">
                      {person.responsibilities.map((item) => (
                        <li key={item} className="bg-black/5 px-2 py-1 rounded text-[12px] font-bold text-black/50">#{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader
            label={content.portfolio.label}
            title={content.portfolio.h2}
            lead={content.portfolio.lead}
          />

          <div className="mt-16 space-y-16">
            {content.portfolio.items.map((item) => (
              <article
                key={item.title}
                className="grid gap-8 border-t border-black/10 pt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/5 bg-black">
                  {item.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <Image
                      src={item.imageSrc}
                      alt={`${item.title} 대표 이미지`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center gap-7 md:gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[34px] font-bold leading-[1.18] tracking-tight text-black">{item.title}</h3>
                    <p className="text-[13px] font-bold tracking-[0.08em] text-black/40 uppercase">
                      클라이언트: <span className="tracking-[0.02em] text-[#21c1a2]">{item.clientName}</span>
                    </p>
                    <p className="max-w-[58ch] break-keep text-[17px] font-medium leading-[1.82] text-black/60">{item.oneLiner}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-black/5 pt-4">
                      <span className="text-[12px] font-bold tracking-[0.1em] text-black/30 uppercase mr-2">키워드</span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[13px] font-bold tracking-[0.03em] text-black/50 bg-black/5 px-2 py-1 rounded md:text-[13px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <dl className="divide-y divide-black/5 border-y border-black/10 bg-[#FAFAFA] rounded-xl p-6">
                    {item.scope ? (
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-3 text-[15px]">
                        <dt className="font-bold text-black/40">담당 범위</dt>
                        <dd className="font-bold leading-[1.6] text-black">{item.scope}</dd>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-3 text-[15px]">
                      <dt className="font-bold text-black/40">구독자 변화</dt>
                      <dd className="font-bold text-black">{item.result}</dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-3 text-[15px]">
                      <dt className="font-bold text-black/40">최고 조회수</dt>
                      <dd className="font-bold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>

                  {(item.before || item.action || item.after || item.proof) ? (
                    <div className="grid gap-4 border-t border-black/5 pt-6 text-[14px] font-medium leading-[1.75] text-black/60 sm:grid-cols-2">
                      {item.before ? (
                        <div>
                          <p className="text-[11px] font-bold tracking-[0.12em] text-[#21c1a2] mb-1">BEFORE</p>
                          <p className="break-keep">{item.before}</p>
                        </div>
                      ) : null}
                      {item.action ? (
                        <div>
                          <p className="text-[11px] font-bold tracking-[0.12em] text-[#21c1a2] mb-1">ACTION</p>
                          <p className="break-keep">{item.action}</p>
                        </div>
                      ) : null}
                      {item.after ? (
                        <div>
                          <p className="text-[11px] font-bold tracking-[0.12em] text-[#21c1a2] mb-1">AFTER</p>
                          <p className="break-keep">{item.after}</p>
                        </div>
                      ) : null}
                      {item.proof ? (
                        <div>
                          <p className="text-[11px] font-bold tracking-[0.12em] text-[#21c1a2] mb-1">PROOF</p>
                          <p className="break-keep">{item.proof}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <ActionLink
                    href={`/cases/${item.caseSlug}`}
                    className="inline-flex w-fit items-center border-b border-[#21c1a2] pb-1 text-[15px] font-bold text-[#21c1a2] transition-colors hover:text-[#1db197]"
                  >
                    케이스 스터디 보기
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pilot" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} py-20 md:py-28`}>
          <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="space-y-6 md:sticky md:top-28 md:self-start">
              <SectionHeader label={content.pricing.label} title={content.pricing.h2} />
              <p className="max-w-[44ch] break-keep text-[18px] font-bold leading-[1.85] text-[#21c1a2]">
                {content.pricing.emphasis}
              </p>
            </div>

            <div className="border-y border-black/10">
              {content.pricing.levels.map((level, index) => (
                <article key={level.title} className="grid gap-5 border-b border-black/5 py-8 last:border-b-0 md:grid-cols-[160px_1fr] md:gap-8 bg-white p-8 rounded-2xl mb-4 shadow-sm">
                  <div>
                    <p className="text-[12px] font-bold tracking-[0.12em] text-black/30 uppercase mb-2">
                      OPTION 0{index + 1}
                    </p>
                    <p className="text-[28px] font-bold tracking-tight text-black">
                      {level.priceBand}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[26px] font-bold tracking-tight text-black mb-4">{level.title}</h3>
                    <ul className="grid gap-3 text-[15px] font-medium leading-[1.75] text-black/60 sm:grid-cols-2 border-t border-black/5 pt-6">
                      {level.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 items-start"><span className="mt-2 h-1 w-1 bg-[#21c1a2] rounded-full shrink-0"/>{bullet}</li>
                      ))}
                    </ul>
                    <p className="mt-6 break-keep bg-[#FAFAFA] p-4 rounded-xl text-[14px] font-bold text-black/50">
                      {level.target}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="risk" className="border-b border-white/10 bg-[#0B0F0E] text-white">
        <div className={`${shell} py-20 md:py-28`}>
          <div className="grid gap-10 md:grid-cols-[0.86fr_1.14fr] md:gap-14">
            <SectionHeader
              label={content.riskManagement.label}
              title={content.riskManagement.h2}
              lead={content.riskManagement.lead}
              dark
            />

            <div className="space-y-8">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {content.riskManagement.items.map((item) => (
                  <li key={item} className="break-keep py-5 text-[17px] font-bold leading-[1.75] text-white">
                    - {item}
                  </li>
                ))}
              </ul>
              <p className="break-keep border border-white/10 bg-white/5 p-6 rounded-xl text-[15px] font-medium leading-[1.85] text-white/60">
                {content.riskManagement.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fit" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader
            label={content.aiRecommendation.label}
            title={content.aiRecommendation.h2}
            lead={content.aiRecommendation.lead}
          />

          <div className="mt-12 border-y border-black/10">
            {content.aiRecommendation.items.map((item) => (
              <article key={item.prompt} className="border-b border-black/5 py-8 last:border-b-0 bg-[#FAFAFA] px-8 rounded-2xl mb-4">
                <p className="text-[12px] font-bold tracking-[0.1em] text-[#21c1a2] mb-2 uppercase">자주 들어온 의뢰 유형</p>
                <h3 className="text-[26px] font-bold tracking-tight text-black mb-4">{item.prompt}</h3>
                <p className="text-[17px] font-medium leading-[1.85] text-black/60 mb-6">{item.fit}</p>
                <ul className="space-y-2 border-t border-black/5 pt-5 text-[15px] font-medium leading-[1.8] text-black/60">
                  {item.reasons.map((reason) => (
                    <li key={reason} className="flex gap-2 items-center"><span className="h-1 w-1 bg-black/20 rounded-full shrink-0"/>{reason}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-10 text-[17px] font-bold leading-[1.8] text-black text-center">{content.aiRecommendation.note}</p>
        </div>
      </section>

      <DiagnosticCalculator />

      <section id="contact" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} py-20 md:py-28`}>
          <div className="mb-12 space-y-6">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />
          </div>

          <div className="grid gap-10 md:grid-cols-[0.88fr_1.12fr] md:items-start">
            <div className="space-y-8 border-t border-black/10 pt-8 bg-white p-10 rounded-2xl shadow-sm border border-black/5">
              <div className="space-y-3">
                <h3 className="text-[28px] font-bold tracking-tight text-black">먼저 확인하는 것</h3>
                <p className="text-[16px] font-medium leading-[1.9] text-black/60">
                  긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.
                </p>
              </div>

              <ul className="space-y-3 text-[15px] font-semibold leading-[1.85] text-black/70">
                <li><span className="text-[#21c1a2] mr-2">✓</span> 클릭 전환: 제목·썸네일</li>
                <li><span className="text-[#21c1a2] mr-2">✓</span> 콘텐츠 구조: 주제·재생목록</li>
                <li><span className="text-[#21c1a2] mr-2">✓</span> 문의 동선: 설명란·고정댓글·채널 홈</li>
              </ul>

              <div className="flex flex-col gap-4 border-t border-black/5 pt-6">
                {hasPhoneHref ? (
                  <a
                    href={phoneHref}
                    className={`inline-flex justify-center items-center rounded-xl border border-black/10 px-6 py-4 text-[16px] font-bold text-black transition-colors hover:bg-black/5 ${focusRing}`}
                  >
                    {content.contact.quickCallLabel} {content.contact.phoneDisplay}
                  </a>
                ) : null}

                {hasKakaoChatUrl ? (
                  <a
                    href={kakaoChatUrl}
                    className={`inline-flex justify-center items-center rounded-xl bg-[#21c1a2] px-6 py-4 text-[16px] font-bold text-black transition-colors hover:bg-[#1db197] ${focusRing}`}
                  >
                    {content.contact.kakaoCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <div id="contact-form" className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm h-[760px]">
              {hasFormEmbedUrl ? (
                <iframe
                  src={formEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  title={content.contact.iframeTitle}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="grid h-full place-items-center p-6 text-center text-sm font-medium leading-relaxed text-black/40">
                  Google Form 임베드 URL이 아직 설정되지 않았습니다.
                  <br />
                  README의 안내대로 임베드 URL을 입력해 주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-black/10 bg-white">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader label={content.faq.label} title={content.faq.h2} />

          <div className="mt-12 border-y border-black/10">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-black/5 py-6 last:border-b-0">
                <summary className={`cursor-pointer list-none pr-8 text-[20px] font-bold tracking-tight text-black flex justify-between items-center ${focusRing}`}>
                  {item.q}
                  <span className="text-[#21c1a2] transition-transform group-open:-rotate-180">▼</span>
                </summary>
                <p className="mt-5 max-w-[78ch] whitespace-pre-line break-keep text-[16px] font-medium leading-[1.9] text-black/60 bg-[#FAFAFA] p-6 rounded-xl">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="border-b border-black/10 bg-[#FAFAFA]">
        <div className={`${shell} py-20 md:py-28`}>
          <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />

          {insightPosts.length > 0 ? (
            <div className="mt-12 border-y border-black/10 py-6">
              {insightPosts.map((post) => (
                <article
                  key={post.slug}
                  className="grid gap-6 border-b border-black/5 py-8 last:border-b-0 md:grid-cols-[130px_1fr_auto] md:items-start md:gap-8 bg-white p-8 rounded-2xl mb-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-[13px] font-bold tracking-widest text-black/40 uppercase">{post.publishedAt}</div>
                  <div className="space-y-3">
                    <h3 className="text-[24px] font-bold tracking-tight text-black">{post.title}</h3>
                    <p className="text-[15px] font-medium leading-[1.85] text-black/60">{post.description}</p>
                  </div>
                  <Link
                    href={`/insights/${post.slug}`}
                    className={`inline-flex w-fit items-center border-b-2 border-[#21c1a2] pb-1 text-[15px] font-bold text-[#21c1a2] transition-colors hover:text-[#1db197] ${focusRing}`}
                  >
                    읽기
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-[15px] font-medium text-black/50">인사이트 글을 추가하면 이 영역에 자동으로 반영됩니다.</p>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/insights"
              className={`inline-flex items-center rounded-full border border-black/10 bg-white px-8 py-4 text-[15px] font-bold text-black transition-colors hover:bg-black/5 shadow-sm ${focusRing}`}
            >
              {content.blog.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />

      {/* 결제 모듈 심사용 Footer 원본 복구 (디자인만 톤앤매너 맞춤) */}
      <footer className="border-t border-black/10 bg-white text-black">
        <div className={`${shell} py-12 text-[13px] flex flex-col md:flex-row md:justify-between gap-10`}>
          <div className="space-y-2">
            <div className="text-[16px] font-bold text-black mb-4">{content.footer.companyName}</div>
            {content.footer.lines.map((line) => (
              <div key={line.label} className="font-medium text-black/50">
                {line.label}: {line.value}
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-6 font-bold text-black/40 md:text-right md:justify-end">
            <Link href="/store" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              운영 플랜 신청
            </Link>
            <Link href="/terms" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              개인정보처리방침
            </Link>
            <Link href="/refund" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              환불 정책
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
