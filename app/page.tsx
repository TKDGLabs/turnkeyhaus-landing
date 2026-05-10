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

// --- 디자인 시스템 유틸리티 ---
const shell = "mx-auto w-full max-w-[1440px] px-6 lg:px-16";
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#21c1a2]";

const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
  }
};

const formatInteger = (n: number) => new Intl.NumberFormat("ko-KR").format(Math.round(n));

function ActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const isExternal = href.startsWith("http");
  const mergedClass = `${className} ${focusRing} transition-all duration-500`;
  if (isExternal) return <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>{children}</a>;
  return <Link href={href} className={mergedClass}>{children}</Link>;
}

export default function Page() {
  const totalSubscribers = content.portfolio.items.reduce((sum, item) => sum + item.subscriberCurrent, 0);

  return (
    <main className="bg-[#fdfdfd] text-[#0B0F0E] antialiased">
      
      {/* 1. Cinematic Header */}
      <header className="fixed top-0 z-50 w-full border-b border-black/[0.02] bg-white/60 backdrop-blur-xl">
        <div className={`${shell} flex h-20 items-center justify-between`}>
          <Link href="#top" className="group">
            <Image src="/logo.png" alt="Turnkeyhaus" width={140} height={40} className="h-8 w-auto opacity-90 transition-opacity group-hover:opacity-100" priority />
          </Link>
          <nav className="hidden items-center gap-12 lg:flex">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[13px] font-bold uppercase tracking-[0.15em] text-black/40 hover:text-black transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <ActionLink href="#contact" className="rounded-full bg-[#0B0F0E] px-8 py-2.5 text-[13px] font-bold text-white hover:bg-[#21c1a2] hover:text-black">
            GET IN TOUCH
          </ActionLink>
        </div>
      </header>

      {/* 2. Cinematic Hero Section */}
      <section id="top" className="relative pt-32 lg:pt-48 pb-20">
        <div className={shell}>
          <motion.div initial="hidden" animate="visible" variants={reveal} className="mb-20">
            <h1 className="text-[48px] font-light leading-[1.05] tracking-[-0.04em] sm:text-[72px] lg:text-[100px] xl:text-[120px]">
              {content.brand.name}. <br />
              <span className="font-bold text-[#21c1a2]">{content.heroValue.headline.split('\n')[0]}</span>
            </h1>
            <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <p className="max-w-[480px] text-lg leading-relaxed text-black/50 lg:text-xl font-medium">
                {content.heroValue.body}
              </p>
              <div className="flex gap-4">
                <ActionLink href="#pilot" className="border-b-2 border-[#21c1a2] pb-1 text-lg font-bold hover:text-[#21c1a2]">
                  {content.heroValue.primaryCta.label} →
                </ActionLink>
              </div>
            </div>
          </motion.div>

          {/* Corrected 16:9 Hero Video */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }}
            className="relative w-full aspect-video overflow-hidden rounded-[32px] bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]"
          >
            <video autoPlay muted loop playsInline className="h-full w-full object-cover">
              <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* 3. Logic: Problem & Reality Check */}
      <section id="problem" className="py-32 lg:py-60 bg-white">
        <div className={shell}>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
              <span className="text-[12px] font-black tracking-[0.3em] text-black/20 uppercase">{content.problem.label}</span>
              <h2 className="mt-8 text-[40px] font-bold leading-tight tracking-tighter lg:text-[64px] whitespace-pre-line">
                {content.problem.h2}
              </h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: 0.2 }}>
              <p className="text-2xl lg:text-4xl font-light leading-snug tracking-tight text-black/70 whitespace-pre-line">
                {content.problem.lead}
              </p>
              <p className="mt-12 text-xl font-bold text-[#21c1a2] lg:text-2xl">{content.problem.emphasis}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. High-End Service Bento */}
      <section id="services" className="bg-[#0B0F0E] py-32 lg:py-60 text-white rounded-[60px] lg:rounded-[100px] mx-4">
        <div className={shell}>
          <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <h2 className="text-[40px] font-bold tracking-tighter lg:text-[80px]">{content.servicePillars.h2}</h2>
            <p className="max-w-[400px] text-white/40 text-lg font-medium">{content.servicePillars.lead}</p>
          </div>
          
          <div className="grid gap-4 lg:grid-cols-12">
            {content.servicePillars.cards.map((card, idx) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: idx * 0.1 }}
                className={`group rounded-[40px] bg-white/5 p-10 backdrop-blur-sm transition-all hover:bg-white/10 ${idx === 0 ? 'lg:col-span-8' : 'lg:col-span-4'}`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <span className="text-[#21c1a2] font-black text-xs tracking-widest uppercase">0{idx + 1}. {card.title}</span>
                    <h3 className="mt-6 text-3xl lg:text-4xl font-bold tracking-tight">{card.headline}</h3>
                    <p className="mt-6 text-white/50 leading-relaxed font-medium">{card.body}</p>
                  </div>
                  <ul className="mt-12 space-y-4">
                    {card.bullets.map(b => <li key={b} className="text-sm font-bold text-white/70 flex items-center gap-3"><span className="h-1 w-1 bg-[#21c1a2] rounded-full" /> {b}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Section: Actual Roles (Cleaned Lead tags) */}
      <section id="team" className="py-32 lg:py-60 bg-white">
        <div className={shell}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mb-24">
            <span className="text-[12px] font-black tracking-[0.3em] text-black/20 uppercase">{content.leadership.label}</span>
            <h2 className="mt-6 text-[40px] font-bold tracking-tighter lg:text-[80px]">{content.leadership.h2}</h2>
          </motion.div>
          
          <div className="grid gap-16 lg:grid-cols-3">
            {content.leadership.people.map((person, idx) => (
              <motion.div key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: idx * 0.2 }} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#f8f9fa]">
                  <Image src={person.image.src} alt={person.name} fill className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                </div>
                <div className="mt-10">
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-3xl font-bold">{person.name}</h3>
                    <span className="text-sm font-black text-[#21c1a2] tracking-widest uppercase">{person.role}</span>
                  </div>
                  <p className="mt-6 text-black/50 leading-relaxed font-medium text-lg">{person.body}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {person.responsibilities.map(r => (
                      <span key={r} className="rounded-lg bg-black/[0.03] px-3 py-1 text-[11px] font-black text-black/40">#{r}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Portfolio Showcase */}
      <section id="portfolio" className="py-32 lg:py-60 bg-[#f8f9fa]">
        <div className={shell}>
          <div className="mb-24">
            <h2 className="text-[40px] font-bold tracking-tighter lg:text-[80px]">{content.portfolio.h2}</h2>
            <p className="mt-8 text-xl text-black/40 font-medium max-w-2xl">{content.portfolio.lead}</p>
          </div>
          
          <div className="space-y-32">
            {content.portfolio.items.map((item, i) => (
              <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}
                className={`flex flex-col gap-12 lg:flex-row lg:items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="relative aspect-video flex-1 overflow-hidden rounded-[40px] bg-black shadow-2xl">
                  {item.youtubeId ? (
                    <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?modestbranding=1&rel=0`} className="h-full w-full border-0" />
                  ) : (
                    <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-8">
                  <span className="rounded-full bg-[#21c1a2]/10 px-4 py-1 text-xs font-black text-[#1db197] tracking-widest uppercase">{item.clientName}</span>
                  <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-xl text-black/50 font-medium leading-relaxed">{item.oneLiner}</p>
                  <div className="grid grid-cols-2 gap-8 border-y border-black/[0.05] py-10">
                    <div>
                      <p className="text-xs font-black text-black/20 uppercase tracking-widest">Growth</p>
                      <p className="mt-2 text-3xl font-bold">{item.result}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-black/20 uppercase tracking-widest">Max Views</p>
                      <p className="mt-2 text-3xl font-bold text-[#21c1a2]">{Math.round(item.maxVideoViews/10000)}만회</p>
                    </div>
                  </div>
                  <Link href={`/cases/${item.caseSlug}`} className="inline-block text-lg font-black underline-offset-8 hover:underline hover:text-[#21c1a2]">
                    VIEW CASE STUDY →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Strategic Calculator (Brand CTA) */}
      <section className="bg-white py-24">
        <div className={shell}>
          <div className="rounded-[60px] bg-[#21c1a2] p-12 lg:p-24 shadow-2xl">
            <DiagnosticCalculator />
          </div>
        </div>
      </section>

      {/* 8. FAQ & Contact */}
      <section id="contact" className="py-32 lg:py-60 bg-white">
        <div className={shell}>
          <div className="grid gap-24 lg:grid-cols-2">
            <div>
              <h2 className="text-[40px] font-bold tracking-tighter lg:text-[80px]">{content.contact.h2}</h2>
              <p className="mt-12 text-2xl font-light text-black/50 leading-relaxed">{content.contact.lead}</p>
              <div className="mt-20 space-y-8">
                <a href={content.contact.phoneHref} className="block text-3xl font-bold hover:text-[#21c1a2] tracking-tighter">{content.contact.phoneDisplay}</a>
                <a href={content.contact.kakaoChatUrl} className="block text-3xl font-bold hover:text-[#21c1a2] tracking-tighter">KAKAOTALK 1:1</a>
              </div>
            </div>
            <div className="rounded-[40px] overflow-hidden bg-[#f8f9fa] h-[700px] shadow-inner">
               <iframe src={content.contact.googleFormEmbedUrl} className="w-full h-full border-0" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-black/[0.03]">
        <div className={`${shell} flex flex-col lg:flex-row justify-between items-start gap-12`}>
          <div>
            <p className="font-bold text-3xl tracking-tighter">{content.brand.name}.</p>
            <div className="mt-8 space-y-2 text-sm text-black/30 font-medium">
               {content.footer.lines.map(line => <p key={line.label}>{line.label}: {line.value}</p>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-12 text-xs font-black tracking-widest text-black/30">
            <Link href="/terms" className="hover:text-black">TERMS</Link>
            <Link href="/privacy" className="hover:text-black">PRIVACY</Link>
            <Link href="/refund" className="hover:text-black">REFUND</Link>
          </div>
        </div>
      </footer>

      <ContactCTA />
    </main>
  );
}
