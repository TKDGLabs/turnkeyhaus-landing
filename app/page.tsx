'use client';

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content } from "../content";
import StatsBar from "../components/StatsBar";
import ProofBadges from "../components/ProofBadges";
import ContactCTA from "../components/ContactCTA";
import IntroGate from "../components/IntroGate";
import SignalInsights from "../components/SignalInsights";
import CountUp from "../components/CountUp";
import { getSortedInsights } from "../content/insights";
import StrategyModals from "../components/StrategyModals";
import DiagnosticCalculator from "../components/DiagnosticCalculator";

const clsCard =
  "group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_24px_rgba(11,15,14,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_16px_34px_rgba(11,15,14,0.08)]";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] transition-colors hover:border-black/20";
const clsTag = "rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/70";
const containerShell = "mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-8";
const sectionShell = `${containerShell} py-20 md:py-24`;
const sectionStack = "space-y-8 md:space-y-10";
const bodyCopy = "max-w-[60ch] whitespace-pre-line break-keep text-base leading-[1.95] text-black/72 md:text-lg";
const sectionLabelClass =
  "inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base";
const sectionTitleClass =
  "whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px]";

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
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SectionLabel({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${sectionLabelClass} ${className}`.trim()}>{children}</div>;
}

function SectionHeader({
  label,
  title,
  lead
}: {
  label: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="max-w-[64ch] space-y-4">
        <SectionLabel>{label}</SectionLabel>
        <h2 className={sectionTitleClass}>
          {title}
        </h2>
        {lead ? <p className={bodyCopy}>{lead}</p> : null}
      </div>
      <div className="h-px w-full bg-black/10" />
    </div>
  );
}

function MediaFrame({
  image,
  sizes = "(max-width: 768px) 100vw, 50vw",
  overlayClass = "bg-black/10"
}: {
  image: { src: string; alt: string };
  sizes?: string;
  overlayClass?: string;
}) {
  return (
    <div className={clsMedia}>
      <Image src={image.src} alt={image.alt} fill className="object-cover" sizes={sizes} />
      <div className={`absolute inset-0 ${overlayClass}`} />
    </div>
  );
}

function isGoogleFormEmbedUrl(url: string) {
  return (
    url.startsWith("https://docs.google.com/forms/d/e/") &&
    url.includes("/viewform?embedded=true")
  );
}

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const formatInteger = (n: number) => Math.round(n).toLocaleString("ko-KR");

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const formEmbedUrl = content.contact.googleFormEmbedUrl.trim();
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoChatUrl = content.contact.kakaoChatUrl.trim();
  const hasFormEmbedUrl = isGoogleFormEmbedUrl(formEmbedUrl);
  const hasPhoneHref = phoneHref.startsWith("tel:");
  const hasKakaoChatUrl = kakaoChatUrl.startsWith("http://") || kakaoChatUrl.startsWith("https://");
  const [problemSupport = "", problemDetail = ""] = content.problem.lead.split("\n\n");
  const [introTitle = "", ...introSubtitleLines] = content.heroValue.scrollGuide.split("\n");
  const introSubtitle = introSubtitleLines.join("\n");
  const proofImage = content.studioProof.images[0] ?? {
    src: "/images/showreel-cover-optimized.jpg",
    alt: "Turnkeyhaus 실행 기반 대표 이미지"
  };

  return (
    <main className="min-h-screen bg-white pb-24 text-[#0B0F0E] md:pb-0">
      <IntroGate
        logoSrc="/logo.png"
        logoAlt="Turnkeyhaus"
        title={introTitle}
        subtitle={introSubtitle}
      />

      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className={`${containerShell} flex items-center justify-between py-4`}>
          <Link href="#top" className="flex h-11 shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="Turnkeyhaus"
              width={176}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1.5">
              {content.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center whitespace-nowrap rounded-xl px-3.5 text-[15px] font-semibold tracking-[0.01em] text-black/72 transition-colors hover:bg-black/[0.03] hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <a
              href="https://sclu.io/share/bulk/file/bf2w8ioROJvw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center whitespace-nowrap rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
            >
              소개서 다운로드
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden border-b border-black/10 bg-white">
        <div className="relative aspect-[4/3] w-full md:aspect-[16/9]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/showreel-cover-optimized.jpg"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center md:object-[center_42%]"
          >
            <source src="/videos/hero-render-1080.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_75%_20%,rgba(33,193,162,0.17),transparent_58%)] md:block" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 -mt-14 border-b border-black/10 bg-white/0 md:-mt-20">
        <div className={`${containerShell} pb-12 md:pb-14`}>
          <div className="rounded-[28px] border border-black/10 bg-white/95 p-6 shadow-[0_18px_48px_rgba(11,15,14,0.08)] backdrop-blur md:p-10">
            <div className="grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-end">
              <div className="space-y-5">
                <h1 className="max-w-[24ch] whitespace-pre-line break-keep text-[33px] font-semibold leading-[1.18] tracking-tight text-[#0B0F0E] md:text-[54px] md:leading-[1.1]">
                  {content.heroValue.headline}
                </h1>
                <p className="max-w-[56ch] whitespace-pre-line break-keep text-base leading-[1.9] text-black/72 md:text-[21px] md:leading-[1.72]">
                  {content.heroValue.body}
                </p>
              </div>

              <div className="space-y-4 md:justify-self-end">
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <ActionLink
                    href={content.heroValue.primaryCta.href}
                    className="inline-flex rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black shadow-[0_8px_16px_rgba(33,193,162,0.25)]"
                  >
                    {content.heroValue.primaryCta.label}
                  </ActionLink>
                  <ActionLink
                    href={content.heroValue.secondaryCta.href}
                    className="inline-flex rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black"
                  >
                    {content.heroValue.secondaryCta.label}
                  </ActionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className={`${containerShell} py-8 md:py-10`}>
          <StatsBar />
          <ProofBadges />
        </div>
      </section>

      {/* 문제 제기 및 통합된 전략 모달 섹션 */}
      <section id="problem" className="border-y border-black/10 bg-white">
        <div className={`${containerShell} py-20 md:py-24`}>
          <div className="space-y-12 md:space-y-16">
            <div className="space-y-8 md:space-y-10">
              <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                <div className="space-y-6">
                  <SectionLabel>{content.problem.label}</SectionLabel>
                  <h2 className={`${sectionTitleClass} max-w-
