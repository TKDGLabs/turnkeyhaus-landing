"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content, type LeadershipProfile, type SpecItem } from "../content";
import { getSortedInsights } from "../content/insights";

const shell = "mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-10";
const labelClass = "inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-black/55 uppercase";
const sectionTitle = "whitespace-pre-line break-keep text-[28px] sm:text-[32px] font-bold leading-[1.25] tracking-tight text-[#0B0F0E] md:text-[48px]";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/");
}

function ActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const mergedClass = `${className} ${focusRing} transition-all duration-300`;
  if (isExternalLink(href)) {
    return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  }
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

function SectionHeader({ label, title, lead, dark = false }: { label: string; title: string; lead?: string; dark?: boolean; }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <span className={dark ? "inline-flex items-center border border-white/20 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/60 uppercase" : labelClass}>
        {label}
      </span>
      <h2 className={dark ? `${sectionTitle} text-white` : sectionTitle}>{title}</h2>
      {lead ? (
        <p className={dark ? "max-w-[62ch] whitespace-pre-line break-keep text-[15px] sm:text-[17px] leading-[1.8] text-white/70 md:text-[19px] font-medium" : "max-w-[62ch] whitespace-pre-line break-keep text-[15px] sm:text-[17px] leading-[1.8] text-black/70 md:text-[19px] font-medium"}>
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

function TeamMemberCard({ person }: { person: LeadershipProfile }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-black/5 shadow-sm transition-all duration-500 cursor-pointer hover:shadow-xl ${isExpanded ? 'ring-2 ring-[#21c1a2]' : ''}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F1F1F1]">
        <Image 
          src={person.image.src} 
          alt={person.name} 
          fill 
          className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 ${isExpanded ? 'scale-105 brightness-75' : ''}`} 
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {!isExpanded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
            <p className="text-white text-[13px] md:text-sm font-bold">세부 경력 보기 +</p>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 bg-white">
        <div className="mb-6">
          <h3 className="text-[26px] font-bold text-[#0B0F0E]">
            {person.name} <span className="text-[13px] text-black/30 font-bold ml-1.5 uppercase tracking-widest">{person.englishName}</span>
          </h3>
          <p className="text-[#21c1a2] text-[15px] font-bold mt-2">
            {person.name === "채동우" ? "채널 기획 · 운영 총괄" : person.name === "손현우" ? "촬영 · 제작 총괄" : "구성 · 편집 총괄"}
          </p>
        </div>
        
        <p className="text-[15px] font-medium leading-[1.8] text-black/60 mb-2">
          {person.body}
        </p>
        {!isExpanded && (
          <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
            <div className="flex gap-2">
              {person.responsibilities.slice(0, 2).map((r: string) => (
                <span key={r} className="text-[11px] font-bold bg-black/5 px-2 py-1 rounded text-black/40">#{r}</span>
              ))}
            </div>
            <span className="text-[12px] font-bold text-[#21c1a2]">Profile ▼</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-8 pb-8 pt-0 bg-white"
          >
            <div className="border-t border-black/5 pt-6 space-y-6">
              {person.specs.map((spec: SpecItem) => (
                <div key={spec.category}>
                  <h4 className="text-[11px] font-bold text-black/30 uppercase tracking-widest mb-3">{spec.category}</h4>
                  <ul className="space-y-1.5">
                    {spec.items.map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] font-bold text-black/70 leading-snug">
                        <span className="mt-1.5 h-1 w-1 bg-[#21c1a2] rounded-full shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-center text-[12px] font-bold text-black/20 mt-4">카드를 다시 누르면 닫힙니다</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

  return (
    <main className="bg-white text-[#0B0F0E] antialiased pb-20 md:pb-0">
      
      {/* 1. 풀스크린 비디오 */}
      <section className="relative w-full bg-black overflow-hidden aspect-video">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-center">
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 2. Hero 텍스트 영역 */}
      <section id="top" className="bg-white py-16 md:py-24 lg:py-32">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-[1000px] space-y-6 md:space-y-8 text-[#0B0F0E]">
            <p className="text-[13px] font-bold tracking-[0.2em] text-[#21c1a2] uppercase">턴키하우스 by TKDG</p>
            <h1 className="whitespace-pre-line break-keep text-[36px] sm:text-[54px] lg:text-[84px] font-bold leading-[1.15] tracking-tight">
              {content.heroValue.headline}
            </h1>
            <p className="max-w-[58ch] text-[18px] lg:text-[24px] text-black/60 font-medium leading-relaxed">
              {content.heroValue.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <ActionLink href="#contact" className="inline-flex justify-center items-center rounded-full bg-[#21c1a2] px-10 py-5 text-[16px] font-bold text-black shadow-lg shadow-[#21c1a2]/20">
                무료 3포인트 진단 받기
              </ActionLink>
              <ActionLink href="#portfolio" className="inline-flex justify-center items-center rounded-full bg-white border border-black/15 px-10 py-5 text-[16px] font-bold">
                운영 사례 보기
              </ActionLink>
            </div>
          </motion.div>
          
          <div className="mt-16 md:mt-24 grid gap-6 md:gap-8 border-t border-black/10 pt-10 md:pt-16 sm:grid-cols-3 bg-[#FAFAFA] rounded-2xl md:rounded-3xl p-8 md:p-10 border border-black/5">
            <div className="space-y-2 md:space-y-3 text-center sm:text-left">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">대표 사례</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-2 md:space-y-3 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-black/10 pt-6 sm:pt-0 sm:pl-6">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">누적 구독자</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-2 md:space-y-3 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-black/10 pt-6 sm:pt-0 sm:pl-6">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">누적 조회수</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 포트폴리오 */}
      <section id="portfolio" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-20">
            <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          </motion.div>

          <div className="space-y-12 md:space-y-16">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_1fr] items-center bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-12 border border-black/5 shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full aspect-video overflow-hidden rounded-xl md:rounded-2xl bg-black border border-black/5">
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`} className="absolute inset-0 h-full w-full border-0" allowFullScreen />
                  ) : (
                    <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                  )}
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div>
                    <span className="text-[13px] font-bold text-[#21c1a2] uppercase tracking-widest">{item.clientName}</span>
                    <h3 className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#0B0F0E] leading-tight mt-2 mb-4">{item.title}</h3>
                    <p className="text-[15px] md:text-[17px] leading-[1.8] text-black/70 font-medium">{item.oneLiner}</p>
                  </div>

                  <dl className="grid grid-cols-2 gap-4 md:gap-6 bg-[#FAFAFA] border border-black/5 rounded-xl p-5 md:p-6">
                    <div>
                      <dt className="text-[11px] font-bold text-black/40 uppercase mb-1 md:mb-2">구독자 변화</dt>
                      <dd className="text-[18px] md:text-[20px] font-bold text-[#0B0F0E]">{item.result}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-black/40 uppercase mb-1 md:mb-2">최고 조회수</dt>
                      <dd className="text-[18px] md:text-[20px] font-bold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>

                  <div className="hidden md:grid gap-4 md:gap-6 border-t border-black/5 pt-5 md:pt-6 text-[13px] md:text-[14px] font-medium leading-[1.75] text-black/60 sm:grid-cols-2">
                    {item.before && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">BEFORE</p><p className="break-keep">{item.before}</p></div>)}
                    {item.action && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">ACTION</p><p className="break-keep">{item.action}</p></div>)}
                    {item.after && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">AFTER</p><p className="break-keep">{item.after}</p></div>)}
                    {item.proof && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">운영 포인트</p><p className="break-keep">{item.proof}</p></div>)}
                  </div>

                  <ActionLink href={`/cases/${item.caseSlug}`} className="inline-block mt-2 md:mt-4 text-[14px] md:text-[15px] font-bold border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] hover:text-[#21c1a2] transition-colors">
                    프로젝트 해부도 보기 →
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 md:mt-16 text-center">
             <ActionLink href="#contact" className="inline-flex justify-center items-center rounded-full bg-white border border-black/15 px-8 py-4 text-[15px] font-bold text-black shadow-sm hover:bg-black/5 transition-colors">무료 3포인트 진단 신청</ActionLink>
          </div>
        </div>
      </section>

      {/* 4. 요금제 */}
      <section id="pilot" className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={`${shell} grid gap-10 md:gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:sticky lg:top-32 lg:self-start space-y-4 md:space-y-6">
            <SectionHeader label={content.pricing.label} title={content.pricing.h2} />
            <p className="text-[16px] md:text-[18px] font-bold leading-[1.7] md:leading-[1.85] text-[#21c1a2]">{content.pricing.emphasis}</p>
          </motion.div>

          <div className="border-t border-black/10">
            {content.pricing.levels.slice(0, 3).map((level, index) => (
              <motion.article key={level.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid gap-4 md:gap-6 border-b border-black/10 py-8 md:py-10 lg:grid-cols-[180px_1fr]">
                <div>
                  <p className="text-[11px] md:text-[12px] font-bold tracking-widest text-black/40 mb-1 md:mb-2 uppercase">OPTION 0{index + 1}</p>
                  <p className="text-[24px] md:text-[28px] font-bold tracking-tight text-[#0B0F0E]">{level.priceBand}</p>
                </div>
                <div>
                  <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0B0F0E] mb-4 md:mb-6">{level.title}</h3>
                  <ul className="grid gap-3 md:gap-4 text-[14px] md:text-[15px] font-medium leading-[1.7] md:leading-[1.75] text-black/70 sm:grid-cols-2">
                    {level.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 md:gap-3 items-start"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/30 shrink-0"/>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-6 md:mt-8 bg-[#FAFAFA] border border-black/5 p-4 md:p-5 rounded-xl md:rounded-2xl text-[13px] md:text-[14px] font-bold text-black/50">{level.target}</p>
                </div>
              </motion.article>
            ))}

            <div className="mt-12 text-center md:text-left">
               <ActionLink href="#contact" className="inline-flex justify-center items-center rounded-full bg-[#0B0F0E] px-10 py-5 text-[16px] font-bold text-white shadow-sm hover:bg-[#21c1a2] transition-colors">채널 링크 보내고 1차 진단 받기</ActionLink>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 하지 않는 일 */}
      <section id="not-single" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={`${shell} grid gap-10 md:gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.exclusions.label} title={content.exclusions.h2} lead={content.exclusions.lead} />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="border-t border-black/10">
            {content.exclusions.items.map((item) => (
              <article key={item.title} className="border-b border-black/10 py-6 md:py-8">
                <h3 className="break-keep text-[20px] md:text-[24px] font-bold leading-[1.35] tracking-tight text-[#0B0F0E] mb-3 md:mb-4">{item.title}</h3>
                <p className="max-w-[74ch] break-keep text-[15px] md:text-[16px] font-medium leading-[1.7] md:leading-[1.85] text-black/60">{item.body}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. 문제 현실 점검 */}
      <section id="problem" className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={`${shell} grid gap-10 md:gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-4 md:space-y-6 lg:sticky lg:top-32 lg:self-start">
            <span className={labelClass}>{content.problem.label}</span>
            <h2 className={`${sectionTitle}`}>{content.problem.h2}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-6 md:space-y-10">
            <p className="whitespace-pre-line break-keep text-[16px] md:text-[20px] leading-[1.8] md:leading-[1.9] text-black/80 font-medium">{problemSupport}</p>
            <p className="whitespace-pre-line break-keep text-[15px] md:text-[18px] leading-[1.8] md:leading-[1.95] text-black/60 font-medium">{problemDetail}</p>
            <figure className="overflow-hidden rounded-xl md:rounded-2xl bg-[#FAFAFA] border border-black/5 mt-6 md:mt-8">
              <Image src={content.problem.image.src} alt={content.problem.image.alt} width={1600} height={1030} className="h-auto w-full object-cover" sizes="(max-width: 1024px) 100vw, 90vw" />
            </figure>
            <p className="text-[18px] md:text-[22px] font-bold leading-[1.6] md:leading-[1.75] text-[#21c1a2]">
              {content.problem.emphasis}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 7. 전략 프레임 */}
      <section id="approach" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-16">
            <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 border-t border-black/10 pt-12 mb-16">
            {content.strategyFrame.steps.map((step, index) => (
              <div key={step.title} className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <p className="text-[12px] font-bold tracking-widest text-[#21c1a2] mb-3">STEP 0{index + 1}</p>
                <h4 className="text-[20px] font-bold text-[#0B0F0E] mb-4">{step.title}</h4>
                <p className="text-[15px] font-medium leading-[1.8] text-black/60">{step.detail}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
             <StrategyChapterDeck />
          </div>
          <p className="mt-12 md:mt-16 text-center text-[16px] md:text-[18px] font-bold leading-[1.8] md:leading-[1.9] text-[#21c1a2]">{content.approach.keyline}</p>
        </div>
      </section>

      {/* 8. 제작 품질 & 출연자 운영 */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-16 max-w-3xl mx-auto text-center">
            <h2 className={sectionTitle}>촬영 품질과 출연자 준비를{"\n"}함께 관리합니다.</h2>
            <p className="mt-4 md:mt-6 text-[15px] sm:text-[17px] leading-[1.8] text-black/70 md:text-[19px] font-medium break-keep">
              전문직 콘텐츠는 좋은 장비만으로 완성되지 않습니다. 촬영 전 질문지, 현장 진행, 검수 기준까지 정리되어야 오래 운영할 수 있습니다.
            </p>
          </motion.div>

          <div className="grid gap-8 md:gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#FAFAFA] border border-black/5 p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm">
              <div className="space-y-4 md:space-y-6">
                 <span className="inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-black/55 uppercase">{content.videoQuality.label}</span>
                 <h3 className="whitespace-pre-line break-keep text-[24px] sm:text-[28px] font-bold leading-[1.3] tracking-tight text-[#0B0F0E]">{content.videoQuality.h2}</h3>
                 <p className="whitespace-pre-line break-keep text-[15px] md:text-[16px] leading-[1.7] text-black/70 font-medium">{content.videoQuality.lead}</p>
              </div>
              <div className="mt-8 md:mt-10 space-y-4 border-t border-black/5 pt-6 md:pt-8">
                {content.videoQuality.points.map((point) => (
                  <p key={point} className="text-[14px] md:text-[15px] font-bold text-[#0B0F0E] flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{point}</p>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="bg-[#FAFAFA] border border-black/5 p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm">
              <div className="space-y-4 md:space-y-6">
                 <span className="inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-black/55 uppercase">{content.presenterOps.label}</span>
                 <h3 className="whitespace-pre-line break-keep text-[24px] sm:text-[28px] font-bold leading-[1.3] tracking-tight text-[#0B0F0E]">{content.presenterOps.h2}</h3>
                 <p className="whitespace-pre-line break-keep text-[15px] md:text-[16px] leading-[1.7] text-black/70 font-medium">{content.presenterOps.lead}</p>
              </div>
              <div className="mt-8 md:mt-10 space-y-4 border-t border-black/5 pt-6 md:pt-8">
                <ul className="space-y-3 pt-2">
                   {content.presenterOps.points.map(p => <li key={p} className="flex gap-3 items-start text-[14px] md:text-[15px] font-bold text-black/70"><span className="mt-1.5 md:mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{p}</li>)}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. 업종별 적용 */}
      <section id="professional" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 md:mb-24 max-w-3xl">
            <SectionHeader label={content.professionalTargets.label} title={content.professionalTargets.h2} lead={content.professionalTargets.lead} />
          </motion.div>

          <div className="space-y-16 md:space-y-20">
            {content.professionalTargets.cards.map((card, index) => (
              <motion.article key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
                <figure className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-black/5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {card.image ? (
                    <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  ) : (
                    <div className="flex h-full flex-col justify-end p-6 md:p-10">
                      <p className="text-[11px] md:text-[12px] font-bold text-black/40 mb-3 md:mb-4">{card.imageFallback?.eyebrow}</p>
                      {card.imageFallback?.lines.map(line => <p key={line} className="text-[20px] md:text-2xl font-bold text-[#0B0F0E]">{line}</p>)}
                    </div>
                  )}
                </figure>
                <div className="space-y-5 md:space-y-6">
                  <h3 className="text-[28px] md:text-[36px] font-bold tracking-tight text-[#0B0F0E]">{card.title}</h3>
                  <p className="text-[16px] md:text-[18px
