"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
import { getSortedInsights } from "../content/insights";

// --- Design System Utilities ---
const shell = "mx-auto w-full max-w-[1320px] px-6 lg:px-12";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

// 에러 없는 안정적이고 부드러운 페이드업 애니메이션
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const formatInteger = (n: number) => new Intl.NumberFormat("ko-KR").format(Math.round(n));

function formatViewsKorean(n: number) {
  if (n >= 10000) {
    const tenThousands = n / 10000;
    const hasDecimal = tenThousands % 1 !== 0;
    return `${tenThousands.toFixed(hasDecimal ? 1 : 0)}만`;
  }
  return formatInteger(n);
}

function ActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const isExternal = href.startsWith("http");
  const mergedClass = `${className} ${focusRing} transition-all duration-300`;
  if (isExternal) return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const totalSubscribers = content.portfolio.items.reduce((sum, item) => sum + item.subscriberCurrent, 0);
  const totalVideoViews = content.heroStats.totalVideoViews;
  const totalVideoViewsInMan = `${formatInteger(totalVideoViews / 10000)}만+`;

  return (
    <main className="bg-white text-[#0B0F0E] antialiased selection:bg-[#21c1a2]/30">
      
      {/* 1. Header (Clean & Sharp) */}
      <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white/90 backdrop-blur-xl">
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className="flex items-center">
            <Image src="/logo.png" alt="Turnkeyhaus" width={160} height={44} className="h-9 w-auto object-contain" priority />
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[14px] font-semibold text-black/60 hover:text-black transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <ActionLink href="#contact" className="rounded-full bg-[#0B0F0E] px-7 py-2.5 text-[14px] font-semibold text-white hover:bg-[#21c1a2] hover:text-[#0B0F0E]">
            상담 예약하기
          </ActionLink>
        </div>
      </header>

      {/* 2. Hero Section (World-Class Ad Agency Style) */}
      <section id="top" className="pt-20 pb-24 lg:pt-32 lg:pb-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[1000px] mb-20">
            <span className="inline-block border border-black/10 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-[0.1em] text-black/50 mb-8">
              TURNKEYHAUS BY TKDG
            </span>
            <h1 className="text-[44px] font-bold leading-[1.15] tracking-tight sm:text-[64px] lg:text-[84px] whitespace-pre-line mb-8 text-[#0B0F0E]">
              {content.heroValue.headline}
            </h1>
            <p className="text-[18px] lg:text-[22px] leading-[1.8] text-black/60 font-medium whitespace-pre-line max-w-[38ch]">
              {content.heroValue.body}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <ActionLink href="#pilot" className="rounded-full bg-[#21c1a2] border border-[#21c1a2] px-8 py-4 text-[16px] font-bold text-[#0B0F0E] hover:bg-[#1db197]">
                {content.heroValue.primaryCta.label}
              </ActionLink>
              <ActionLink href="#contact" className="rounded-full bg-white border border-black/15 px-8 py-4 text-[16px] font-bold text-[#0B0F0E] hover:bg-black/5">
                {content.heroValue.secondaryCta.label}
              </ActionLink>
            </div>
          </motion.div>

          {/* Perfect 16:9 Cinematic Video Container */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="w-full aspect-video relative overflow-hidden rounded-2xl bg-[#0B0F0E] border border-black/5 shadow-2xl">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
              <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Strict Stats Layout */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-black/10 pt-12">
            {content.heroValue.trustBadges.map((badge) => (
              <div key={badge} className="text-[14px] font-semibold text-black/60 leading-relaxed border-l-2 border-[#21c1a2] pl-4">
                {badge}
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FAFAFA] rounded-2xl p-10 border border-black/5">
            <div>
              <p className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase mb-2">대표 사례</p>
              <p className="text-3xl font-bold tracking-tight">{content.portfolio.items.length}개 채널</p>
            </div>
            <div>
              <p className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase mb-2">현재 구독자 합산</p>
              <p className="text-3xl font-bold tracking-tight">{formatInteger(totalSubscribers)}명</p>
            </div>
            <div>
              <p className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase mb-2">전체 영상 누적 조회수</p>
              <p className="text-3xl font-bold tracking-tight">약 {totalVideoViewsInMan}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem Section (Solid Dark Background) */}
      <section id="problem" className="bg-[#0B0F0E] py-24 lg:py-32 text-white">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-[13px] font-bold tracking-[0.15em] text-[#21c1a2] uppercase block mb-6">{content.problem.label}</span>
              <h2 className="text-[36px] font-bold leading-[1.2] tracking-tight lg:text-[52px] whitespace-pre-line">
                {content.problem.h2}
              </h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-8">
              <p className="text-[18px] lg:text-[20px] font-medium leading-[1.8] text-white/80 whitespace-pre-line">
                {content.problem.lead}
              </p>
              {content.problem.items.length > 0 && (
                <ul className="space-y-4 border-t border-white/10 pt-8">
                  {content.problem.items.map((item) => (
                    <li key={item} className="text-[16px] font-medium text-white/70 flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#21c1a2] shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="text-[18px] font-semibold text-[#21c1a2] leading-relaxed">{content.problem.emphasis}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Presenter Ops (Restored cleanly) */}
      <section id="presenter-ops" className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.presenterOps.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line">{content.presenterOps.h2}</h2>
              <p className="mt-6 text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.presenterOps.lead}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <div className="border-t border-black/10">
                {content.presenterOps.points.map((point) => (
                  <div key={point} className="border-b border-black/10 py-5">
                    <p className="text-[18px] font-semibold text-[#0B0F0E]">{point}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 border-l-2 border-[#21c1a2] pl-6 text-[16px] font-medium leading-[1.8] text-black/70 max-w-[70ch]">
                {content.presenterOps.note}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Services Section (Structured Grid) */}
      <section id="services" className="py-24 lg:py-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:items-end">
            <div>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.servicePillars.label}</span>
              <h2 className="text-[36px] lg:text-[52px] font-bold tracking-tight leading-[1.2]">{content.servicePillars.h2}</h2>
            </div>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8]">{content.servicePillars.lead}</p>
          </motion.div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {content.servicePillars.cards.map((card, idx) => (
              <motion.article 
                key={card.title} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }}
                className={`bg-[#FAFAFA] rounded-2xl p-10 border border-black/5 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-black/10 transition-all duration-300 ${idx === 0 ? 'lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-16' : ''}`}
              >
                <div>
                  <span className="text-[12px] font-bold text-[#21c1a2] uppercase tracking-widest block mb-4">Service 0{idx + 1}</span>
                  <h3 className="text-[28px] font-bold tracking-tight mb-4">{card.headline}</h3>
                  <p className="text-[16px] text-black/60 font-medium leading-[1.8] mb-8">{card.body}</p>
                </div>
                <div className={`${idx === 0 ? 'lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0' : 'border-t border-black/10 pt-8'}`}>
                  <ul className="space-y-3 mb-8">
                    {card.bullets.map(b => (
                      <li key={b} className="text-[15px] font-semibold text-black/70 flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <ActionLink href={card.href} className="inline-flex items-center text-[15px] font-bold text-[#0B0F0E] hover:text-[#21c1a2] transition-colors">
                    {card.ctaLabel} <span className="ml-2">→</span>
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Exclusions (Not Single) */}
      <section id="not-single" className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.exclusions.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line">{content.exclusions.h2}</h2>
              <p className="mt-6 text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.exclusions.lead}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="border-t border-black/10">
              {content.exclusions.items.map((item) => (
                <div key={item.title} className="border-b border-black/10 py-8">
                  <h3 className="text-[22px] font-bold text-[#0B0F0E] mb-3">{item.title}</h3>
                  <p className="text-[16px] text-black/60 font-medium leading-[1.8]">{item.body}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Quality & Approach & Strategy Deck */}
      <section id="approach" className="py-24 lg:py-32 bg-white">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] mb-32">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.videoQuality.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line">{content.videoQuality.h2}</h2>
              <p className="mt-6 text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.videoQuality.lead}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {content.videoQuality.points.map((point) => (
                  <div key={point} className="border-b border-black/10 py-4"><p className="font-semibold">{point}</p></div>
                ))}
              </div>
              <p className="border-l-2 border-[#21c1a2] pl-6 text-[16px] font-medium leading-[1.8] text-black/70">{content.videoQuality.note}</p>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mb-16">
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.strategyFrame.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line">{content.strategyFrame.h2}</h2>
              <p className="mt-6 text-[18px] text-black/60 font-medium leading-[1.8]">{content.approach.lead}</p>
            </div>
            <StrategyChapterDeck />
            <p className="mt-12 text-center text-[18px] font-bold text-[#0B0F0E] whitespace-pre-line">{content.approach.keyline}</p>
          </motion.div>
        </div>
      </section>

      {/* 8. Professional Targets (Industry Focus) */}
      <section id="professional" className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 text-center max-w-3xl mx-auto">
            <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.professionalTargets.label}</span>
            <h2 className="text-[36px] font-bold tracking-tight lg:text-[52px] leading-[1.2] whitespace-pre-line mb-6">{content.professionalTargets.h2}</h2>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.professionalTargets.lead}</p>
          </motion.div>

          <div className="space-y-12">
            {content.professionalTargets.cards.map((card, idx) => (
              <motion.article key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl border border-black/5 overflow-hidden">
                <div className={`relative aspect-[4/3] lg:aspect-auto ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                   {card.image ? (
                      <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                    ) : (
                      <div className="h-full w-full bg-[#F9FAFB] p-10 flex flex-col justify-end border-l border-black/5">
                        <p className="text-[12px] font-bold text-black/40 uppercase mb-4">{card.imageFallback?.eyebrow}</p>
                        <div className="space-y-2">
                          {card.imageFallback?.lines.map(line => <p key={line} className="text-2xl font-bold">{line}</p>)}
                        </div>
                      </div>
                    )}
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <h3 className="text-[32px] font-bold tracking-tight mb-4">{card.title}</h3>
                  <p className="text-[18px] text-black/60 font-medium leading-[1.8] mb-6">{card.oneLiner}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {card.tags?.map(tag => <span key={tag} className="bg-black/5 px-3 py-1 rounded-md text-[13px] font-bold text-black/60">#{tag}</span>)}
                  </div>
                  <ul className="space-y-3 mb-10 border-t border-black/10 pt-8">
                    {card.bullets.map(b => <li key={b} className="text-[15px] font-medium text-black/70 flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 bg-black/20 rounded-full shrink-0" />{b}</li>)}
                  </ul>
                  <ActionLink href={card.href} className="text-[15px] font-bold border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] transition-colors w-fit">
                    {card.ctaLabel}
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Proof & Report Sample */}
      <section id="proof" className="py-24 lg:py-32 bg-white">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center mb-32">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-black/5">
               <Image src={content.studioProof.images[0]?.src ?? "/images/showreel-cover-optimized.jpg"} alt="Proof" fill className="object-cover" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.studioProof.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line mb-6">{content.studioProof.h2}</h2>
              <p className="text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line mb-8">{content.studioProof.crewLead}</p>
              
              <ul className="space-y-3 border-y border-black/10 py-6 mb-8">
                {content.studioProof.operationSystem.map((item) => (
                  <li key={item} className="text-[15px] font-semibold text-black/70 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#21c1a2] shrink-0"/> {item}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-6">
                {content.studioProof.crewCards.map((crew) => (
                  <div key={crew.role} className="bg-[#FAFAFA] p-5 rounded-xl border border-black/5">
                    <p className="text-[11px] font-bold text-black/40 uppercase mb-2">{crew.role}</p>
                    <p className="text-[16px] font-bold">{crew.headline}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#FAFAFA] rounded-3xl p-10 lg:p-16 border border-black/5">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.reportSample.label}</span>
                <h2 className="text-[32px] font-bold tracking-tight leading-[1.2] whitespace-pre-line mb-6">{content.reportSample.h2}</h2>
                <p className="text-[16px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.reportSample.lead}</p>
              </div>
              <div>
                <dl className="divide-y divide-black/10 border-y border-black/10">
                  {content.reportSample.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 py-5 items-center">
                      <dt className="text-[13px] font-bold text-black/40 tracking-wide">{row.label}</dt>
                      <dd className="text-[16px] font-semibold">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[14px] font-medium text-black/50">{content.reportSample.note}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. Team Section (Clean, Professional, Functional) */}
      <section id="team" className="py-24 lg:py-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:items-end">
            <div>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.leadership.label}</span>
              <h2 className="text-[36px] lg:text-[52px] font-bold tracking-tight leading-[1.2]">{content.leadership.h2}</h2>
            </div>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8]">{content.leadership.lead}</p>
          </motion.div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.article key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} className="group border border-black/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="flex p-6 border-b border-black/10 gap-6 items-center bg-[#FAFAFA]">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden shrink-0 border border-black/10">
                     <Image src={person.image.src} alt={person.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-bold">{person.name}</h3>
                    <p className="text-[13px] font-bold text-[#21c1a2] mt-1">{person.role}</p>
                  </div>
                </div>
                <div className="p-8 bg-white h-full">
                  <p className="text-[15px] font-medium text-black/70 leading-[1.8] mb-8">{person.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {person.responsibilities.map(r => (
                      <span key={r} className="bg-black/5 px-2.5 py-1 rounded text-[12px] font-bold text-black/60">#{r}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Portfolio Section (Clear Data & Impact) */}
      <section id="portfolio" className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 text-center max-w-3xl mx-auto">
            <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.portfolio.label}</span>
            <h2 className="text-[36px] font-bold tracking-tight lg:text-[52px] leading-[1.2] whitespace-pre-line mb-6">{content.portfolio.h2}</h2>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8]">{content.portfolio.lead}</p>
          </motion.div>
          
          <div className="space-y-8">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl border border-black/5 p-8 lg:p-12 shadow-sm grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:items-center hover:border-black/15 transition-colors"
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?modestbranding=1&rel=0`} className="absolute inset-0 h-full w-full border-0" />
                  ) : (
                    <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="mb-6">
                    <span className="text-[12px] font-bold tracking-widest text-[#21c1a2] uppercase block mb-3">Client: {item.clientName}</span>
                    <h3 className="text-[32px] font-bold tracking-tight leading-tight">{item.title}</h3>
                  </div>
                  <p className="text-[17px] font-medium text-black/70 leading-[1.8] mb-8">{item.oneLiner}</p>
                  
                  <div className="grid grid-cols-2 gap-6 bg-[#FAFAFA] p-6 rounded-xl border border-black/5 mb-8">
                    <div>
                      <p className="text-[11px] font-bold text-black/40 uppercase mb-2">구독자 변화</p>
                      <p className="text-[20px] font-bold">{item.result}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-black/40 uppercase mb-2">최고 조회수</p>
                      <p className="text-[20px] font-bold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</p>
                    </div>
                  </div>
                  
                  {item.scope && (
                    <div className="mb-8">
                       <p className="text-[13px] font-bold text-black/40 uppercase mb-2">담당 범위</p>
                       <p className="text-[15px] font-semibold text-[#0B0F0E]">{item.scope}</p>
                    </div>
                  )}

                  <ActionLink href={`/cases/${item.caseSlug}`} className="text-[15px] font-bold border-b-2 border-black/10 pb-1 hover:border-[#21c1a2]">
                    케이스 스터디 보기
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Pilot & Pricing (Clear Tables) */}
      <section id="pilot" className="py-24 lg:py-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:items-end">
            <div>
              <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.pricing.label}</span>
              <h2 className="text-[36px] lg:text-[52px] font-bold tracking-tight leading-[1.2] whitespace-pre-line">{content.pricing.h2}</h2>
            </div>
            <p className="text-[18px] text-[#21c1a2] font-bold leading-[1.8]">{content.pricing.emphasis}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.pricing.levels.map((level, i) => (
              <div key={level.title} className="bg-[#FAFAFA] border border-black/5 rounded-2xl p-10 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-black/40 uppercase mb-4">Option 0{i + 1}</p>
                  <p className="text-[28px] font-bold text-[#0B0F0E] mb-2">{level.priceBand}</p>
                  <h3 className="text-[20px] font-bold mb-8">{level.title}</h3>
                  <ul className="space-y-4 border-t border-black/10 pt-8 mb-10">
                    {level.bullets.map(b => (
                      <li key={b} className="text-[14px] font-semibold text-black/70 flex items-start gap-3">
                        <span className="mt-2 h-1 w-1 bg-black/30 rounded-full shrink-0"/> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-5 rounded-xl border border-black/5">
                  <p className="text-[13px] font-bold text-[#21c1a2]">{level.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Risk Management */}
      <section id="risk" className="py-24 lg:py-32 bg-[#0B0F0E] text-white">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-[12px] font-bold tracking-[0.15em] text-white/40 uppercase block mb-4">{content.riskManagement.label}</span>
              <h2 className="text-[32px] font-bold tracking-tight lg:text-[48px] leading-[1.2] whitespace-pre-line">{content.riskManagement.h2}</h2>
              <p className="mt-6 text-[18px] text-white/70 font-medium leading-[1.8] whitespace-pre-line">{content.riskManagement.lead}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <ul className="space-y-6 border-y border-white/10 py-10 mb-8">
                {content.riskManagement.items.map(item => (
                  <li key={item} className="text-[16px] font-semibold text-white flex items-center gap-4">
                    <span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[15px] font-medium text-white/50 leading-[1.8] p-6 bg-white/5 rounded-xl">{content.riskManagement.note}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 14. Fit & Recommendations */}
      <section id="fit" className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 text-center max-w-3xl mx-auto">
            <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.aiRecommendation.label}</span>
            <h2 className="text-[36px] font-bold tracking-tight lg:text-[52px] leading-[1.2] whitespace-pre-line mb-6">{content.aiRecommendation.h2}</h2>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{content.aiRecommendation.lead}</p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {content.aiRecommendation.items.map((item, i) => (
              <motion.div key={item.prompt} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white p-8 lg:p-10 rounded-2xl border border-black/5 shadow-sm">
                <p className="text-[11px] font-bold text-[#21c1a2] tracking-widest uppercase mb-4">Case 0{i + 1}</p>
                <h3 className="text-[22px] font-bold text-[#0B0F0E] mb-4">{item.prompt}</h3>
                <p className="text-[16px] font-medium text-black/60 mb-6 pb-6 border-b border-black/5">{item.fit}</p>
                <ul className="space-y-3">
                  {item.reasons.map(reason => <li key={reason} className="text-[14px] font-semibold text-black/70">· {reason}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="mt-12 text-center text-[16px] font-bold text-[#0B0F0E]">{content.aiRecommendation.note}</p>
        </div>
      </section>

      {/* 15. Diagnostic Calculator Component */}
      <DiagnosticCalculator />

      {/* 16. Contact Section */}
      <section id="contact" className="py-24 lg:py-32 bg-white border-b border-black/5">
        <div className={shell}>
          <div className="mb-16">
            <span className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase block mb-4">{content.contact.label}</span>
            <h2 className="text-[36px] font-bold tracking-tight lg:text-[52px] leading-[1.2] whitespace-pre-line mb-6">{content.contact.h2}</h2>
            <p className="text-[18px] text-black/60 font-medium leading-[1.8]">{content.contact.lead}</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#FAFAFA] rounded-2xl p-10 lg:p-12 border border-black/5 h-fit">
              <h3 className="text-[24px] font-bold mb-4">먼저 확인하는 것</h3>
              <p className="text-[16px] font-medium text-black/60 mb-8 leading-[1.8]">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              <ul className="space-y-4 mb-12">
                {["클릭 전환: 제목·썸네일", "콘텐츠 구조: 주제·재생목록", "문의 동선: 설명란·고정댓글·채널 홈"].map(txt => (
                  <li key={txt} className="text-[15px] font-semibold text-[#0B0F0E] flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{txt}</li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={content.contact.phoneHref} className="flex-1 text-center bg-white border border-black/15 py-4 rounded-xl text-[15px] font-bold hover:bg-black/5 transition-colors">{content.contact.phoneDisplay}</a>
                <a href={content.contact.kakaoChatUrl} className="flex-1 text-center bg-[#21c1a2] text-[#0B0F0E] py-4 rounded-xl text-[15px] font-bold hover:bg-[#1db197] transition-colors">{content.contact.kakaoCtaLabel}</a>
              </div>
            </div>
            
            <div className="rounded-2xl border border-black/10 overflow-hidden h-[700px] shadow-sm bg-[#FAFAFA]">
              <iframe src={content.contact.googleFormEmbedUrl} className="w-full h-full border-0" loading="lazy" title="Contact Form" />
            </div>
          </div>
        </div>
      </section>

      {/* 17. FAQ & Blog */}
      <section className="py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <div className="grid gap-24 lg:grid-cols-[1fr_1fr]">
            
            {/* FAQ Area */}
            <div id="faq">
              <h2 className="text-[28px] font-bold tracking-tight mb-12">{content.faq.h2}</h2>
              <div className="divide-y divide-black/10 border-y border-black/10">
                {content.faq.items.map((item) => (
                  <details key={item.q} className="group py-6">
                    <summary className="flex cursor-pointer items-center justify-between list-none text-[18px] font-bold text-[#0B0F0E]">
                      {item.q}
                      <span className="text-[#21c1a2] group-open:-rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-5 text-[15px] text-black/60 font-medium leading-[1.8] whitespace-pre-line">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Blog Area */}
            <div id="blog">
              <h2 className="text-[28px] font-bold tracking-tight mb-6">{content.blog.h2}</h2>
              <p className="text-[16px] text-black/50 font-medium mb-12">{content.blog.lead}</p>
              
              {insightPosts.length > 0 && (
                <div className="space-y-6">
                  {insightPosts.map((post) => (
                    <Link key={post.slug} href={`/insights/${post.slug}`} className="block bg-white p-6 rounded-xl border border-black/5 hover:border-[#21c1a2] transition-colors shadow-sm">
                       <p className="text-[12px] font-bold text-black/40 mb-2">{post.publishedAt}</p>
                       <h3 className="text-[18px] font-bold mb-2">{post.title}</h3>
                       <p className="text-[14px] text-black/60 font-medium line-clamp-2">{post.description}</p>
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-black/10">
                    <ActionLink href="/insights" className="text-[15px] font-bold text-[#0B0F0E] hover:text-[#21c1a2]">전체 인사이트 보기 →</ActionLink>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-black/10">
        <div className={`${shell} flex flex-col md:flex-row justify-between items-start gap-12`}>
          <div>
            <p className="font-bold text-[18px] mb-6">{content.footer.companyName}</p>
            <div className="space-y-2 text-[13px] text-black/50 font-medium">
              {content.footer.lines.map((line) => (
                <p key={line.label}>{line.label}: {line.value}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-[13px] font-bold text-black/50">
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
