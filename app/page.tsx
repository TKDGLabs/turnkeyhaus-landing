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

// --- 스타일 유틸리티 ---
const shell = "mx-auto w-full max-w-[1320px] px-6 lg:px-12";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

// 에러 해결 포인트: transition의 ease 값 뒤에 'as const'를 붙여 타입을 고정했습니다.
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { 
    duration: 0.8, 
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
  }
};

// --- 공통 컴포넌트 ---
function ActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const isExternal = href.startsWith("http");
  const mergedClass = `${className} ${focusRing}`;
  if (isExternal) return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

const formatInteger = (n: number) => new Intl.NumberFormat("ko-KR").format(Math.round(n));

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const totalSubscribers = content.portfolio.items.reduce((sum, item) => sum + item.subscriberCurrent, 0);

  return (
    <main className="bg-white text-[#0B0F0E] selection:bg-[#21c1a2]/30">
      
      {/* 1. Header (Glassmorphism) */}
      <header className="sticky top-0 z-50 border-b border-black/[0.03] bg-white/70 backdrop-blur-xl">
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className="transition-opacity hover:opacity-70">
            <Image src="/logo.png" alt="Turnkeyhaus" width={140} height={40} className="h-9 w-auto object-contain" priority />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-bold text-black/50 transition-colors hover:text-black">
                {item.label}
              </Link>
            ))}
          </nav>
          <ActionLink href="#contact" className="rounded-full bg-[#0B0F0E] px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
            상담 예약하기
          </ActionLink>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="top" className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-40">
        <div className={shell}>
          <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <motion.div {...fadeUp}>
              <span className="mb-6 inline-block rounded-full bg-[#f0f2f1] px-4 py-1.5 text-[11px] font-black tracking-widest text-black/40">
                TURNKEYHAUS BY TKDG
              </span>
              <h1 className="text-[44px] font-bold leading-[1.1] tracking-tighter sm:text-[64px] lg:text-[84px]">
                {content.heroValue.headline.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="mt-8 max-w-[32ch] text-lg leading-relaxed text-black/50 lg:text-2xl">
                {content.heroValue.body}
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <ActionLink href="#pilot" className="rounded-full bg-[#21c1a2] px-8 py-4 text-base font-black text-black transition-all hover:shadow-xl hover:shadow-[#21c1a2]/20">
                  {content.heroValue.primaryCta.label}
                </ActionLink>
                <ActionLink href="#contact" className="rounded-full border border-black/10 bg-white px-8 py-4 text-base font-black transition-all hover:bg-black/5">
                  {content.heroValue.secondaryCta.label}
                </ActionLink>
              </div>
            </motion.div>

            {/* Hero Video (Floating Card 스타일) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="relative aspect-square overflow-hidden rounded-[40px] bg-black shadow-2xl lg:aspect-[4/5]"
            >
              <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>

          {/* Stats Bar (Simple & Clean) */}
          <div className="mt-24 grid grid-cols-2 gap-8 border-t border-black/[0.05] pt-12 lg:grid-cols-3">
            {[
              { label: "대표 사례", value: `${content.portfolio.items.length}개 채널` },
              { label: "현재 구독자 합산", value: `${formatInteger(totalSubscribers)}명` },
              { label: "전체 누적 조회수", value: `약 2,020만+` }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs font-bold tracking-widest text-black/30">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tighter lg:text-4xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problem Section (Modern Typography) */}
      <section id="problem" className="bg-[#0B0F0E] py-24 text-white lg:py-40">
        <div className={shell}>
          <div className="mx-auto max-w-4xl text-center">
            <motion.div {...fadeUp}>
              <span className="text-[#21c1a2] font-black tracking-widest text-xs">{content.problem.label}</span>
              <h2 className="mt-8 text-[36px] font-bold leading-[1.2] tracking-tighter sm:text-[56px] lg:text-[72px]">
                {content.problem.h2}
              </h2>
              <p className="mt-12 text-xl leading-relaxed text-white/50 lg:text-2xl">
                {content.problem.lead}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Services Section (Bento Grid) */}
      <section id="services" className="bg-[#f8f9fa] py-24 lg:py-40">
        <div className={shell}>
          <motion.div {...fadeUp} className="mb-20">
            <h2 className="text-[40px] font-bold tracking-tighter lg:text-[60px]">{content.servicePillars.h2}</h2>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.servicePillars.cards.map((card, idx) => (
              <motion.div 
                key={card.title} 
                {...fadeUp} 
                transition={{ ...fadeUp.transition, delay: idx * 0.1 }}
                className={`group rounded-[32px] bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 ${idx === 0 ? 'md:col-span-2' : ''}`}
              >
                <p className="text-xs font-black text-[#21c1a2]">SERVICE 0{idx + 1}</p>
                <h3 className="mt-4 text-3xl font-bold tracking-tight">{card.headline}</h3>
                <p className="mt-6 text-black/50 leading-relaxed">{card.body}</p>
                <ul className="mt-8 space-y-3">
                  {card.bullets.map(b => <li key={b} className="text-sm font-bold text-black/70">· {b}</li>)}
                </ul>
                <Link href={card.href} className="mt-10 inline-block font-black text-[#21c1a2] underline-offset-4 hover:underline">
                  {card.ctaLabel} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Section (Modern Leaderboard) */}
      <section id="team" className="py-24 lg:py-40">
        <div className={shell}>
          <motion.div {...fadeUp} className="mb-20 text-center">
            <h2 className="text-[40px] font-bold tracking-tighter lg:text-[60px]">{content.leadership.h2}</h2>
          </motion.div>
          
          <div className="grid gap-12 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.div 
                key={person.name} 
                {...fadeUp} 
                transition={{ ...fadeUp.transition, delay: idx * 0.1 }} 
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[40px] bg-[#f8f9fa]">
                  <Image src={person.image.src} alt={person.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold">{person.name}</h3>
                  <p className="text-sm font-bold text-[#21c1a2] tracking-widest mt-1">{person.role}</p>
                  <p className="mt-4 text-black/50 leading-relaxed text-sm">{person.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Strategic Calculator (Floating UI) */}
      <section className="bg-[#0B0F0E] py-12">
        <div className={`${shell} rounded-[48px] bg-[#21c1a2] py-20 px-8 lg:px-20`}>
          <DiagnosticCalculator />
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="py-24 lg:py-40">
        <div className={shell}>
          <div className="rounded-[60px] bg-[#f8f9fa] p-8 lg:p-20">
            <div className="grid gap-20 lg:grid-cols-2">
              <div>
                <h2 className="text-[40px] font-bold tracking-tighter lg:text-[60px]">{content.contact.h2}</h2>
                <p className="mt-8 text-xl text-black/50">{content.contact.lead}</p>
                <div className="mt-12 space-y-6">
                  <ActionLink href={content.contact.phoneHref} className="block text-2xl font-bold hover:text-[#21c1a2]">
                    {content.contact.phoneDisplay}
                  </ActionLink>
                  <ActionLink href={content.contact.kakaoChatUrl} className="block text-2xl font-bold hover:text-[#21c1a2]">
                    카카오톡 실시간 상담하기
                  </ActionLink>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                <iframe src={content.contact.googleFormEmbedUrl} className="h-[600px] w-full border-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-black/[0.05]">
        <div className={`${shell} flex flex-col items-center justify-between gap-8 lg:flex-row`}>
          <div className="text-center lg:text-left">
            <p className="font-black text-lg">{content.brand.name}</p>
            {/* 안전을 위해 lines가 있을 때만 접근하도록 수정 */}
            {content.footer.lines && content.footer.lines[3] && (
              <p className="mt-2 text-xs text-black/30">{content.footer.lines[3].value}</p>
            )}
          </div>
          <div className="flex gap-8 text-xs font-bold text-black/40">
            <Link href="/terms" className="hover:text-black">이용약관</Link>
            <Link href="/privacy" className="hover:text-black">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-black">환불정책</Link>
          </div>
        </div>
      </footer>

      <ContactCTA />
    </main>
  );
}
