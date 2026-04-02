import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content } from "../content";
import StatsBar from "../components/StatsBar";
import ProofBadges from "../components/ProofBadges";
import ContactCTA from "../components/ContactCTA";
import MidCTA from "../components/MidCTA";
import IntroGate from "../components/IntroGate";
import SignalInsights from "../components/SignalInsights";
import { getSortedInsights } from "../content/insights";

const clsCard =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_24px_rgba(11,15,14,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_16px_34px_rgba(11,15,14,0.08)]";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[#f7faf9] transition-colors hover:border-black/20";
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

export default function Page() {
  const insightPosts = getSortedInsights().slice(0, 4);
  const formEmbedUrl = content.contact.googleFormEmbedUrl.trim();
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoChatUrl = content.contact.kakaoChatUrl.trim();
  const hasFormEmbedUrl = isGoogleFormEmbedUrl(formEmbedUrl);
  const hasPhoneHref = phoneHref.startsWith("tel:");
  const hasKakaoChatUrl = kakaoChatUrl.startsWith("http://") || kakaoChatUrl.startsWith("https://");
  const [problemSupport = "", problemDetail = ""] = content.problem.lead.split("\n\n");
  const proofImage = content.studioProof.images[0] ?? {
    src: "/images/showreel-cover-optimized.jpg",
    alt: "Turnkeyhaus 실행 기반 대표 이미지"
  };

  return (
    <main className="min-h-screen bg-white pb-24 text-[#0B0F0E] md:pb-0">
      <IntroGate
        logoSrc="/logo.png"
        logoAlt="Turnkeyhaus"
        title="전략은 감각이 아니라 구조입니다."
        subtitle="전문직 채널 운영의 기준을 먼저 보여드립니다."
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

          <div className="flex items-center gap-2 md:hidden">
            <a
              href={content.contact.phoneHref}
              className="inline-flex h-10 items-center rounded-xl border border-black/15 px-3 text-sm font-semibold text-black/80"
            >
              전화상담
            </a>
            <a
              href={content.contact.kakaoChatUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-3 text-sm font-semibold text-black"
            >
              카카오톡
            </a>
          </div>
        </div>

        <div className="border-t border-black/10 md:hidden">
          <div className={`${containerShell} py-2`}>
            <nav className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1">
              {content.nav.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="inline-flex h-9 shrink-0 items-center rounded-full border border-black/10 bg-white px-3 text-sm font-semibold text-black/70"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden border-b border-black/10 bg-[#f8fbfa]">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[1920px] md:aspect-[16/9]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-team-office.png"
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

                <p className="text-sm leading-[1.75] text-black/58 md:text-right">
                  검색에서 발견되고 결정에서 선택되기까지,
                  <br className="hidden md:block" />
                  전환 기준으로 채널을 설계합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#f7faf9]">
        <div className={`${containerShell} py-8 md:py-10`}>
          <StatsBar />
          <ProofBadges />
        </div>
      </section>

      <section id="strategy-frame" className="bg-white">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} />

          <div className="grid gap-4 md:grid-cols-4">
            {content.strategyFrame.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(11,15,14,0.03)] md:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold tracking-[0.08em] text-black/45">{`0${index + 1}`}</div>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#21c1a2]/80" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#0B0F0E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.9] text-black/70">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="problem" className="border-y border-black/10 bg-[#f8fbfa]">
        <div className={`${containerShell} py-20 md:py-24`}>
          <div className="space-y-10">
            <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12">
              <div className="space-y-8">
                <SectionLabel>{content.problem.label}</SectionLabel>
                <h2 className={sectionTitleClass}>
                  {content.problem.h2}
                </h2>

                <p className="max-w-[55ch] whitespace-pre-line text-base leading-[1.95] text-black/75 md:text-lg">
                  {problemSupport}
                </p>

                <p className="max-w-[55ch] whitespace-pre-line text-base leading-[1.95] text-black/75 md:text-lg">
                  {problemDetail}
                </p>
              </div>

              <SignalInsights
                label={content.signalInsights.label}
                title={content.signalInsights.h2}
                lead={content.signalInsights.lead}
                items={content.signalInsights.items}
              />
            </div>

            <div className="rounded-2xl border border-[#21c1a2]/30 bg-[#21c1a2]/10 p-6">
              <p className="text-base font-semibold leading-[1.9] text-black md:text-lg">
                {content.problem.emphasis}
              </p>
            </div>

            <MidCTA />
          </div>
        </div>
      </section>

      <section id="approach" className="border-b border-black/10 bg-white">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.approach.label} title={content.approach.h2} lead={content.approach.lead} />

          <div className="grid gap-4 md:grid-cols-2">
            {content.approach.steps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(11,15,14,0.03)] md:p-6"
              >
                <h3 className="text-lg font-semibold text-[#0B0F0E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.9] text-black/72">{step.detail}</p>
              </article>
            ))}
          </div>

          <p className="w-full whitespace-pre-line break-keep rounded-2xl border border-black/10 bg-[#f8fbfa] px-5 py-5 text-base font-semibold leading-[1.9] text-black/80 md:text-lg">
            {content.approach.keyline}
          </p>
        </div>
      </section>

      <section id="professional" className="border-b border-black/10 bg-[#f8fbfa]">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader
            label={content.professionalTargets.label}
            title={content.professionalTargets.h2}
            lead={content.professionalTargets.lead}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {content.professionalTargets.cards.map((card) => (
              <article key={card.title} className={clsCard}>
                <MediaFrame image={card.image} sizes="(max-width: 768px) 100vw, 33vw" overlayClass="bg-black/12" />

                <div className="flex h-full flex-col space-y-4 p-5">
                  <h3 className="text-base font-semibold text-[#0B0F0E]">{card.title}</h3>

                  {(card.tags ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(card.tags ?? []).map((tag) => (
                        <span key={tag} className={clsTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="whitespace-pre-line text-base leading-[1.9] text-black/72 md:text-lg">{card.oneLiner}</p>

                  <ul className="space-y-2 text-sm leading-[1.8] text-black/72">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="list-inside list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <ActionLink href={card.href} className="mt-auto pt-1 text-xs font-semibold text-[#21c1a2]">
                    {card.ctaLabel} →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-black/10 bg-white">
        <div className={`${containerShell} space-y-8 py-20 md:grid md:grid-cols-[1fr_0.9fr] md:items-start md:gap-10 md:space-y-0 md:py-24`}>
          <div className="space-y-6">
            <SectionLabel>{content.studioProof.label}</SectionLabel>
            <h2 className={sectionTitleClass}>
              {content.studioProof.h2}
            </h2>
            <p className={bodyCopy}>{content.studioProof.crewLead}</p>

            <ul className="space-y-3">
              {content.studioProof.operationSystem.map((item) => (
                <li key={item} className="rounded-2xl border border-black/10 bg-[#f8fbfa] px-5 py-4 text-sm leading-[1.9] text-black/75">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:pt-2">
            <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-[24px] bg-black/[0.04] shadow-[0_16px_36px_rgba(11,15,14,0.1)] md:ml-auto">
              <Image
                src={proofImage.src}
                alt={proofImage.alt}
                width={1600}
                height={1067}
                className="block h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 680px"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-b border-black/10 bg-[#f8fbfa]">
        <div className={`${sectionShell} ${sectionStack}`}>
          <div className="max-w-[52ch] space-y-4">
            <SectionLabel>{content.portfolio.h2}</SectionLabel>
            <p className={bodyCopy}>{content.portfolio.lead}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {content.portfolio.items.map((item) => (
              <article key={item.title} className={clsCard}>
                <a href={item.href} target="_blank" rel="noreferrer" className="block">
                  <div className={clsMedia}>
                    <Image
                      src={item.youtubeId ? ytThumb(item.youtubeId) : item.imageSrc}
                      alt={`${item.title} 썸네일`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </a>

                <div className="flex h-full flex-col space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#0B0F0E]">{item.title}</h3>
                    <span className="shrink-0 rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-semibold text-black/70">
                      {item.result}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-base leading-[1.9] text-black/72 md:text-lg">{item.oneLiner}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className={clsTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ActionLink href={item.href} className="mt-auto pt-1 text-xs font-semibold text-black/65">
                    영상 보기 →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="border-b border-black/10 bg-white">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />

          {insightPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {insightPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(11,15,14,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(11,15,14,0.07)] md:p-6"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-medium text-black/65">
                      {post.keywords[0] ?? "인사이트"}
                    </span>
                    <span className="text-xs text-black/50">{post.publishedAt}</span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-[#0B0F0E] md:text-xl">{post.title}</h3>
                  <p className="mt-3 text-sm leading-[1.9] text-black/72 md:text-base">{post.description}</p>

                  <Link
                    href={`/insights/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[#21c1a2]"
                  >
                    글 읽기 →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm leading-[1.9] text-black/60 md:text-base">
              인사이트 글이 아직 없습니다.{" "}
              <code className="rounded bg-black/[0.04] px-2 py-1 text-xs">content/insights.ts</code>에 글을
              추가하면 자동으로 반영됩니다.
            </div>
          )}

          <div>
            <Link
              href="/insights"
              className="inline-flex rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              {content.blog.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-black/10 bg-[#f8fbfa]">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.pricing.label} title={content.pricing.h2} />

          <div className="grid gap-4 md:grid-cols-3">
            {content.pricing.levels.map((level) => {
              const targetText = level.target.replace(/^대상:\s*/, "");

              return (
                <article
                  key={level.title}
                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(11,15,14,0.03)] md:p-6"
                >
                  <div className="mb-4 space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-[#0B0F0E]">{level.title}</h3>
                    <p className="text-sm font-medium text-black/65">{level.priceBand}</p>
                  </div>

                  <ul className="space-y-2 text-sm leading-relaxed text-black/72">
                    {level.bullets.map((bullet) => (
                      <li key={bullet} className="list-inside list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 border-t border-black/10 pt-4 text-sm leading-[1.85] text-black/65 md:text-base">
                    <span className="font-medium text-black/72">대상:</span>
                    <br />
                    <span>{targetText}</span>
                  </p>
                </article>
              );
            })}
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="max-w-[52ch] whitespace-pre-line text-base font-semibold leading-[1.9] text-black/80 md:text-lg">
              {content.pricing.emphasis}
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-black/10 bg-white">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.faq.label} title={content.faq.h2} />

          <div className="grid gap-4 md:grid-cols-2">
            {content.faq.items.map((item) => (
              <article key={item.q} className="h-full rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_22px_rgba(11,15,14,0.03)] md:p-6">
                <h3 className="text-base font-semibold text-[#0B0F0E] md:text-lg">{item.q}</h3>
                <p className="mt-3 text-sm leading-[1.9] text-black/72 md:text-base">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-b border-black/10 bg-[#f8fbfa]">
        <div className={`${containerShell} py-20 md:py-24`}>
          <div className="mb-10 max-w-[52ch] space-y-6">
            <SectionLabel>{content.contact.label}</SectionLabel>
            <h2 className={sectionTitleClass}>
              {content.contact.h2}
            </h2>
            <p className={bodyCopy}>{content.contact.lead}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div className="space-y-8 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_26px_rgba(11,15,14,0.04)] md:p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold tracking-tight text-[#0B0F0E]">채널 구조 진단</h3>
                <p className="whitespace-pre-line text-base leading-[1.95] text-black/70">
                  현재 상황과 목표를 남겨주시면
                  {"\n"}
                  채널 구조 관점으로 검토 후 회신드립니다.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-black/70">소요시간: 약 5–10분</div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/65">
                    신규 유입
                  </span>
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/65">
                    리빌딩
                  </span>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-black/10 bg-[#fbfcfb] p-5">
                <div className="text-sm font-semibold text-[#0B0F0E]">진단 산출물</div>
                <ul className="space-y-2 text-sm leading-relaxed text-black/72">
                  <li className="list-inside list-disc">채널 포지셔닝/톤 점검</li>
                  <li className="list-inside list-disc">콘텐츠 역할(롱폼·숏폼) 재정의</li>
                  <li className="list-inside list-disc">전환 동선(CTA) 개선 포인트</li>
                </ul>
              </div>

              <p className="text-sm leading-[1.95] text-black/60 md:text-base">
                제작 견적이 아니라 구조 진단이 먼저입니다.
              </p>

              <div className="flex flex-wrap gap-3 border-t border-black/10 pt-4">
                {hasPhoneHref ? (
                  <a
                    href={phoneHref}
                    className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:border-black/25 hover:bg-black/[0.02]"
                  >
                    {content.contact.quickCallLabel} {content.contact.phoneDisplay}
                  </a>
                ) : null}

                {hasKakaoChatUrl ? (
                  <a
                    href={kakaoChatUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
                  >
                    {content.contact.kakaoCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <div
              id="contact-form"
              className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_28px_rgba(11,15,14,0.05)]"
            >
              {hasFormEmbedUrl ? (
                <iframe
                  src={formEmbedUrl}
                  className="h-[860px] w-full md:h-[920px]"
                  loading="lazy"
                  title={content.contact.iframeTitle}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="grid h-[860px] place-items-center p-6 text-center text-sm leading-relaxed text-black/60 md:h-[920px]">
                  Google Form 임베드 URL이 아직 설정되지 않았습니다.
                  <br />
                  README 안내대로 임베드 URL을 복사해
                  <br />
                  <code className="mt-2 rounded bg-black/[0.04] px-2 py-1 text-xs text-black/70">
                    content.contact.googleFormEmbedUrl
                  </code>
                  에 입력해 주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />

      <footer className="border-t border-black/10 bg-white">
        <div className={`${containerShell} py-10 text-xs text-black/65`}>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#0B0F0E]">{content.footer.companyName}</div>
            {content.footer.lines.map((line) => (
              <div key={line.label}>
                {line.label}: {line.value}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
