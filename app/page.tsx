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

// --- 스타일 유틸리티 ---
const shell = "mx-auto w-full max-w-[1320px] px-6 lg:px-10";
const labelClass = "inline-flex items-center border border-black/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-black/55 uppercase";
const sectionTitle = "whitespace-pre-line break-keep text-[32px] font-bold leading-[1.22] tracking-tight text-[#0B0F0E] md:text-[48px]";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

// 🚨 에러 차단: 가장 안전한 기본 트랜지션
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8 } 
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

function SectionHeader({ label, title, lead, dark = false }: { label: string; title: string; lead?: string; dark?: boolean; }) {
  return (
    <div className="space-y-6">
      <span className={dark ? "inline-flex items-center border border-white/25 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase" : labelClass}>
        {label}
      </span>
      <h2 className={dark ? `${sectionTitle} text-white` : sectionTitle}>{title}</h2>
      {lead ? (
        <p className={dark ? "max-w-[62ch] whitespace-pre-line break-keep text-[18px] leading-[1.9] text-white/78 md:text-[20px] font-medium" : "max-w-[62ch] whitespace-pre-line break-keep text-[18px] leading-[1.9] text-black/70 md:text-[20px] font-medium"}>
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
      if (window.scrollY > 100) {
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
    <main className="bg-white text-[#0B0F0E] antialiased">
      
      {/* 스마트 헤더 (스크롤 내리면 등장) */}
      <header className={`fixed top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-xl transition-all duration-300 ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/logo.png" alt="Turnkeyhaus" width={140} height={38} className="h-8 w-auto object-contain" priority />
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className={`text-[14px] font-bold text-black/60 hover:text-[#21c1a2] transition-colors ${focusRing}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <ActionLink href="#contact" className="inline-flex h-10 items-center rounded-full bg-[#0B0F0E] px-6 text-[14px] font-bold text-white hover:bg-[#21c1a2] hover:text-black">
            상담 예약하기
          </ActionLink>
        </div>
      </header>

      {/* 1. HERO: 압도적 100% 뷰포트 & 전환형 카피 적용 */}
      <section id="top" className="relative flex h-[100svh] min-h-[800px] w-full flex-col justify-end overflow-hidden bg-black pb-16 md:pb-24">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-60">
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0E] via-black/40 to-transparent" />

        <div className={`${shell} relative z-10 w-full`}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[1000px] text-white">
            <Image src="/images/turnkeyhaus-logo-white.png" alt="Turnkeyhaus" width={200} height={50} className="mb-12 h-8 w-auto opacity-80" />
            
            <h1 className="whitespace-pre-line break-keep text-[42px] font-bold leading-[1.15] tracking-tight md:text-[64px] lg:text-[72px]">
              전문직·고관여 브랜드의{"\n"}유튜브 운영을 월 단위로 맡습니다.
            </h1>
            <p className="mt-8 max-w-[60ch] whitespace-pre-line break-keep text-[18px] leading-[1.8] text-white/80 md:text-[22px] font-medium">
              채널 기획, 대본, 촬영, 편집, 썸네일, 업로드, SEO, 월간 리포트까지 한 팀으로 운영하고, 대표·원장·전문가는 촬영과 최종 확인에만 집중할 수 있게 만듭니다.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <div className="flex flex-wrap gap-4">
                <ActionLink href="#contact" className="inline-flex items-center rounded-full bg-[#21c1a2] px-8 py-4 text-[16px] font-bold text-black transition-transform hover:scale-105 shadow-[0_0_40px_rgba(33,193,162,0.3)]">
                  무료 24시간 3포인트 진단 받기
                </ActionLink>
                <ActionLink href="#portfolio" className="inline-flex items-center rounded-full border border-white/30 bg-black/40 backdrop-blur-md px-8 py-4 text-[16px] font-bold text-white transition-colors hover:bg-white/20">
                  운영 사례 보기
                </ActionLink>
              </div>
              <p className="text-[15px] font-medium text-white/60">
                채널 링크를 보내주시면 제목·썸네일, 주제 구조, 문의 CTA 중 먼저 손볼 3가지를 확인해드립니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. 구매 정보 요약 박스 (의사결정자를 위한 즉각적인 정보 제공) */}
      <section className="bg-[#0B0F0E] py-12 border-b border-white/10">
        <div className={shell}>
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12">
            <div>
              <span className="text-[#21c1a2] font-bold text-[12px] tracking-widest uppercase mb-2 block">월간 운영 산출물 예시</span>
              <ul className="space-y-3 text-white/90 text-[16px] font-medium mt-6">
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/> 월 1회 촬영 / 롱폼 2~4편 / 쇼츠 4~8편</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/> 썸네일·업로드·SEO·월간 리포트 포함</li>
                <li className="flex items-center gap-3 text-white/50 mt-4 text-[14px]"><span className="h-1.5 w-1.5 bg-white/30 rounded-full"/> 대표·원장님은 촬영 전 확인과 당일 출연에 집중하면 됩니다.</li>
              </ul>
            </div>
            <div className="md:border-l md:border-white/10 md:pl-12 pt-8 md:pt-0 border-t border-white/10 md:border-t-0">
              <span className="text-white/40 font-bold text-[12px] tracking-widest uppercase mb-2 block">투자 범위 기준</span>
              <ul className="space-y-4 text-white/80 text-[16px] font-medium mt-6">
                <li className="flex items-center justify-between border-b border-white/5 pb-3"><span>초기 채널 진단</span> <span className="font-bold text-white">49만원</span></li>
                <li className="flex items-center justify-between border-b border-white/5 pb-3"><span>3개월 검증 운영</span> <span className="font-bold text-white">월 300만원대~</span></li>
                <li className="flex items-center justify-between text-white/40 text-[13px] pt-1"><span>* 정규 월 운영은 상담 후 범위 산정</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 대표 숫자 3개 */}
      <section className="bg-white py-16 border-b border-black/5">
        <div className={shell}>
          <dl className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-2 border-l-2 border-[#21c1a2] pl-6">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">대표 사례</dt>
              <dd className="text-[36px] font-bold tracking-tight">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="space-y-2 border-l-2 border-black/10 pl-6">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">현재 구독자 합산</dt>
              <dd className="text-[36px] font-bold tracking-tight">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="space-y-2 border-l-2 border-black/10 pl-6">
              <dt className="text-[12px] font-bold uppercase tracking-[0.15em] text-black/40">전체 영상 누적 조회수</dt>
              <dd className="text-[36px] font-bold tracking-tight">약 {totalVideoViewsInMan}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 4. 포트폴리오 (최상단으로 끌어올림 - 증거 제시) */}
      <section id="portfolio" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20">
            <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          </motion.div>

          <div className="space-y-16">
            {content.portfolio.items.slice(0, 3).map((item, i) => (
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
                    <h3 className="text-[32px] font-bold tracking-tight text-[#0B0F0E] leading-tight mb-2">{item.title}</h3>
                    <p className="text-[13px] font-bold text-[#21c1a2] uppercase tracking-widest mb-4">클라이언트: {item.clientName}</p>
                    <p className="text-[17px] leading-[1.8] text-black/70 font-medium">{item.oneLiner}</p>
                  </div>

                  <dl className="divide-y divide-black/5 border-y border-black/10 bg-[#FAFAFA] rounded-2xl p-6">
                    {item.scope && (
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-3 text-[15px] items-center">
                        <dt className="font-bold text-black/40">담당 범위</dt>
                        <dd className="font-bold text-[#0B0F0E]">{item.scope}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-[100px_1fr] gap-4 py-3 text-[15px] items-center">
                      <dt className="font-bold text-black/40">구독자 변화</dt>
                      <dd className="font-bold text-[#0B0F0E]">{item.result}</dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-4 py-3 text-[15px] items-center">
                      <dt className="font-bold text-black/40">최고 조회수</dt>
                      <dd className="font-bold text-[#21c1a2]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>

                  {(item.before || item.action || item.after || item.proof) && (
                    <div className="grid gap-6 border-t border-black/5 pt-6 text-[14px] font-medium leading-[1.75] text-black/70 sm:grid-cols-2">
                      {item.before && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">BEFORE</p><p>{item.before}</p></div>)}
                      {item.action && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">ACTION</p><p>{item.action}</p></div>)}
                      {item.after && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">AFTER</p><p>{item.after}</p></div>)}
                      {item.proof && (<div><p className="text-[11px] font-bold tracking-widest text-[#21c1a2] mb-1">PROOF</p><p>{item.proof}</p></div>)}
                    </div>
                  )}

                  <ActionLink href={`/cases/${item.caseSlug}`} className="inline-block mt-4 text-[15px] font-bold border-b-2 border-black/10 pb-1 hover:border-[#21c1a2] hover:text-[#21c1a2]">
                    케이스 스터디 전문 보기 →
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 운영 플랜 (가격 및 범위 - 포트폴리오 직후 배치) */}
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
                  <p className="text-[12px] font-bold tracking-widest text-black/40 mb-2 uppercase">OPTION 0{index + 1}</p>
                  <p className="text-[28px] font-bold tracking-tight text-[#0B0F0E]">{level.priceBand}</p>
                </div>
                <div>
                  <h3 className="text-[26px] font-bold tracking-tight text-[#0B0F0E] mb-6">{level.title}</h3>
                  <ul className="grid gap-4 text-[15px] font-medium leading-[1.75] text-black/70 sm:grid-cols-2">
                    {level.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 items-start"><span className="mt-2 h-1 w-1 rounded-full bg-black/30 shrink-0"/>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-8 bg-[#FAFAFA] p-5 rounded-2xl text-[14px] font-bold text-black/60 border border-black/5">{level.target}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 하지 않는 일 (신뢰 확보) */}
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

      {/* 7. 운영 프로세스 (문제 제기 -> 전략 -> 제작 품질 -> 출연자 운영) */}
      <section className="bg-white py-24 lg:py-40">
        <div className={shell}>
          {/* 문제 제기 */}
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 mb-32">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
              <span className={labelClass}>{content.problem.label}</span>
              <h2 className={`${sectionTitle}`}>{content.problem.h2}</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-10">
              <p className="whitespace-pre-line break-keep text-[20px] leading-[1.9] text-black/80 font-medium">{problemSupport}</p>
              <p className="whitespace-pre-line break-keep text-[18px] leading-[1.95] text-black/60 font-medium">{problemDetail}</p>
              <p className="text-[20px] font-bold leading-[1.75] text-[#21c1a2] bg-[#FAFAFA] p-6 rounded-xl">{content.problem.emphasis}</p>
            </motion.div>
          </div>

          {/* 전략 프레임 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-32 bg-[#FAFAFA] p-10 lg:p-16 rounded-3xl border border-black/5">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
            </div>
            <StrategyChapterDeck />
            <p className="mt-12 text-center text-[18px] font-bold leading-[1.9] text-[#21c1a2]">{content.approach.keyline}</p>
          </motion.div>

          {/* 제작 품질 & 출연자 운영 */}
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white border border-black/10 p-10 rounded-3xl shadow-sm">
              <SectionHeader label={content.videoQuality.label} title={content.videoQuality.h2} lead="턴키하우스는 운영형 콘텐츠라도 영상 퀄리티를 포기하지 않습니다." />
              <div className="mt-10 space-y-4 border-t border-black/5 pt-8">
                {content.videoQuality.points.map((point) => (
                  <p key={point} className="text-[16px] font-bold text-[#0B0F0E] flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{point}</p>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white border border-black/10 p-10 rounded-3xl shadow-sm">
              <SectionHeader label={content.presenterOps.label} title={content.presenterOps.h2} lead="전문직 유튜브의 병목은 출연자입니다. 본업이 바쁘고 리스크도 큽니다." />
              <div className="mt-10 space-y-4 border-t border-black/5 pt-8">
                {content.presenterOps.points.map((point) => (
                  <p key={point} className="text-[16px] font-bold text-[#0B0F0E] flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{point}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. 업종별 적용 */}
      <section id="professional" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-24 max-w-3xl">
            <SectionHeader label={content.professionalTargets.label} title={content.professionalTargets.h2} lead={content.professionalTargets.lead} />
          </motion.div>

          <div className="space-y-16">
            {content.professionalTargets.cards.map((card, index) => (
              <motion.article key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid items-center gap-12 lg:grid-cols-2 bg-white p-8 lg:p-12 rounded-3xl border border-black/5 shadow-sm">
                <figure className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black border border-black/5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {card.image ? (
                    <Image src={card.image.src} alt={card.image.alt} fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 50vw" />
                  ) : (
                    <div className="flex h-full flex-col justify-end p-10 bg-[#FAFAFA]">
                      <p className="text-[12px] font-bold text-black/40 mb-4">{card.imageFallback?.eyebrow}</p>
                      {card.imageFallback?.lines.map(line => <p key={line} className="text-2xl font-bold text-[#0B0F0E]">{line}</p>)}
                    </div>
                  )}
                </figure>
                <div className="space-y-6">
                  <h3 className="text-[32px] font-bold tracking-tight text-[#0B0F0E]">{card.title}</h3>
                  <p className="text-[18px] leading-[1.9] text-black/70 font-medium">{card.oneLiner}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(card.tags ?? []).map(tag => <span key={tag} className="bg-black/5 px-3 py-1.5 rounded-md text-[13px] font-bold text-black/60">#{tag}</span>)}
                  </div>
                  <ul className="space-y-3 border-t border-black/5 pt-8 text-[15px] font-medium text-black/70">
                    {card.bullets.map(b => <li key={b} className="flex gap-3 items-start"><span className="mt-2 h-1.5 w-1.5 bg-[#21c1a2] rounded-full shrink-0"/>{b}</li>)}
                  </ul>
                  <div className="pt-4">
                    <ActionLink href={card.href} className="inline-flex items-center border-b-2 border-black/10 pb-1 text-[16px] font-bold text-[#0B0F0E] hover:border-[#21c1a2] transition-colors">
                      {card.ctaLabel} <span className="ml-2">→</span>
                    </ActionLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 팀 소개 */}
      <section id="team" className="py-24 lg:py-40 bg-white border-t border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 text-center max-w-3xl mx-auto">
            <SectionHeader label={content.leadership.label} title={content.leadership.h2} lead={content.leadership.lead} />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.article key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} className="group flex flex-col overflow-hidden rounded-3xl bg-[#FAFAFA] border border-black/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <Image src={person.image.src} alt={person.image.alt} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-8 lg:p-10 flex flex-col flex-1 bg-white">
                  <div className="mb-6 border-b border-black/5 pb-6">
                    <h3 className="text-[28px] font-bold text-[#0B0F0E]">
                      {person.name} <span className="text-[14px] text-black/30 font-bold ml-2 uppercase tracking-widest">{person.englishName}</span>
                    </h3>
                    <p className="text-[#21c1a2] text-[13px] font-bold uppercase tracking-widest mt-2">{person.role}</p>
                  </div>
                  <p className="text-[15px] font-medium leading-[1.85] text-black/70 mb-8 flex-1">{person.body}</p>
                  <ul className="flex flex-wrap gap-2 mt-auto">
                    {person.responsibilities.map(r => (
                      <li key={r} className="bg-[#FAFAFA] border border-black/5 text-black/60 text-[12px] font-bold px-3 py-1.5 rounded-full">#{r}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-24 lg:py-40 bg-[#FAFAFA]">
        <div className={shell}>
          <div className="max-w-3xl mx-auto">
            <SectionHeader label={content.faq.label} title={content.faq.h2} />
            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {content.faq.items.map((item) => (
                <details key={item.q} className="group py-6">
                  <summary className={`flex cursor-pointer items-center justify-between list-none text-[20px] font-bold text-[#0B0F0E] ${focusRing}`}>
                    {item.q}
                    <span className="text-[#21c1a2] group-open:-rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-6 text-[16px] text-black/70 font-medium leading-[1.9] whitespace-pre-line bg-white p-6 rounded-2xl border border-black/5 shadow-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. 인사이트 (Blog) */}
      <section id="blog" className="py-24 lg:py-40 bg-white border-t border-black/5">
        <div className={shell}>
          <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />
          
          {insightPosts.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {insightPosts.map((post) => (
                <Link key={post.slug} href={`/insights/${post.slug}`} className={`block bg-[#FAFAFA] p-8 lg:p-10 rounded-3xl border border-black/5 hover:bg-white hover:border-[#21c1a2] hover:shadow-xl transition-all ${focusRing}`}>
                    <p className="text-[13px] font-bold tracking-widest text-[#21c1a2] mb-4 uppercase">{post.publishedAt}</p>
                    <h3 className="text-[24px] font-bold mb-4 text-[#0B0F0E] leading-[1.4]">{post.title}</h3>
                    <p className="text-[16px] text-black/60 font-medium leading-[1.8] line-clamp-2">{post.description}</p>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <ActionLink href="/insights" className="inline-flex items-center rounded-full border border-black/10 bg-white px-10 py-5 text-[16px] font-bold text-black transition-colors hover:bg-black/5 shadow-sm">
              {content.blog.ctaLabel}
            </ActionLink>
          </div>
        </div>
      </section>

      {/* 12. Contact (최하단 고정형 리드) */}
      <section id="contact" className="py-24 lg:py-40 bg-[#0B0F0E] text-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 max-w-3xl">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} dark />
          </motion.div>

          <div className="grid gap-16 lg:grid-cols-[0.88fr_1.12fr] items-start">
            <div className="space-y-8 pt-8">
              <div className="space-y-3">
                <h3 className="text-[28px] font-bold text-white mb-4">먼저 확인하는 것</h3>
                <p className="text-[16px] font-medium leading-[1.9] text-white/60">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              </div>
              <ul className="space-y-4">
                {["클릭 전환: 제목·썸네일", "콘텐츠 구조: 주제·재생목록", "문의 동선: 설명란·고정댓글·채널 홈"].map(txt => (
                  <li key={txt} className="text-[16px] font-bold text-white flex items-center gap-3"><span className="h-1.5 w-1.5 bg-[#21c1a2] rounded-full"/>{txt}</li>
                ))}
              </ul>
              <div className="flex flex-col xl:flex-row gap-4 pt-8 border-t border-white/10">
                {hasPhoneHref && (
                  <a href={phoneHref} className={`flex-1 text-center bg-white/10 backdrop-blur-md border border-white/20 py-4 rounded-full text-[15px] font-bold text-white hover:bg-white/20 transition-colors ${focusRing}`}>{content.contact.quickCallLabel} {content.contact.phoneDisplay}</a>
                )}
                {hasKakaoChatUrl && (
                  <a href={kakaoChatUrl} className={`flex-1 text-center bg-[#21c1a2] text-[#0B0F0E] py-4 rounded-full text-[15px] font-bold hover:bg-[#1db197] transition-colors ${focusRing}`}>{content.contact.kakaoCtaLabel}</a>
                )}
              </div>
            </div>
            
            <div id="contact-form" className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 h-[760px] shadow-2xl">
              {hasFormEmbedUrl ? (
                <iframe src={formEmbedUrl} className="w-full h-full border-0 invert opacity-90" loading="lazy" title={content.contact.iframeTitle} referrerPolicy="strict-origin-when-cross-origin" />
              ) : (
                <div className="flex h-full items-center justify-center p-10 text-center text-sm font-medium leading-relaxed text-white/40">Google Form 임베드 URL이 설정되지 않았습니다.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />

      {/* Footer */}
      <footer className="bg-[#0B0F0E] py-16 border-t border-white/10">
        <div className={`${shell} flex flex-col md:flex-row justify-between items-start gap-12`}>
          <div>
            <p className="font-bold text-[18px] mb-6 text-white">{content.footer.companyName}</p>
            <div className="space-y-2 text-[14px] text-white/60 font-medium">
              {content.footer.lines.map((line) => (
                <p key={line.label}>{line.label}: {line.value}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-[14px] font-bold text-white/50">
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
