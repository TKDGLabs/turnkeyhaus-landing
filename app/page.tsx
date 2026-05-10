"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
import { getSortedInsights } from "../content/insights";

// --- 디자인 시스템 유틸리티 ---
const shell = "mx-auto w-full max-w-[1400px] px-6 lg:px-10";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#21c1a2]";

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } 
  }
};

// 🚨 Vercel 빌드 에러 해결: 실수로 지웠던 조회수 변환 함수 완벽 복구!
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
  const mergedClass = `${className} ${focusRing} transition-all duration-500`;
  if (isExternal) return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const totalSubscribers = content.portfolio.items.reduce((sum, item) => sum + item.subscriberCurrent, 0);

  // ✨ 스크롤 기반 배경색 변환 효과 (Scroll-driven Background Color Morphing)
  const { scrollYProgress } = useScroll();
  const pageBgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#ffffff", "#f8f9fa", "#ffffff", "#f2fcf9", "#ffffff"]
  );

  return (
    <main className="text-[#0B0F0E] antialiased selection:bg-[#21c1a2]/30 relative">
      
      {/* 고정된 전체 반응형 배경 레이어 */}
      <motion.div 
        className="fixed inset-0 -z-50 pointer-events-none"
        style={{ backgroundColor: pageBgColor }}
      />
      
      {/* 1. Ultra-Minimal Header */}
      <header className="fixed top-0 z-50 w-full bg-white/40 backdrop-blur-xl border-b border-black/[0.03]">
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className="group">
            <Image src="/logo.png" alt="Turnkeyhaus" width={130} height={36} className="h-7 w-auto transition-opacity group-hover:opacity-60" priority />
          </Link>
          <nav className="hidden items-center gap-12 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[12px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <ActionLink href="#contact" className="text-[12px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#21c1a2] hover:border-[#21c1a2]">
            Contact
          </ActionLink>
        </div>
      </header>

      {/* 2. Cinematic Image-First Hero (모니터에 꽉 차는 16:9 스케일 복구) */}
      <section id="top" className="relative h-screen min-h-[800px] w-full bg-black overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-80">
          <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className={`${shell} relative h-full flex flex-col justify-end pb-24`}>
          <motion.div initial="hidden" animate="visible" variants={reveal} className="max-w-5xl">
            <h1 className="text-[56px] font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-[80px] lg:text-[110px] xl:text-[130px]">
              {content.heroValue.headline.split('\n')[0]} <br />
              <span className="text-white/40 italic font-light">{content.heroValue.headline.split('\n')[1]}</span>
            </h1>
            <div className="mt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <p className="max-w-[420px] text-lg leading-relaxed text-white/70 lg:text-xl font-medium">
                {content.heroValue.body}
              </p>
              <div className="flex gap-4 items-center">
                <ActionLink href="#pilot" className="rounded-full bg-[#21c1a2] px-10 py-5 text-[15px] font-black text-[#0B0F0E] hover:scale-105 active:scale-95">
                  {content.heroValue.primaryCta.label}
                </ActionLink>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Stats Overlay (투명 배경으로 설정하여 모션 배경이 비치도록) */}
      <div className="py-12 lg:py-20 border-b border-black/5">
        <div className={shell}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            {[
              { label: "Channel Portfolio", value: `${content.portfolio.items.length}` },
              { label: "Total Subscribers", value: `${formatInteger(totalSubscribers / 10000)}만+` },
              { label: "Accumulated Views", value: "2,020만+" },
              { label: "Active Since", value: "2016" }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-2">{stat.label}</p>
                <p className="text-3xl lg:text-5xl font-bold tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Editorial Logic: Problem & Reality */}
      <section id="problem" className="py-32 lg:py-52">
        <div className={shell}>
          <div className="grid gap-20 lg:grid-cols-[0.7fr_1.3fr] items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
              <span className="text-[11px] font-black tracking-[0.4em] text-black/20 uppercase block mb-8">{content.problem.label}</span>
              <h2 className="text-[42px] font-bold leading-tight tracking-tighter lg:text-[72px] whitespace-pre-line">
                {content.problem.h2}
              </h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: 0.2 }}>
              <p className="text-2xl lg:text-4xl font-light leading-snug tracking-tight text-black/80 whitespace-pre-line">
                {content.problem.lead}
              </p>
              <div className="mt-16 flex flex-wrap gap-12">
                 {content.problem.items.map(item => (
                   <div key={item} className="max-w-[300px]">
                     <p className="text-[15px] font-bold leading-relaxed text-black/40 italic">"{item}"</p>
                   </div>
                 ))}
              </div>
              <p className="mt-20 text-[22px] font-bold text-[#21c1a2] lg:text-[28px] tracking-tight">{content.problem.emphasis}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Team: Real Roles & Pure Visuals (Lead 타이틀 삭제 및 실제 업무 표시) */}
      <section id="team" className="py-32 lg:py-52 border-t border-black/5">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div>
              <span className="text-[11px] font-black tracking-[0.4em] text-black/20 uppercase block mb-8">{content.leadership.label}</span>
              <h2 className="text-[48px] font-bold tracking-tighter lg:text-[84px] leading-none">{content.leadership.h2}</h2>
            </div>
            <p className="max-w-[400px] text-lg font-medium text-black/40">{content.leadership.lead}</p>
          </motion.div>
          
          <div className="grid gap-12 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.div key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: idx * 0.2 }} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/5 grayscale transition-all duration-700 group-hover:grayscale-0">
                  <Image src={person.image.src} alt={person.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-bold tracking-tight mb-3">{person.name}</h3>
                  {/* Lead 등의 직함을 지우고, 실제로 맡고 있는 핵심 실무 역할을 표시합니다. */}
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] font-black text-[#21c1a2] tracking-widest">
                    {person.responsibilities.slice(0, 3).map(r => <span key={r}>#{r}</span>)}
                  </div>
                  <p className="mt-8 text-black/50 leading-relaxed font-medium text-lg lg:pr-10">{person.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Contrast Service Bento (Dark Box) */}
      <section id="services" className="bg-[#0B0F0E] py-32 lg:py-52 text-white overflow-hidden rounded-[80px] mx-4 mb-4">
        <div className={shell}>
          <div className="grid gap-24 lg:grid-cols-12 items-end mb-32">
            <div className="lg:col-span-8">
              <h2 className="text-[52px] font-bold tracking-tighter lg:text-[92px] leading-none">{content.servicePillars.h2}</h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-white/40 text-xl font-medium leading-relaxed italic border-l-2 border-[#21c1a2] pl-8">{content.servicePillars.lead}</p>
            </div>
          </div>
          
          <div className="grid gap-4 lg:grid-cols-12">
            {content.servicePillars.cards.map((card, idx) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: idx * 0.1 }}
                className={`group relative rounded-[40px] bg-white/[0.03] p-10 lg:p-16 border border-white/5 transition-all hover:bg-white/10 ${idx === 0 ? 'lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-20' : 'lg:col-span-6'}`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <span className="text-[#21c1a2] font-black text-xs tracking-[0.3em] uppercase block mb-10">Process 0{idx + 1}</span>
                    <h3 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8 leading-tight">{card.headline}</h3>
                    <p className="text-white/40 text-lg lg:text-xl font-medium leading-relaxed">{card.body}</p>
                  </div>
                  <div className="mt-12 space-y-4">
                    {card.bullets.map(b => <div key={b} className="text-[15px] font-bold text-white/70 flex items-center gap-4"><span className="h-1 w-1 bg-[#21c1a2] rounded-full" /> {b}</div>)}
                  </div>
                </div>
                {idx === 0 && (
                   <div className="hidden lg:flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-1000 relative z-0">
                      <Image src="/logo.png" alt="Decoration" width={400} height={100} className="invert brightness-0" />
                   </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Strategic Calculator Section */}
      <section className="py-32">
        <div className={shell}>
          <div className="rounded-[80px] bg-[#21c1a2] p-12 lg:p-24 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <DiagnosticCalculator />
            </div>
            <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-black/5 select-none pointer-events-none tracking-tighter">TKDG</div>
          </div>
        </div>
      </section>

      {/* 8. Portfolio Section */}
      <section id="portfolio" className="py-32 lg:py-52 border-t border-black/5">
        <div className={shell}>
          <div className="mb-32">
            <h2 className="text-[48px] font-bold tracking-tighter lg:text-[84px] leading-none mb-12">{content.portfolio.h2}</h2>
            <p className="text-2xl text-black/40 font-medium max-w-2xl italic leading-relaxed">{content.portfolio.lead}</p>
          </div>
          
          <div className="space-y-40">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}
                className={`grid gap-16 lg:grid-cols-2 items-center`}
              >
                <div className={`relative aspect-video overflow-hidden rounded-[40px] bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?modestbranding=1&rel=0`} className="h-full w-full border-0" />
                  ) : (
                    <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <div className="space-y-10">
                  <span className="text-[13px] font-black text-[#21c1a2] tracking-[0.4em] uppercase">{item.clientName}</span>
                  <h3 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-[1.1]">{item.title}</h3>
                  <p className="text-xl lg:text-2xl text-black/50 font-medium leading-relaxed">{item.oneLiner}</p>
                  <div className="grid grid-cols-2 gap-12 border-y border-black/[0.05] py-12">
                    <div>
                      <p className="text-[11px] font-black text-black/20 uppercase tracking-widest mb-3">Growth Signal</p>
                      <p className="text-3xl font-bold tracking-tight">{item.result}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-black/20 uppercase tracking-widest mb-3">Max Impact</p>
                      {/* 복구된 조회수 함수 적용부 */}
                      <p className="text-3xl font-bold text-[#21c1a2] tracking-tight">{formatViewsKorean(item.maxVideoViews)} Views</p>
                    </div>
                  </div>
                  <ActionLink href={`/cases/${item.caseSlug}`} className="inline-block text-[15px] font-black uppercase tracking-widest border-b-2 border-black pb-2 hover:text-[#21c1a2] hover:border-[#21c1a2]">
                    Review Case Study
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact & Footer */}
      <footer id="contact" className="bg-[#0B0F0E] pt-32 lg:pt-52 pb-20 text-white rounded-t-[80px]">
        <div className={shell}>
          <div className="grid gap-32 lg:grid-cols-2 mb-40">
            <div>
              <h2 className="text-[48px] font-bold tracking-tighter lg:text-[84px] leading-none mb-12">{content.contact.h2}</h2>
              <p className="text-2xl font-light text-white/40 leading-relaxed mb-20">{content.contact.lead}</p>
              <div className="space-y-12">
                <a href={content.contact.phoneHref} className="block text-4xl lg:text-6xl font-bold hover:text-[#21c1a2] tracking-tighter transition-colors">{content.contact.phoneDisplay}</a>
                <a href={content.contact.kakaoChatUrl} className="block text-4xl lg:text-6xl font-bold hover:text-[#21c1a2] tracking-tighter transition-colors">KAKAO 1:1</a>
              </div>
            </div>
            <div className="rounded-[40px] overflow-hidden bg-white/5 border border-white/5 h-[700px] shadow-2xl">
               <iframe src={content.contact.googleFormEmbedUrl} className="w-full h-full border-0 grayscale invert opacity-80" loading="lazy" />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-t border-white/10 pt-20">
            <div>
              <p className="font-bold text-3xl tracking-tighter mb-8 italic">{content.brand.name}.</p>
              <div className="space-y-2 text-sm text-white/30 font-medium">
                 {content.footer.lines.map(line => <p key={line.label}>{line.label}: {line.value}</p>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-12 text-[11px] font-black tracking-[0.3em] text-white/30">
              <Link href="/terms" className="hover:text-white transition-colors">TERMS</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
              <Link href="/refund" className="hover:text-white transition-colors">REFUND</Link>
            </div>
          </div>
        </div>
      </footer>

      <ContactCTA />
    </main>
  );
}
