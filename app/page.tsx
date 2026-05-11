"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
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
  return href.startsWith("http://") || href.startsWith("https://");
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
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
    <main className="bg-white text-[#0B0F0E] antialiased pb-20 md:pb-0">
      
      {/* 1. 스마트 헤더 */}
      <header 
        className={`fixed top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-xl transition-all duration-500 ease-in-out ${
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className={`${shell} flex h-[60px] md:h-20 items-center justify-between`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/logo.png" alt="Turnkeyhaus" width={140} height={38} className="h-6 md:h-8 w-auto object-contain" priority />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className={`text-[14px] font-bold text-black/60 hover:text-black transition-colors ${focusRing}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ActionLink href="https://sclu.io/share/bulk/file/bf2w8ioROJvw" className="inline-flex h-9 md:h-10 items-center rounded-full bg-[#21c1a2] px-5 md:px-6 text-[13px] md:text-[14px] font-bold text-black transition-transform hover:scale-105">
            소개서 다운로드
          </ActionLink>
        </div>
      </header>

      {/* 🚀 2. 모바일 영상 잘림 현상 완벽 해결: 모바일은 16:9 비율 유지, PC는 풀스크린 */}
      <section className="relative w-full bg-black overflow-hidden aspect-video md:aspect-auto md:h-[100svh] md:min-h-[600px]">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-center">
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 3. Hero 텍스트 영역 */}
      <section id="top" className="bg-white py-16 md:py-24 lg:py-32">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-[1000px] space-y-6 md:space-y-8 text-[#0B0F0E]">
            <p className="text-[12px] md:text-[13px] font-bold tracking-[0.2em] text-[#21c1a2] uppercase">턴키하우스 by TKDG</p>
            <h1 className="whitespace-pre-line break-keep text-[32px] sm:text-[48px] font-bold leading-[1.25] tracking-tight md:text-[64px] lg:text-[76px]">
              {content.heroValue.headline}
            </h1>
            <p className="max-w-[58ch] whitespace-pre-line break-keep text-[16px] sm:text-[18px] leading-[1.7] text-black/60 md:text-[22px] font-medium">
              {content.heroValue.body}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 md:pt-6">
              <ActionLink href={content.heroValue.primaryCta.href} className="inline-flex justify-center items-center rounded-full bg-[#21c1a2] px-8 py-3.5 md:py-4 text-[15px] md:text-[16px] font-bold text-[#07211d] hover:bg-[#1db197] transition-transform hover:scale-105 w-full sm:w-auto text-center">
                {content.heroValue.primaryCta.label}
              </ActionLink>
              <ActionLink href={content.heroValue.secondaryCta.href} className="inline-flex justify-center items-center rounded-full bg-white border border-black/15 px-8 py-3.5 md:py-4 text-[15px] md:text-[16px] font-bold text-[#0B0F0E] hover:bg-black/5 transition-colors w-full sm:w-auto text-center">
                {content.heroValue.secondaryCta.label}
              </ActionLink>
            </div>
          </motion.div>
          
          <div className="mt-16 md:mt-24 grid gap-6 md:gap-8 border-t border-black/10 pt-10 md:pt-16 sm:grid-cols-3 bg-[#FAFAFA] rounded-2xl md:rounded-3xl p-8 md:p-10 border border-black/5">
            <div className="space-y-2 md:space-y-3 text-center sm:text-left">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">대표 사례</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-2 md:space-y-3 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-black/10 pt-6 sm:pt-0 sm:pl-6">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">현재 구독자 합산</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-2 md:space-y-3 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-black/10 pt-6 sm:pt-0 sm:pl-6">
              <dt className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] text-black/40 uppercase">전체 영상 누적 조회수</dt>
              <dd className="text-[32px] md:text-[40px] font-bold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 포트폴리오 */}
      <section id="portfolio" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-20">
            <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          </motion.div>

          <div className="space-y-12 md:space-y-16">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_1fr] items-center bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-12 border border-black/5 shadow-sm"
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
                    <h3 className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#0B0F0E] leading-tight mb-2">{item.title}</h3>
                    <p className="text-[12px] md:text-[13px] font-bold text-[#21c1a2] uppercase tracking-widest mb-3 md:mb-4">클라이언트: {item.clientName}</p>
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
                    케이스 스터디 상세 보기 →
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

      {/* 5. 요금제 */}
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
            
            <div className="grid sm:grid-cols-2 gap-6 pt-8">
              {content.pricing.levels.slice(3).map((level) => (
                <div key={level.title} className="bg-[#FAFAFA] border border-black/5 p-6 rounded-2xl">
                  <h4 className="text-[18px] font-bold text-[#0B0F0E] mb-2">{level.title}</h4>
                  <p className="text-[13px] font-medium text-black/60">{level.target}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center md:text-left">
               <ActionLink href="#contact" className="inline-flex justify-center items-center rounded-full bg-white border border-black/15 px-8 py-4 text-[15px] font-bold text-black shadow-sm hover:bg-black/5 transition-colors">채널 링크 보내고 1차 진단 받기</ActionLink>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 하지 않는 일 */}
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

      {/* 7. 문제 현실 점검 */}
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
              <Image src="/images/reality-illustration-optimized.jpg" alt="채널 진단과 운영 구조" width={1600} height={1030} className="h-auto w-full object-cover" sizes="(max-width: 1024px) 100vw, 90vw" />
            </figure>
            <p className="text-[18px] md:text-[22px] font-bold leading-[1.6] md:leading-[1.75] text-[#21c1a2]">
              {content.problem.emphasis}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 8. 전략 프레임 */}
      <section id="approach" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-y border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-16">
            <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 border-t border-black/10 pt-12">
            {content.strategyFrame.steps.map((step, index) => (
              <div key={step.title} className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <p className="text-[12px] font-bold tracking-widest text-[#21c1a2] mb-3">STEP 0{index + 1}</p>
                <h4 className="text-[20px] font-bold text-[#0B0F0E] mb-4">{step.title}</h4>
                <p className="text-[15px] font-medium leading-[1.8] text-black/60">{step.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 md:mt-16 text-center text-[16px] md:text-[18px] font-bold leading-[1.8] md:leading-[1.9] text-[#21c1a2]">{content.approach.keyline}</p>
        </div>
      </section>

      {/* 9. 제작 품질 & 출연자 운영 */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={shell}>
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#FAFAFA] border border-black/5 p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm">
              <SectionHeader label={content.videoQuality.label} title={content.videoQuality.h2} lead={content.videoQuality.lead} />
              <div className="mt-8 md:mt-10 space-y-4 border-t border-black/5 pt-6 md:pt-8">
                {content.videoQuality.points.map((point) => (
                  <p key={point} className="text-[15px] md:text-[16px] font-bold text-[#0B0F0E] flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{point}</p>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="bg-[#FAFAFA] border border-black/5 p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm">
              <SectionHeader label={content.presenterOps.label} title={content.presenterOps.h2} lead={content.presenterOps.lead} />
              <div className="mt-8 md:mt-10 space-y-4 md:space-y-6 border-t border-black/5 pt-6 md:pt-8">
                <p className="text-[15px] md:text-[17px] font-bold text-[#21c1a2] leading-relaxed">{content.presenterOps.note}</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                   {content.presenterOps.points.slice(0, 3).map(p => <span key={p} className="bg-white border border-black/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[12px] md:text-[13px] font-bold text-black/60">#{p}</span>)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. 업종별 적용 */}
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
                  <p className="text-[16px] md:text-[18px] leading-[1.8] md:leading-[1.9] text-black/70 font-medium">{card.oneLiner}</p>
                  <div className="flex flex-wrap gap-2 pt-1 md:pt-2">
                    {(card.tags ?? []).map(tag => <span key={tag} className="bg-white border border-black/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-[12px] md:text-[13px] font-bold text-black/60">#{tag}</span>)}
                  </div>
                  <ul className="space-y-2.5 md:space-y-3 border-t border-black/10 pt-5 md:pt-6 text-[14px] md:text-[15px] font-medium text-black/70">
                    {card.bullets.map(b => <li key={b} className="flex gap-2.5 md:gap-3 items-start"><span className="mt-1.5 md:mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{b}</li>)}
                  </ul>
                  <div className="pt-3 md:pt-4">
                    <ActionLink href={card.href} className="inline-flex items-center border-b-2 border-black/10 pb-1 text-[15px] md:text-[16px] font-bold text-[#0B0F0E] hover:border-[#21c1a2] transition-colors">
                      {card.ctaLabel} <span className="ml-2">→</span>
                    </ActionLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 팀 소개 (운영 리드) */}
      <section id="team" className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
            <SectionHeader label={content.leadership.label} title={content.leadership.h2} lead={content.leadership.lead} />
          </motion.div>
          
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.article key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} 
                className="group flex flex-col overflow-hidden rounded-2xl md:rounded-3xl bg-[#FAFAFA] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white border-b border-black/5">
                  <Image src={person.image.src} alt={person.image.alt} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6 md:p-8 lg:p-10 flex flex-col flex-1">
                  <div className="mb-5 md:mb-6 border-b border-black/5 pb-5 md:pb-6">
                    <h3 className="text-[24px] md:text-[28px] font-bold text-[#0B0F0E]">
                      {person.name} <span className="text-[12px] md:text-[13px] text-black/30 font-bold ml-1.5 md:ml-2 uppercase tracking-widest">{person.englishName}</span>
                    </h3>
                  </div>
                  <p className="text-[14px] md:text-[15px] font-medium leading-[1.8] md:leading-[1.85] text-black/60 mb-6 md:mb-8 flex-1">{person.body}</p>
                  <ul className="flex flex-wrap gap-2 mt-auto">
                    {person.responsibilities.slice(0, 2).map(r => (
                      <li key={r} className="bg-white border border-black/5 text-black/50 text-[11px] md:text-[12px] font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full">#{r}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 12. 선택 기준 & CTA */}
      <section id="fit" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA] border-t border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 md:mb-20 max-w-3xl mx-auto text-center">
            <SectionHeader label={content.aiRecommendation.label} title={content.aiRecommendation.h2} lead={content.aiRecommendation.lead} />
          </motion.div>

          <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto border-t border-black/10 pt-12 md:pt-16">
            {content.aiRecommendation.items.map((item) => (
              <motion.article key={item.prompt} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl border border-black/5 shadow-sm">
                <p className="text-[11px] md:text-[12px] font-bold tracking-widest text-[#21c1a2] mb-2 md:mb-3 uppercase">자주 들어온 의뢰 유형</p>
                <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0B0F0E] mb-3 md:mb-4">{item.prompt}</h3>
                <p className="text-[16px] md:text-[18px] font-medium leading-[1.8] md:leading-[1.85] text-black/70 mb-6 md:mb-8 border-b border-black/5 pb-6 md:pb-8">{item.fit}</p>
                <ul className="space-y-2.5 md:space-y-3">
                  {item.reasons.map((reason) => (
                    <li key={reason} className="text-[14px] md:text-[15px] font-semibold text-black/60 flex items-center gap-2.5 md:gap-3"><span className="h-1.5 w-1.5 bg-black/20 rounded-full shrink-0"/>{reason}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 md:mt-16 text-center">
             <p className="text-[16px] md:text-[18px] font-bold text-[#0B0F0E] mb-6">{content.aiRecommendation.note}</p>
             <ActionLink href="#contact" className="inline-flex justify-center items-center rounded-full bg-[#0B0F0E] border border-black/15 px-8 py-4 text-[15px] font-bold text-white shadow-sm hover:bg-[#21c1a2] hover:text-black transition-colors">카카오톡으로 채널 링크 보내기</ActionLink>
          </div>
        </div>
      </section>

      {/* 13. 리스크 관리 */}
      <section id="risk" className="py-16 md:py-24 lg:py-32 bg-[#0B0F0E] text-white">
        <div className={`${shell} grid gap-12 md:gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader label={content.riskManagement.label} title={content.riskManagement.h2} lead={content.riskManagement.lead} dark />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-8 md:space-y-10">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {content.riskManagement.items.map((item) => (
                <li key={item} className="py-5 md:py-6 text-[16px] md:text-[18px] font-bold leading-[1.7] md:leading-[1.75] text-white/90">{item}</li>
              ))}
            </ul>
            <p className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-xl md:rounded-2xl text-[15px] md:text-[16px] leading-[1.8] md:leading-[1.85] text-white/60 font-medium">{content.riskManagement.note}</p>
          </motion.div>
        </div>
      </section>

      {/* 14. 계산기 */}
      <section className="bg-white py-16 md:py-24 border-b border-black/5">
        <DiagnosticCalculator />
      </section>

      {/* 15. 연락처 및 폼 */}
      <section id="contact" className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 md:mb-16 max-w-3xl">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />
          </motion.div>

          <div className="grid gap-12 md:gap-16 lg:grid-cols-[0.88fr_1.12fr] items-start">
            <div className="space-y-6 md:space-y-8 border-t border-black/10 pt-6 md:pt-8 bg-white p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl border border-black/5 shadow-sm">
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-[24px] md:text-[28px] font-bold text-[#0B0F0E] mb-3 md:mb-4">먼저 확인하는 것</h3>
                <p className="text-[15px] md:text-[16px] font-medium leading-[1.8] md:leading-[1.9] text-black/60">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {["클릭 전환: 제목·썸네일", "콘텐츠 구조: 주제·재생목록", "문의 동선: 설명란·고정댓글·채널 홈"].map(txt => (
                  <li key={txt} className="text-[15px] md:text-[16px] font-bold text-[#0B0F0E] flex items-center gap-2.5 md:gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{txt}</li>
                ))}
              </ul>
              
              <div className="flex flex-col xl:flex-row gap-3 md:gap-4 pt-5 md:pt-6 border-t border-black/5">
                {hasPhoneHref && (
                  <a href={phoneHref} className={`flex-1 text-center bg-white border border-black/15 py-3.5 md:py-4 rounded-full text-[14px] md:text-[15px] font-bold hover:bg-black/5 transition-colors ${focusRing}`}>
                    {content.contact.quickCallLabel}
                  </a>
                )}
                {hasKakaoChatUrl && (
                  <a href={kakaoChatUrl} className={`flex-1 text-center bg-[#21c1a2] text-[#0B0F0E] py-3.5 md:py-4 rounded-full text-[14px] md:text-[15px] font-bold hover:bg-[#1db197] transition-colors ${focusRing}`}>
                    {content.contact.kakaoCtaLabel}
                  </a>
                )}
              </div>
            </div>
            
            <div id="contact-form" className="rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-black/5 h-[600px] md:h-[760px] shadow-sm">
              {hasFormEmbedUrl ? (
                <iframe src={formEmbedUrl} className="w-full h-full border-0" loading="lazy" title={content.contact.iframeTitle} referrerPolicy="strict-origin-when-cross-origin" />
              ) : (
                <div className="flex h-full items-center justify-center p-8 md:p-10 text-center text-sm font-medium leading-relaxed text-black/40">Google Form 임베드 URL이 아직 설정되지 않았습니다.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 16. FAQ & 블로그 */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className={shell}>
          <div className="grid gap-16 md:gap-24 lg:grid-cols-[1fr_1fr]">
            
            <div id="faq">
              <SectionHeader label={content.faq.label} title={content.faq.h2} />
              <div className="mt-8 md:mt-12 divide-y divide-black/5 border-y border-black/10">
                {content.faq.items.map((item) => (
                  <details key={item.q} className="group py-5 md:py-6">
                    <summary className={`flex cursor-pointer items-center justify-between list-none text-[18px] md:text-[20px] font-bold text-[#0B0F0E] ${focusRing}`}>
                      {item.q}
                      <span className="text-[#21c1a2] group-open:-rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-4 md:mt-6 text-[15px] md:text-[16px] text-black/60 font-medium leading-[1.8] md:leading-[1.9] whitespace-pre-line bg-[#FAFAFA] p-5 md:p-6 rounded-xl md:rounded-2xl border border-black/5">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div id="blog">
              <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />
              {insightPosts.length > 0 && (
                <div className="mt-8 md:mt-12 space-y-4 md:space-y-6">
                  {insightPosts.map((post) => (
                    <Link key={post.slug} href={`/insights/${post.slug}`} className={`block bg-[#FAFAFA] p-6 md:p-8 rounded-xl md:rounded-2xl border border-black/5 hover:border-[#21c1a2] hover:bg-white transition-colors shadow-sm ${focusRing}`}>
                       <p className="text-[12px] md:text-[13px] font-bold tracking-widest text-black/40 mb-2 md:mb-3 uppercase">{post.publishedAt}</p>
                       <h3 className="text-[20px] md:text-[22px] font-bold mb-2 md:mb-3 text-[#0B0F0E]">{post.title}</h3>
                       <p className="text-[14px] md:text-[15px] text-black/50 font-medium leading-[1.8] line-clamp-2">{post.description}</p>
                    </Link>
                  ))}
                  <div className="pt-6 md:pt-8 text-center border-t border-black/5">
                    <ActionLink href="/insights" className="inline-flex items-center text-[15px] md:text-[16px] font-bold text-[#0B0F0E] border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] transition-colors">
                      {content.blog.ctaLabel} →
                    </ActionLink>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 모바일 전용 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-black/10 p-3 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
         <div className="flex gap-2 max-w-[400px] mx-auto">
            {hasKakaoChatUrl && (
              <a href={kakaoChatUrl} className="flex-1 bg-[#21c1a2] text-black text-[13px] font-bold py-3.5 rounded-xl text-center">
                카카오톡 상담
              </a>
            )}
            <a href="#contact" className="flex-1 bg-[#0B0F0E] text-white text-[13px] font-bold py-3.5 rounded-xl text-center">
              무료 진단 신청
            </a>
         </div>
      </div>

      <ContactCTA />

      {/* Footer */}
      <footer className="bg-white py-12 md:py-16 border-t border-black/10 pb-28 md:pb-16">
        <div className={`${shell} flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12`}>
          <div>
            <p className="font-bold text-[16px] md:text-[18px] mb-4 md:mb-6 text-[#0B0F0E]">{content.footer.companyName}</p>
            <div className="space-y-1.5 md:space-y-2 text-[13px] md:text-[14px] text-black/50 font-medium">
              {content.footer.lines.map((line) => (
                <p key={line.label}>{line.label}: {line.value}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 text-[13px] md:text-[14px] font-bold text-black/40">
            <Link href="/store" className={`hover:text-[#21c1a2] transition-colors ${focusRing}`}>운영 플랜 신청</Link>
            <Link href="/terms" className={`hover:text-[#21c1a2] transition-colors ${focusRing}`}>이용약관</Link>
            <Link href="/privacy" className={`hover:text-[#21c1a2] transition-colors ${focusRing}`}>개인정보처리방침</Link>
            <Link href="/refund" className={`hover:text-[#21c1a2] transition-colors ${focusRing}`}>환불 정책</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
