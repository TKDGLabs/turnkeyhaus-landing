"use client";

import { useState, useEffect } from "react";
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
  "inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-black/55";
const sectionTitle =
  "whitespace-pre-line break-keep text-[30px] font-semibold leading-[1.22] tracking-tight text-[#0B0F0E] md:text-[48px]";
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
            ? "inline-flex items-center border border-white/25 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white/70"
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
              ? "max-w-[62ch] whitespace-pre-line break-keep text-base leading-[1.9] text-white/78 md:text-lg"
              : "max-w-[62ch] whitespace-pre-line break-keep text-base leading-[1.9] text-black/70 md:text-lg"
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

  // ✨ 스크롤 감지 로직 (영상 높이를 벗어나면 메뉴바 표시)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-white pb-[88px] text-[#0B0F0E] md:pb-0">
      
      {/* 1. 상단 메뉴바 (초기엔 숨김, 영상 끝나면 흰색 배경으로 스르륵 등장) */}
      <header 
        className={`fixed top-0 z-50 w-full border-b border-black/8 bg-white/95 backdrop-blur-xl transition-all duration-500 ease-in-out ${
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className={`${shell} flex items-center justify-between py-4`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/logo.png" alt="Turnkeyhaus" width={176} height={48} className="h-11 w-auto object-contain" priority />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className={`inline-flex h-9 items-center px-3 text-[14px] font-semibold text-black/68 transition-colors hover:text-black ${focusRing}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ActionLink href="https://sclu.io/share/bulk/file/bf2w8ioROJvw" className="inline-flex h-10 items-center border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]">
            소개서 다운로드
          </ActionLink>
        </div>
      </header>

      {/* 2. 아무 간섭 없는 100% 풀스크린 영상 섹션 */}
      <section className="relative h-[100svh] w-full bg-black overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 3. Hero 텍스트 및 통계 (스크롤 내리면 등장) */}
      <section id="top" className="bg-white">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="max-w-[860px] space-y-6 text-[#0B0F0E]">
            <p className="text-sm font-semibold tracking-[0.1em] text-black/55">턴키하우스 by TKDG</p>
            <h1 className="whitespace-pre-line break-keep text-[34px] font-semibold leading-[1.26] tracking-tight md:text-[68px] md:leading-[1.16]">
              {content.heroValue.headline}
            </h1>
            <p className="max-w-[58ch] whitespace-pre-line break-keep text-base leading-[1.85] text-black/72 md:text-[20px] md:leading-[1.7]">
              {content.heroValue.body}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <ActionLink href={content.heroValue.primaryCta.href} className="inline-flex items-center border border-[#21c1a2] bg-[#21c1a2] px-6 py-4 text-sm font-semibold text-[#07211d] transition-colors hover:bg-[#36d6b7]">
                {content.heroValue.primaryCta.label}
              </ActionLink>
              <ActionLink href={content.heroValue.secondaryCta.href} className="inline-flex items-center border border-black/20 bg-white px-6 py-4 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03]">
                {content.heroValue.secondaryCta.label}
              </ActionLink>
            </div>

            {/* 트러스트 배지 (원본 복구) */}
            <ul className="grid gap-2 border-t border-black/12 pt-8 mt-12 text-[14px] font-semibold leading-[1.6] text-black/68 sm:grid-cols-2 lg:grid-cols-4">
              {content.heroValue.trustBadges.map((badge) => (
                <li key={badge} className="break-keep">{badge}</li>
              ))}
            </ul>
          </div>

          <dl className="mt-16 grid gap-5 border-t border-black/15 pt-8 text-[#0B0F0E] sm:grid-cols-3">
            <div className="space-y-1">
              <dt className="text-xs font-semibold tracking-[0.14em] text-black/52">대표 사례</dt>
              <dd className="text-[34px] font-semibold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold tracking-[0.14em] text-black/52">현재 구독자 합산</dt>
              <dd className="text-[34px] font-semibold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold tracking-[0.14em] text-black/52">전체 영상 누적 조회수</dt>
              <dd className="text-[34px] font-semibold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 4. 문제 현실 점검 */}
      <section id="problem" className="border-b border-black/15">
        <div className={`${shell} grid gap-8 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-24`}>
          <div className="space-y-6 md:sticky md:top-28 md:self-start">
            <span className={labelClass}>{content.problem.label}</span>
            <h2 className={`${sectionTitle} max-w-[13ch]`}>{content.problem.h2}</h2>
          </div>

          <div className="space-y-9">
            <p className="whitespace-pre-line break-keep text-[18px] leading-[1.9] text-black/74">{problemSupport}</p>
            <p className="whitespace-pre-line break-keep text-[17px] leading-[1.95] text-black/68">{problemDetail}</p>

            {content.problem.items.length > 0 ? (
              <ul className="grid gap-3 border-y border-black/12 py-5 text-[15px] leading-[1.8] text-black/72 md:grid-cols-3">
                {content.problem.items.map((item) => (
                  <li key={item} className="break-keep">- {item}</li>
                ))}
              </ul>
            ) : null}

            <figure className="overflow-hidden border border-black/10">
              <Image src="/images/reality-illustration-optimized.jpg" alt="채널 진단과 운영 구조" width={1600} height={1030} className="h-auto w-full object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            </figure>

            <p className="border-t border-black/18 pt-5 text-[19px] font-semibold leading-[1.75] text-[#0B0F0E]">
              {content.problem.emphasis}
            </p>
          </div>
        </div>
      </section>

      {/* 5. 출연자 운영 */}
      <section id="presenter-ops" className="border-b border-black/15 bg-[#fcfdfd]">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.76fr_1.24fr] md:gap-14 md:py-24`}>
          <SectionHeader label={content.presenterOps.label} title={content.presenterOps.h2} lead={content.presenterOps.lead} />
          <div className="space-y-8">
            <div className="border-y border-black/15">
              {content.presenterOps.points.map((point) => (
                <div key={point} className="border-b border-black/10 py-4 last:border-b-0">
                  <p className="break-keep text-[18px] font-semibold leading-[1.55] text-[#0B0F0E]">{point}</p>
                </div>
              ))}
            </div>
            <p className="max-w-[70ch] break-keep border-l-2 border-[#21c1a2] pl-5 text-[16px] font-semibold leading-[1.85] text-black/72">{content.presenterOps.note}</p>
          </div>
        </div>
      </section>

      {/* 6. 운영 서비스 */}
      <section id="services" className="border-b border-black/15 bg-[#fcfdfd]">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="space-y-8 md:sticky md:top-28 md:self-start">
              <SectionHeader label={content.servicePillars.label} title={content.servicePillars.h2} lead={content.servicePillars.lead} />
            </div>

            <div className="border-y border-black/15">
              {content.servicePillars.cards.map((card, index) => (
                <article key={card.title} className="grid gap-5 border-b border-black/10 py-7 last:border-b-0 md:grid-cols-[190px_1fr] md:gap-8">
                  <div>
                    <p className="text-[12px] font-semibold tracking-[0.12em] text-black/42">SERVICE {index + 1}</p>
                    <p className="mt-2 break-keep text-[17px] font-semibold leading-[1.55] text-black/64">{card.title}</p>
                  </div>
                  <div>
                    <h3 className="break-keep text-[28px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[36px]">{card.headline}</h3>
                    <p className="mt-4 max-w-[66ch] break-keep text-[16px] leading-[1.85] text-black/70">{card.body}</p>
                    <ul className="mt-5 grid gap-2 border-t border-black/10 pt-4 text-[15px] leading-[1.75] text-black/68 sm:grid-cols-2">
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                    <ActionLink href={card.href} className="mt-5 inline-flex items-center border-b border-[#21c1a2] pb-1 text-[15px] font-semibold text-[#21c1a2] transition-colors hover:text-[#1db197]">
                      {card.ctaLabel}
                    </ActionLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. 하지 않는 일 */}
      <section id="not-single" className="border-b border-black/15 bg-white">
        <div className={`${shell} py-16 md:py-20`}>
          <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-14">
            <SectionHeader label={content.exclusions.label} title={content.exclusions.h2} lead={content.exclusions.lead} />
            <div className="border-y border-black/15">
              {content.exclusions.items.map((item) => (
                <article key={item.title} className="border-b border-black/10 py-6 last:border-b-0">
                  <h3 className="break-keep text-[23px] font-semibold leading-[1.35] tracking-tight text-[#0B0F0E]">{item.title}</h3>
                  <p className="mt-3 max-w-[74ch] break-keep text-[15px] leading-[1.85] text-black/68">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. 제작 품질 */}
      <section id="quality" className="border-b border-black/15 bg-[#fcfdfd]">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.76fr_1.24fr] md:gap-14 md:py-24`}>
          <SectionHeader label={content.videoQuality.label} title={content.videoQuality.h2} lead={content.videoQuality.lead} />
          <div className="space-y-8">
            <div className="grid gap-x-8 gap-y-0 border-y border-black/15 sm:grid-cols-2">
              {content.videoQuality.points.map((point, index) => (
                <div key={point} className={`border-b border-black/10 py-4 ${index === content.videoQuality.points.length - 1 ? "border-b-0" : ""} ${index >= content.videoQuality.points.length - 2 ? "sm:border-b-0" : ""}`}>
                  <p className="break-keep text-[17px] font-semibold leading-[1.55] text-[#0B0F0E]">{point}</p>
                </div>
              ))}
            </div>
            <p className="max-w-[70ch] break-keep border-l-2 border-[#21c1a2] pl-5 text-[16px] font-semibold leading-[1.85] text-black/72">{content.videoQuality.note}</p>
          </div>
        </div>
      </section>

      {/* 9. 전략 설계 */}
      <section id="approach" className="border-b border-black/15">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
          <StrategyChapterDeck />
          <p className="mt-8 whitespace-pre-line break-keep text-base font-semibold leading-[1.9] text-[#0B0F0E]">{content.approach.keyline}</p>
        </div>
      </section>

      {/* 10. 업종별 적용 */}
      <section id="professional" className="border-b border-black/15">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.professionalTargets.label} title={content.professionalTargets.h2} lead={content.professionalTargets.lead} />
          <div className="mt-14 space-y-14">
            {content.professionalTargets.cards.map((card, index) => (
              <article key={card.title} className="grid items-center gap-8 border-t border-black/12 pt-10 md:grid-cols-2 md:gap-12">
                <figure className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {card.image ? (
                      <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    ) : (
                      <div className="relative h-full w-full border border-black/10 bg-[linear-gradient(145deg,#f3fffb_0%,#e9f9f4_52%,#f7fbfa_100%)] p-6 md:p-8">
                        <div className="pointer-events-none absolute -right-10 -top-8 h-36 w-36 rounded-full bg-[#21c1a2]/20 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#0B0F0E]/8 blur-2xl" />
                        <div className="relative flex h-full flex-col justify-between">
                          <p className="text-[11px] font-semibold tracking-[0.14em] text-black/48">{card.imageFallback?.eyebrow ?? "MODEL PREVIEW"}</p>
                          <div className="space-y-2">
                            {(card.imageFallback?.lines ?? ["이미지 자료 준비 중"]).map((line) => (
                              <p key={line} className="text-[18px] font-semibold leading-[1.45] tracking-tight text-[#0B0F0E] md:text-[22px]">{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </figure>
                <div className={`space-y-5 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <h3 className="text-[30px] font-semibold tracking-tight text-[#0B0F0E]">{card.title}</h3>
                  <p className="text-base leading-[1.9] text-black/72">{card.oneLiner}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {(card.tags ?? []).map((tag) => (
                      <span key={tag} className="text-[13px] font-semibold tracking-[0.03em] text-black/72 md:text-[14px]">#{tag}</span>
                    ))}
                  </div>
                  <ul className="space-y-2 border-t border-black/12 pt-4 text-[15px] leading-[1.85] text-black/70">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>- {bullet}</li>
                    ))}
                  </ul>
                  <ActionLink href={card.href} className="inline-flex items-center border-b border-[#21c1a2] pb-1 text-[15px] font-semibold text-[#21c1a2] transition-colors hover:text-[#1db197]">
                    {card.ctaLabel}
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 운영 체계 */}
      <section id="proof" className="border-b border-black/15 bg-white">
        <div className={`${shell} grid gap-12 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-start md:py-24`}>
          <figure className="overflow-hidden border border-black/10">
            <Image src={content.studioProof.images[0]?.src ?? "/images/showreel-cover-optimized.jpg"} alt={content.studioProof.images[0]?.alt ?? "Turnkeyhaus 운영 리포트 시각 자료"} width={1400} height={840} className="h-full w-full object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
          </figure>
          <div className="space-y-8 text-[#0B0F0E]">
            <SectionHeader label={content.studioProof.label} title={content.studioProof.h2} lead={content.studioProof.crewLead} />
            <ul className="space-y-3 border-y border-black/12 py-5">
              {content.studioProof.operationSystem.map((item) => (
                <li key={item} className="text-sm leading-[1.8] text-black/72">- {item}</li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.studioProof.crewCards.map((crew) => (
                <div key={crew.role} className="border-t border-black/12 pt-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-black/55">{crew.role}</p>
                  <p className="mt-1 text-[17px] font-semibold text-[#0B0F0E]">{crew.headline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. 리포트 샘플 */}
      <section id="report-sample" className="border-b border-black/15 bg-[#fcfdfd]">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.78fr_1.22fr] md:gap-14 md:py-24`}>
          <SectionHeader label={content.reportSample.label} title={content.reportSample.h2} lead={content.reportSample.lead} />
          <div className="space-y-7">
            <dl className="divide-y divide-black/12 border-y border-black/15">
              {content.reportSample.rows.map((row) => (
                <div key={row.label} className="grid gap-3 py-4 md:grid-cols-[170px_1fr] md:gap-8">
                  <dt className="text-[13px] font-semibold tracking-[0.08em] text-black/52">{row.label}</dt>
                  <dd className="break-keep text-[16px] font-semibold leading-[1.7] text-[#0B0F0E]">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="break-keep text-[15px] leading-[1.85] text-black/68">{content.reportSample.note}</p>
          </div>
        </div>
      </section>

      {/* 13. 인물 소개 (원하시는 레이아웃 원상 복구) */}
      <section id="team" className="border-b border-black/15 bg-white">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[0.74fr_1.26fr] md:gap-14">
            <SectionHeader label={content.leadership.label} title={content.leadership.h2} lead={content.leadership.lead} />
            <div className="border-y border-black/15">
              {content.leadership.people.map((person) => (
                <article key={person.name} className="grid gap-5 border-b border-black/10 py-7 last:border-b-0 md:grid-cols-[150px_180px_1fr] md:gap-8">
                  <figure className="relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#f7f7f7]">
                    <Image src={person.image.src} alt={person.image.alt} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 150px" />
                  </figure>
                  <div className="md:pt-1">
                    <h3 className="text-[28px] font-semibold tracking-tight text-[#0B0F0E]">{person.name}</h3>
                    <p className="mt-1 text-[12px] font-semibold tracking-[0.12em] text-black/40">{person.englishName}</p>
                    <p className="mt-2 break-keep text-[13px] font-semibold leading-[1.55] text-black/52">{person.role}</p>
                  </div>
                  <div>
                    <p className="break-keep text-[16px] leading-[1.85] text-black/70">{person.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-black/10 pt-4 text-[13px] font-semibold leading-[1.55] text-black/62">
                      {person.responsibilities.map((item) => (
                        <li key={item}>#{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 14. 포트폴리오 */}
      <section id="portfolio" className="border-b border-black/15">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          <div className="mt-12">
            {content.portfolio.items.map((item) => (
              <article key={item.title} className="grid gap-7 border-t border-black/14 py-11 md:grid-cols-[1.02fr_0.98fr] md:gap-12">
                <div className="relative aspect-video overflow-hidden border border-black/10 bg-black">
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="absolute inset-0 h-full w-full border-0" />
                  ) : (
                    <Image src={item.imageSrc} alt={`${item.title} 대표 이미지`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
                  )}
                </div>
                <div className="flex flex-col gap-7 md:gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[33px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#0B0F0E]">{item.title}</h3>
                    <p className="text-[13px] font-semibold tracking-[0.08em] text-black/56">클라이언트: <span className="tracking-[0.02em] text-black/72">{item.clientName}</span></p>
                    <p className="max-w-[58ch] break-keep text-[17px] leading-[1.82] text-black/76">{item.oneLiner}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-black/10 pt-3">
                      <span className="text-[12px] font-semibold tracking-[0.1em] text-black/52">키워드</span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[13px] font-semibold tracking-[0.03em] text-black/72 md:text-[14px]">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <dl className="divide-y divide-black/14 border-y border-black/14">
                    {item.scope ? (
                      <div className="grid grid-cols-[96px_1fr] items-start gap-4 py-3.5 text-[15px]">
                        <dt className="font-medium text-black/58">담당 범위</dt>
                        <dd className="text-right font-semibold leading-[1.6] text-[#0B0F0E]">{item.scope}</dd>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-[96px_1fr] items-center gap-4 py-3.5 text-[15px]">
                      <dt className="font-medium text-black/58">구독자 변화</dt>
                      <dd className="text-right font-semibold text-[#0B0F0E]">{item.result}</dd>
                    </div>
                    <div className="grid grid-cols-[96px_1fr] items-center gap-4 py-3.5 text-[15px]">
                      <dt className="font-medium text-black/58">최고 조회수</dt>
                      <dd className="text-right font-semibold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>
                  {(item.before || item.action || item.after || item.proof) ? (
                    <div className="grid gap-3 border-t border-black/10 pt-4 text-[14px] leading-[1.75] text-black/70 sm:grid-cols-2">
                      {item.before ? <div><p className="text-[11px] font-semibold tracking-[0.12em] text-black/42">BEFORE</p><p className="mt-1 break-keep">{item.before}</p></div> : null}
                      {item.action ? <div><p className="text-[11px] font-semibold tracking-[0.12em] text-black/42">ACTION</p><p className="mt-1 break-keep">{item.action}</p></div> : null}
                      {item.after ? <div><p className="text-[11px] font-semibold tracking-[0.12em] text-black/42">AFTER</p><p className="mt-1 break-keep">{item.after}</p></div> : null}
                      {item.proof ? <div><p className="text-[11px] font-semibold tracking-[0.12em] text-black/42">PROOF</p><p className="mt-1 break-keep">{item.proof}</p></div> : null}
                    </div>
                  ) : null}
                  <Link href={`/cases/${item.caseSlug}`} className={`inline-flex w-fit items-center border-b border-[#21c1a2] pb-1 text-[15px] font-semibold text-[#21c1a2] transition-colors hover:text-[#1db197] ${focusRing}`}>
                    케이스 스터디 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 15. 요금제 플랜 */}
      <section id="pilot" className="border-b border-black/15 bg-white">
        <div className={`${shell} py-20 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="space-y-6 md:sticky md:top-28 md:self-start">
              <SectionHeader label={content.pricing.label} title={content.pricing.h2} />
              <p className="max-w-[44ch] break-keep text-[17px] font-semibold leading-[1.85] text-[#0B0F0E]">{content.pricing.emphasis}</p>
            </div>
            <div className="border-y border-black/15">
              {content.pricing.levels.map((level, index) => (
                <article key={level.title} className="grid gap-5 border-b border-black/10 py-7 last:border-b-0 md:grid-cols-[150px_1fr] md:gap-8">
                  <div>
                    <p className="text-[12px] font-semibold tracking-[0.12em] text-black/42">OPTION {index + 1}</p>
                    <p className="mt-2 text-[26px] font-semibold tracking-tight text-[#0B0F0E]">{level.priceBand}</p>
                  </div>
                  <div>
                    <h3 className="text-[26px] font-semibold tracking-tight text-[#0B0F0E]">{level.title}</h3>
                    <ul className="mt-4 grid gap-2 text-[15px] leading-[1.75] text-black/70 sm:grid-cols-2">
                      {level.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                    <p className="mt-4 break-keep border-t border-black/10 pt-4 text-[14px] font-semibold leading-[1.7] text-black/58">{level.target}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 16. 리스크 관리 */}
      <section id="risk" className="border-b border-black/15 bg-[#0B0F0E] text-white">
        <div className={`${shell} py-16 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[0.86fr_1.14fr] md:gap-14">
            <SectionHeader label={content.riskManagement.label} title={content.riskManagement.h2} lead={content.riskManagement.lead} dark />
            <div className="space-y-7">
              <ul className="divide-y divide-white/14 border-y border-white/18">
                {content.riskManagement.items.map((item) => (
                  <li key={item} className="break-keep py-4 text-[16px] font-semibold leading-[1.75] text-white/84">- {item}</li>
                ))}
              </ul>
              <p className="break-keep border border-white/16 p-5 text-[14px] leading-[1.85] text-white/68">{content.riskManagement.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 17. 핏 추천 */}
      <section id="fit" className="border-b border-black/15 bg-[#fcfdfd]">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.aiRecommendation.label} title={content.aiRecommendation.h2} lead={content.aiRecommendation.lead} />
          <div className="mt-10 border-y border-black/15">
            {content.aiRecommendation.items.map((item) => (
              <article key={item.prompt} className="border-b border-black/10 py-7 last:border-b-0">
                <p className="text-xs font-semibold tracking-[0.1em] text-black/48">자주 들어온 의뢰 유형</p>
                <h3 className="mt-1 text-[24px] font-semibold tracking-tight text-[#0B0F0E]">{item.prompt}</h3>
                <p className="mt-3 text-[16px] leading-[1.85] text-black/74">{item.fit}</p>
                <ul className="mt-4 space-y-1.5 border-t border-black/12 pt-4 text-[15px] leading-[1.8] text-black/68">
                  {item.reasons.map((reason) => (
                    <li key={reason}>- {reason}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-7 text-[16px] font-semibold leading-[1.8] text-[#0B0F0E]">{content.aiRecommendation.note}</p>
        </div>
      </section>

      {/* 🚨 요청 반영: 진단 계산기 완벽 복구 완료 */}
      <DiagnosticCalculator />

      {/* 18. 연락처 폼 */}
      <section id="contact" className="border-b border-black/15 bg-white">
        <div className={`${shell} py-20 md:py-24`}>
          <div className="mb-10 space-y-6">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />
          </div>
          <div className="grid gap-8 md:grid-cols-[0.88fr_1.12fr] md:items-start">
            <div className="space-y-7 border-t border-black/18 pt-5">
              <div className="space-y-3">
                <h3 className="text-[29px] font-semibold tracking-tight text-[#0B0F0E]">먼저 확인하는 것</h3>
                <p className="text-base leading-[1.9] text-black/68">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              </div>
              <ul className="space-y-2 text-sm leading-[1.85] text-black/72">
                <li>- 클릭 전환: 제목·썸네일</li>
                <li>- 콘텐츠 구조: 주제·재생목록</li>
                <li>- 문의 동선: 설명란·고정댓글·채널 홈</li>
              </ul>
              <div className="flex flex-wrap gap-3 border-t border-black/12 pt-4">
                {hasPhoneHref ? (
                  <a href={phoneHref} className={`inline-flex items-center border border-black/20 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5 ${focusRing}`}>
                    {content.contact.quickCallLabel} {content.contact.phoneDisplay}
                  </a>
                ) : null}
                {hasKakaoChatUrl ? (
                  <a href={kakaoChatUrl} className={`inline-flex items-center border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#1db197] ${focusRing}`}>
                    {content.contact.kakaoCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>
            <div id="contact-form" className="overflow-hidden border border-black/12 bg-white">
              {hasFormEmbedUrl ? (
                <iframe src={formEmbedUrl} className="h-[clamp(760px,80vh,980px)] w-full" loading="lazy" title={content.contact.iframeTitle} referrerPolicy="strict-origin-when-cross-origin" />
              ) : (
                <div className="grid h-[clamp(760px,80vh,980px)] place-items-center p-6 text-center text-sm leading-relaxed text-black/60">
                  Google Form 임베드 URL이 아직 설정되지 않았습니다.<br />README의 안내대로 임베드 URL을 입력해 주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 19. FAQ */}
      <section id="faq" className="border-b border-black/15">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.faq.label} title={content.faq.h2} />
          <div className="mt-10 border-y border-black/15">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-black/10 py-4 last:border-b-0">
                <summary className={`cursor-pointer list-none pr-8 text-[19px] font-semibold tracking-tight text-[#0B0F0E] ${focusRing}`}>
                  {item.q}
                  <span className="ml-2 text-black/35 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[78ch] whitespace-pre-line break-keep text-sm leading-[1.9] text-black/70 md:text-base">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 20. 블로그 */}
      <section id="blog" className="border-b border-black/15">
        <div className={`${shell} py-20 md:py-24`}>
          <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />
          {insightPosts.length > 0 ? (
            <div className="mt-10 border-y border-black/15">
              {insightPosts.map((post) => (
                <article key={post.slug} className="grid gap-4 border-b border-black/10 py-6 last:border-b-0 md:grid-cols-[130px_1fr_auto] md:items-start md:gap-8">
                  <div className="text-sm font-medium text-black/55">{post.publishedAt}</div>
                  <div className="space-y-2">
                    <h3 className="text-[26px] font-semibold tracking-tight text-[#0B0F0E]">{post.title}</h3>
                    <p className="text-sm leading-[1.85] text-black/68">{post.description}</p>
                  </div>
                  <Link href={`/insights/${post.slug}`} className={`inline-flex w-fit items-center border-b border-[#21c1a2] pb-1 text-sm font-semibold text-[#21c1a2] transition-colors hover:text-[#1db197] ${focusRing}`}>
                    읽기
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-black/60">인사이트 글을 추가하면 이 영역에 자동으로 반영됩니다.</p>
          )}
          <div className="mt-8">
            <Link href="/insights" className={`inline-flex items-center border border-black/20 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5 ${focusRing}`}>
              {content.blog.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />

      {/* Footer */}
      <footer className="border-t border-black/15 bg-white text-black/65">
        <div className={`${shell} py-10 text-xs flex flex-col md:flex-row md:justify-between gap-8`}>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#0B0F0E]">{content.footer.companyName}</div>
            {content.footer.lines.map((line) => (
              <div key={line.label}>{line.label}: {line.value}</div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 font-semibold text-black/60 md:text-right md:justify-end">
            <Link href="/store" className="hover:text-[#21c1a2] text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">운영 플랜 신청</Link>
            <Link href="/terms" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">이용약관</Link>
            <Link href="/privacy" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">환불 정책</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
