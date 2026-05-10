"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
import { getSortedInsights } from "../content/insights";

// --- 스타일 유틸리티 ---
const shell = "mx-auto w-full max-w-[1320px] px-6 lg:px-10";
const labelClass = "inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-black/55 uppercase";
const sectionTitle = "whitespace-pre-line break-keep text-[34px] font-bold leading-[1.22] tracking-tight text-[#0B0F0E] md:text-[52px]";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

// 애니메이션 설정
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" as const } 
  }
};

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const mergedClass = `${className} ${focusRing} transition-all duration-300`;
  if (isExternalLink(href)) {
    return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  }
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

// 원래 있던 SectionHeader 100% 복구
function SectionHeader({ label, title, lead, dark = false }: { label: string; title: string; lead?: string; dark?: boolean; }) {
  return (
    <div className="space-y-6">
      <span className={dark ? "inline-flex items-center border border-white/25 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white/70 uppercase" : labelClass}>
        {label}
      </span>
      <h2 className={dark ? `${sectionTitle} text-white` : sectionTitle}>{title}</h2>
      {lead ? (
        <p className={dark ? "max-w-[62ch] whitespace-pre-line break-keep text-[18px] leading-[1.9] text-white/78 md:text-[20px]" : "max-w-[62ch] whitespace-pre-line break-keep text-[18px] leading-[1.9] text-black/70 md:text-[20px]"}>
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
  return url.startsWith("https://docs.google.com/forms/d/e/") && url.includes("/viewform?embedded=true");
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

  return (
    <main className="bg-white text-[#0B0F0E] antialiased">
      
      {/* 1. 원본 네비게이션 복구 + 헤더 정리 */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl transition-all duration-300">
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/images/turnkeyhaus-logo-white.png" alt="Turnkeyhaus" width={176} height={48} className="h-10 w-auto object-contain drop-shadow-md" priority />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className={`text-[14px] font-semibold text-white/80 hover:text-white transition-colors ${focusRing}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ActionLink href="https://sclu.io/share/bulk/file/bf2w8ioROJvw" className="inline-flex h-10 items-center rounded-full bg-[#21c1a2] px-6 text-[14px] font-bold text-black transition-transform hover:scale-105">
            소개서 다운로드
          </ActionLink>
        </div>
      </header>

      {/* 2. 화면을 꽉 채우는 16:9 시네마틱 풀스크린 히어로 */}
      <section id="top" className="relative h-[100svh] min-h-[800px] w-full bg-[#0B0F0E] overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-70">
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
        
        {/* 그라데이션 오버레이로 텍스트 가독성 확보 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0E] via-black/20 to-transparent" />
        
        <div className={`${shell} relative h-full flex flex-col justify-end pb-20 lg:pb-32`}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[1000px] space-y-8 text-white">
            <p className="text-[13px] font-bold tracking-[0.2em] text-[#21c1a2] uppercase">턴키하우스 by TKDG</p>
            <h1 className="whitespace-pre-line break-keep text-[48px] font-bold leading-[1.1] tracking-tight sm:text-[72px] lg:text-[90px]">
              {content.heroValue.headline}
            </h1>
            <p className="max-w-[58ch] whitespace-pre-line break-keep text-[18px] leading-[1.8] text-white/80 md:text-[24px]">
              {content.heroValue.body}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <ActionLink href={content.heroValue.primaryCta.href} className="inline-flex items-center rounded-full bg-[#21c1a2] px-8 py-4 text-[16px] font-bold text-[#07211d] hover:bg-[#1db197]">
                {content.heroValue.primaryCta.label}
              </ActionLink>
              <ActionLink href={content.heroValue.secondaryCta.href} className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-[16px] font-bold text-white hover:bg-white/20">
                {content.heroValue.secondaryCta.label}
              </ActionLink>
            </div>

            {/* 원본 트러스트 배지 복구 */}
            {content.heroValue.trustBadges.length > 0 && (
              <ul className="grid gap-4 border-t border-white/20 pt-8 text-[15px] font-medium leading-[1.6] text-white/70 sm:grid-cols-2 lg:grid-cols-4 mt-12">
                {content.heroValue.trustBadges.map((badge) => (
                  <li key={badge} className="break-keep flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0" /> {badge}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </section>

      {/* 3. 대표 사례 및 통계 (원본 텍스트 그대로) */}
      <section className="bg-[#0B0F0E] pb-24 text-white">
        <div className={shell}>
          <dl className="grid gap-8 border-t border-white/10 pt-16 sm:grid-cols-3">
            <div className="space-y-3">
              <dt className="text-[13px] font-bold tracking-[0.14em] text-white/50 uppercase">대표 사례</dt>
              <dd className="text-[40px] font-bold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-[13px] font-bold tracking-[0.14em] text-white/50 uppercase">현재 구독자 합산</dt>
              <dd className="text-[40px] font-bold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-[13px] font-bold tracking-[0.14em] text-white/50 uppercase">전체 영상 누적 조회수</dt>
              <dd className="text-[40px] font-bold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 4. 문제 현실 점검 (원본 텍스트 완벽 복원) */}
      <section id="problem" className="py-24 lg:py-40 bg-white">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <span className={labelClass}>{content.problem.label}</span>
            <h2 className={`${sectionTitle}`}>{content.problem.h2}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-10">
            <p className="whitespace-pre-line break-keep text-[20px] leading-[1.9] text-black/80">{problemSupport}</p>
            <p className="whitespace-pre-line break-keep text-[18px] leading-[1.95] text-black/70">{problemDetail}</p>

            {content.problem.items.length > 0 && (
              <ul className="grid gap-4 border-y border-black/10 py-8 text-[16px] leading-[1.8] text-black/70 md:grid-cols-1">
                {content.problem.items.map((item) => (
                  <li key={item} className="break-keep flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <figure className="overflow-hidden rounded-2xl bg-[#FAFAFA] border border-black/5">
              <Image src="/images/reality-illustration-optimized.jpg" alt="채널 진단과 운영 구조" width={1600} height={1030} className="h-auto w-full object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            </figure>

            <p className="text-[22px] font-bold leading-[1.75] text-[#21c1a2]">
              {content.problem.emphasis}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. 출연자 운영 */}
      <section id="presenter-ops" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.presenterOps.label} title={content.presenterOps.h2} lead={content.presenterOps.lead} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-10">
            <div className="border-t border-black/10">
              {content.presenterOps.points.map((point) => (
                <div key={point} className="border-b border-black/10 py-6">
                  <p className="break-keep text-[20px] font-bold leading-[1.55] text-[#0B0F0E]">{point}</p>
                </div>
              ))}
            </div>
            <p className="max-w-[70ch] break-keep border-l-4 border-[#21c1a2] pl-6 text-[18px] font-medium leading-[1.85] text-black/70">
              {content.presenterOps.note}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6. 운영 서비스 (원본 텍스트 "SERVICE 1", 본문, 태그 유지) */}
      <section id="services" className="py-24 lg:py-40 bg-white">
        <div className={`${shell}`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 max-w-3xl">
            <SectionHeader label={content.servicePillars.label} title={content.servicePillars.h2} lead={content.servicePillars.lead} />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {content.servicePillars.cards.map((card, index) => (
              <motion.article key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.1 }}
                className={`flex flex-col justify-between rounded-3xl bg-[#FAFAFA] p-10 border border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300 ${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div>
                  <p className="text-[12px] font-bold tracking-[0.15em] text-[#21c1a2] mb-4">SERVICE {index + 1}</p>
                  <p className="text-[16px] font-semibold text-black/50 mb-4">{card.title}</p>
                  <h3 className="break-keep text-[32px] font-bold leading-[1.24] tracking-tight text-[#0B0F0E] mb-6">{card.headline}</h3>
                  <p className="break-keep text-[16px] leading-[1.85] text-black/70 font-medium mb-10">{card.body}</p>
                </div>
                <div className="border-t border-black/10 pt-8">
                  <ul className="grid gap-3 text-[15px] leading-[1.75] text-black/70 font-medium mb-10 sm:grid-cols-2">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2"><span className="mt-2 h-1 w-1 bg-[#21c1a2] rounded-full shrink-0"/> {bullet}</li>
                    ))}
                  </ul>
                  <ActionLink href={card.href} className="inline-flex items-center text-[16px] font-bold text-[#0B0F0E] border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] transition-colors">
                    {card.ctaLabel} <span className="ml-2">→</span>
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 운영 원칙 */}
      <section id="not-single" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.exclusions.label} title={content.exclusions.h2} lead={content.exclusions.lead} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="border-t border-black/10">
            {content.exclusions.items.map((item) => (
              <article key={item.title} className="border-b border-black/10 py-8">
                <h3 className="break-keep text-[24px] font-bold leading-[1.35] tracking-tight text-[#0B0F0E] mb-4">{item.title}</h3>
                <p className="max-w-[74ch] break-keep text-[16px] font-medium leading-[1.85] text-black/70">{item.body}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. 제작 품질 */}
      <section id="quality" className="py-24 lg:py-40 bg-white">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.videoQuality.label} title={content.videoQuality.h2} lead={content.videoQuality.lead} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-10">
            <div className="grid gap-x-8 gap-y-0 border-y border-black/10 sm:grid-cols-2">
              {content.videoQuality.points.map((point) => (
                <div key={point} className="border-b border-black/10 py-5">
                  <p className="break-keep text-[18px] font-bold leading-[1.55] text-[#0B0F0E]">{point}</p>
                </div>
              ))}
            </div>
            <p className="max-w-[70ch] break-keep border-l-4 border-[#21c1a2] pl-6 text-[16px] font-medium leading-[1.85] text-black/70">{content.videoQuality.note}</p>
          </motion.div>
        </div>
      </section>

      {/* 9. 전략 설계 프레임 */}
      <section id="approach" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
            <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
          </motion.div>
          <StrategyChapterDeck />
          <p className="mt-12 text-center text-[18px] font-bold leading-[1.9] text-[#21c1a2]">{content.approach.keyline}</p>
        </div>
      </section>

      {/* 10. 업종별 적용 */}
      <section id="professional" className="py-24 lg:py-40 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-24 max-w-3xl">
            <SectionHeader label={content.professionalTargets.label} title={content.professionalTargets.h2} lead={content.professionalTargets.lead} />
          </motion.div>

          <div className="space-y-20">
            {content.professionalTargets.cards.map((card, index) => (
              <motion.article key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid items-center gap-12 lg:grid-cols-2">
                <figure className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#F9FAFB] border border-black/5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {card.image ? (
                    <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  ) : (
                    <div className="flex h-full flex-col justify-end p-10">
                      <p className="text-[12px] font-bold text-black/40 mb-4">{card.imageFallback?.eyebrow}</p>
                      {card.imageFallback?.lines.map(line => <p key={line} className="text-2xl font-bold">{line}</p>)}
                    </div>
                  )}
                </figure>
                <div className="space-y-6">
                  <h3 className="text-[36px] font-bold tracking-tight text-[#0B0F0E]">{card.title}</h3>
                  <p className="text-[18px] leading-[1.9] text-black/70 font-medium">{card.oneLiner}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(card.tags ?? []).map(tag => <span key={tag} className="bg-black/5 px-3 py-1 rounded text-[13px] font-bold text-black/60">#{tag}</span>)}
                  </div>
                  <ul className="space-y-3 border-t border-black/10 pt-6 text-[15px] font-medium text-black/70">
                    {card.bullets.map(b => <li key={b} className="flex gap-3 items-start"><span className="mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{b}</li>)}
                  </ul>
                  <div className="pt-4">
                    <ActionLink href={card.href} className="inline-flex items-center border-b-2 border-black/10 pb-1 text-[16px] font-bold text-[#0B0F0E] hover:border-[#21c1a2]">
                      {card.ctaLabel} <span className="ml-2">→</span>
                    </ActionLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 운영 체계 & 리포트 샘플 */}
      <section id="proof" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center mb-32">
            <motion.figure initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="overflow-hidden rounded-3xl border border-black/5 shadow-xl aspect-video lg:aspect-[4/3] relative">
              <Image src={content.studioProof.images[0]?.src ?? "/images/showreel-cover-optimized.jpg"} alt={content.studioProof.images[0]?.alt ?? "Turnkeyhaus 운영 리포트"} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
            </motion.figure>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-8">
              <SectionHeader label={content.studioProof.label} title={content.studioProof.h2} lead={content.studioProof.crewLead} />
              
              <ul className="space-y-4 border-y border-black/10 py-8">
                {content.studioProof.operationSystem.map((item) => (
                  <li key={item} className="text-[16px] font-semibold text-black/70 flex gap-3 items-center"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{item}</li>
                ))}
              </ul>

              <div className="grid gap-6 sm:grid-cols-2">
                {content.studioProof.crewCards.map((crew) => (
                  <div key={crew.role} className="bg-white p-6 rounded-xl border border-black/5">
                    <p className="text-[11px] font-bold tracking-[0.12em] text-black/40 mb-2 uppercase">{crew.role}</p>
                    <p className="text-[18px] font-bold text-[#0B0F0E]">{crew.headline}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white rounded-3xl p-10 lg:p-16 border border-black/5 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
             <div>
                <SectionHeader label={content.reportSample.label} title={content.reportSample.h2} lead={content.reportSample.lead} />
             </div>
             <div>
                <dl className="divide-y divide-black/10 border-y border-black/10">
                  {content.reportSample.rows.map((row) => (
                    <div key={row.label} className="grid gap-4 py-6 md:grid-cols-[160px_1fr] items-center">
                      <dt className="text-[13px] font-bold tracking-[0.08em] text-black/50">{row.label}</dt>
                      <dd className="text-[16px] font-semibold text-[#0B0F0E]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-[15px] leading-[1.85] text-black/50 font-medium">{content.reportSample.note}</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 12. 전담 리드 (인물 소개) - 원본 텍스트 100% 복원 */}
      <section id="team" className="py-24 lg:py-40 bg-white">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.leadership.label} title={content.leadership.h2} lead={content.leadership.lead} />
          </motion.div>

          <div className="border-t border-black/10">
            {content.leadership.people.map((person, idx) => (
              <motion.article key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} className="grid gap-8 border-b border-black/10 py-10 lg:grid-cols-[160px_1fr] items-start">
                <figure className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-xl bg-[#F9FAFB]">
                  <Image src={person.image.src} alt={person.image.alt} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 160px" />
                </figure>
                <div>
                  <h3 className="text-[28px] font-bold tracking-tight text-[#0B0F0E]">{person.name} <span className="text-[14px] font-semibold text-black/40 ml-2 uppercase tracking-wider">{person.englishName}</span></h3>
                  <p className="mt-2 text-[14px] font-bold text-[#21c1a2] mb-6">{person.role}</p>
                  <p className="text-[16px] leading-[1.85] text-black/70 font-medium mb-6">{person.body}</p>
                  <ul className="flex flex-wrap gap-2">
                    {person.responsibilities.map((item) => (
                      <li key={item} className="bg-black/5 px-3 py-1 rounded text-[12px] font-bold text-black/60">#{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 13. 포트폴리오 (원본 BEFORE/AFTER/ACTION 등 조건부 렌더링 100% 복구) */}
      <section id="portfolio" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 max-w-3xl mx-auto text-center">
            <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          </motion.div>

          <div className="space-y-16">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="grid gap-12 lg:grid-cols-[1fr_1fr] items-center bg-white rounded-3xl p-8 lg:p-12 border border-black/5 shadow-sm"
              >
                <div className="relative w-full aspect-video overflow-hidden border border-black/5 bg-black rounded-2xl">
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`} className="absolute inset-0 h-full w-full border-0" allowFullScreen />
                  ) : (
                    <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                  )}
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-[36px] font-bold tracking-tight text-[#0B0F0E] leading-tight mb-2">{item.title}</h3>
                    <p className="text-[13px] font-bold text-[#21c1a2] uppercase tracking-widest mb-4">클라이언트: {item.clientName}</p>
                    <p className="text-[18px] leading-[1.8] text-black/70 font-medium">{item.oneLiner}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map(tag => <span key={tag} className="text-[13px] font-bold bg-black/5 px-2 py-1 rounded text-black/60">#{tag}</span>)}
                    </div>
                  </div>

                  <dl className="divide-y divide-black/10 border-y border-black/10">
                    {item.scope && (
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-4 text-[16px] items-center">
                        <dt className="font-bold text-black/40">담당 범위</dt>
                        <dd className="font-semibold text-[#0B0F0E]">{item.scope}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-[100px_1fr] gap-4 py-4 text-[16px] items-center">
                      <dt className="font-bold text-black/40">구독자 변화</dt>
                      <dd className="font-semibold text-[#0B0F0E]">{item.result}</dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-4 py-4 text-[16px] items-center">
                      <dt className="font-bold text-black/40">최고 조회수</dt>
                      <dd className="font-bold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>

                  {/* 완벽히 복구된 BEFORE/AFTER/ACTION/PROOF */}
                  {(item.before || item.action || item.after || item.proof) && (
                    <div className="grid gap-6 border-t border-black/10 pt-6 text-[15px] font-medium leading-[1.75] text-black/70 sm:grid-cols-2">
                      {item.before && (
                        <div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">BEFORE</p><p>{item.before}</p></div>
                      )}
                      {item.action && (
                        <div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">ACTION</p><p>{item.action}</p></div>
                      )}
                      {item.after && (
                        <div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">AFTER</p><p>{item.after}</p></div>
                      )}
                      {item.proof && (
                        <div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">PROOF</p><p>{item.proof}</p></div>
                      )}
                    </div>
                  )}

                  <ActionLink href={`/cases/${item.caseSlug}`} className="inline-block mt-4 text-[16px] font-bold border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] hover:text-[#21c1a2]">
                    케이스 스터디 보기 →
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 14. 운영 플랜 */}
      <section id="pilot" className="py-24 lg:py-40 bg-white">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:sticky lg:top-32 lg:self-start space-y-6">
            <SectionHeader label={content.pricing.label} title={content.pricing.h2} />
            <p className="text-[18px] font-bold leading-[1.85] text-[#21c1a2]">{content.pricing.emphasis}</p>
          </motion.div>

          <div className="border-t border-black/10">
            {content.pricing.levels.map((level, index) => (
              <motion.article key={level.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.1 }} className="grid gap-6 border-b border-black/10 py-10 lg:grid-cols-[180px_1fr]">
                <div>
                  <p className="text-[12px] font-bold tracking-widest text-black/40 mb-2">OPTION 0{index + 1}</p>
                  <p className="text-[28px] font-bold tracking-tight text-[#0B0F0E]">{level.priceBand}</p>
                </div>
                <div>
                  <h3 className="text-[26px] font-bold tracking-tight text-[#0B0F0E] mb-6">{level.title}</h3>
                  <ul className="grid gap-4 text-[15px] font-medium leading-[1.75] text-black/70 sm:grid-cols-2">
                    {level.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 items-start"><span className="mt-2 h-1 w-1 rounded-full bg-black/30 shrink-0"/>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-8 bg-[#FAFAFA] p-4 rounded-xl text-[14px] font-bold text-black/60 border border-black/5">{level.target}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 15. 리스크 관리 */}
      <section id="risk" className="py-24 lg:py-40 bg-[#0B0F0E] text-white">
        <div className={`${shell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.riskManagement.label} title={content.riskManagement.h2} lead={content.riskManagement.lead} dark />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-10">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {content.riskManagement.items.map((item) => (
                <li key={item} className="py-6 text-[18px] font-semibold leading-[1.75] text-white/90">{item}</li>
              ))}
            </ul>
            <p className="bg-white/5 p-8 rounded-2xl border border-white/10 text-[16px] leading-[1.85] text-white/60 font-medium">{content.riskManagement.note}</p>
          </motion.div>
        </div>
      </section>

      {/* 16. 선택 기준 (의뢰 유형) */}
      <section id="fit" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 max-w-3xl mx-auto text-center">
            <SectionHeader label={content.aiRecommendation.label} title={content.aiRecommendation.h2} lead={content.aiRecommendation.lead} />
          </motion.div>

          <div className="grid gap-8 max-w-5xl mx-auto border-t border-black/10 pt-16">
            {content.aiRecommendation.items.map((item) => (
              <motion.article key={item.prompt} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm">
                <p className="text-[12px] font-bold tracking-widest text-[#21c1a2] mb-3">자주 들어온 의뢰 유형</p>
                <h3 className="text-[26px] font-bold tracking-tight text-[#0B0F0E] mb-4">{item.prompt}</h3>
                <p className="text-[18px] font-medium leading-[1.85] text-black/70 mb-8 border-b border-black/5 pb-8">{item.fit}</p>
                <ul className="space-y-3">
                  {item.reasons.map((reason) => (
                    <li key={reason} className="text-[15px] font-semibold text-black/60 flex items-center gap-3"><span className="h-1 w-1 bg-black/20 rounded-full"/>{reason}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
          <p className="mt-16 text-center text-[18px] font-bold text-[#0B0F0E]">{content.aiRecommendation.note}</p>
        </div>
      </section>

      {/* 17. 계산기 (배경색 흰색으로 감싸주기) */}
      <section className="bg-white py-24">
        <DiagnosticCalculator />
      </section>

      {/* 18. 연락처 및 폼 */}
      <section id="contact" className="py-24 lg:py-40 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 max-w-3xl">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />
          </motion.div>

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] items-start">
            <div className="bg-white p-10 lg:p-12 rounded-3xl border border-black/5 shadow-sm space-y-10">
              <div>
                <h3 className="text-[28px] font-bold text-[#0B0F0E] mb-4">먼저 확인하는 것</h3>
                <p className="text-[16px] font-medium leading-[1.9] text-black/60">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              </div>
              <ul className="space-y-4">
                {["클릭 전환: 제목·썸네일", "콘텐츠 구조: 주제·재생목록", "문의 동선: 설명란·고정댓글·채널 홈"].map(txt => (
                  <li key={txt} className="text-[16px] font-semibold text-[#0B0F0E] flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{txt}</li>
                ))}
              </ul>
              <div className="flex flex-col xl:flex-row gap-4 pt-4 border-t border-black/10">
                {hasPhoneHref && (
                  <a href={phoneHref} className="flex-1 text-center bg-white border border-black/15 py-4 rounded-full text-[15px] font-bold hover:bg-black/5 transition-colors">{content.contact.quickCallLabel} {content.contact.phoneDisplay}</a>
                )}
                {hasKakaoChatUrl && (
                  <a href={kakaoChatUrl} className="flex-1 text-center bg-[#21c1a2] text-[#0B0F0E] py-4 rounded-full text-[15px] font-bold hover:bg-[#1db197] transition-colors">{content.contact.kakaoCtaLabel}</a>
                )}
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden bg-white border border-black/5 h-[760px] shadow-sm">
              {hasFormEmbedUrl ? (
                <iframe src={formEmbedUrl} className="w-full h-full border-0" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center p-10 text-center text-black/50 font-medium">Google Form 임베드 URL이 설정되지 않았습니다.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 19. FAQ & 인사이트 */}
      <section className="py-24 lg:py-40 bg-white">
        <div className={shell}>
          <div className="grid gap-24 lg:grid-cols-[1fr_1fr]">
            
            <div id="faq">
              <SectionHeader label={content.faq.label} title={content.faq.h2} />
              <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
                {content.faq.items.map((item) => (
                  <details key={item.q} className="group py-6">
                    <summary className="flex cursor-pointer items-center justify-between list-none text-[20px] font-bold text-[#0B0F0E]">
                      {item.q}
                      <span className="text-[#21c1a2] group-open:-rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-6 text-[16px] text-black/70 font-medium leading-[1.9] whitespace-pre-line">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div id="blog">
              <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />
              {insightPosts.length > 0 && (
                <div className="mt-12 space-y-6">
                  {insightPosts.map((post) => (
                    <Link key={post.slug} href={`/insights/${post.slug}`} className="block bg-[#FAFAFA] p-8 rounded-2xl border border-black/5 hover:bg-white hover:border-[#21c1a2] transition-colors shadow-sm">
                       <p className="text-[13px] font-bold tracking-widest text-black/40 mb-3">{post.publishedAt}</p>
                       <h3 className="text-[22px] font-bold mb-3">{post.title}</h3>
                       <p className="text-[15px] text-black/60 font-medium leading-[1.8] line-clamp-2">{post.description}</p>
                    </Link>
                  ))}
                  <div className="pt-8">
                    <ActionLink href="/insights" className="inline-flex items-center text-[16px] font-bold text-[#0B0F0E] border-b-2 border-black/10 pb-1 hover:border-[#21c1a2]">
                      {content.blog.ctaLabel} →
                    </ActionLink>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />

      {/* 20. Footer 원상 복구 */}
      <footer className="bg-white py-16 border-t border-black/10">
        <div className={`${shell} flex flex-col md:flex-row justify-between items-start gap-12`}>
          <div>
            <p className="font-bold text-[18px] mb-6 text-[#0B0F0E]">{content.footer.companyName}</p>
            <div className="space-y-2 text-[14px] text-black/60 font-medium">
              {content.footer.lines.map((line) => (
                <p key={line.label}>{line.label}: {line.value}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-[14px] font-bold text-black/50">
            <Link href="/store" className="hover:text-[#21c1a2] transition-colors">운영 플랜 신청</Link>
            <Link href="/terms" className="hover:text-[#21c1a2] transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-[#21c1a2] transition-colors">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-[#21c1a2] transition-colors">환불 정책</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
