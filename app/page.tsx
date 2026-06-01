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
