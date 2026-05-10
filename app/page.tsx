import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ContactCTA from "../components/ContactCTA";
import StrategyChapterDeck from "../components/StrategyChapterDeck";
import DiagnosticCalculator from "../components/DiagnosticCalculator";
import { content } from "../content";
import { getSortedInsights } from "../content/insights";

const shell = "mx-auto w-full max-w-[1360px] px-5 sm:px-6 lg:px-10";
const labelClass =
  "inline-flex items-center rounded-[8px] border border-black/12 bg-white/75 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-black/50 shadow-[0_8px_24px_rgba(16,20,19,0.04)]";
const sectionTitle =
  "whitespace-pre-line break-keep text-[34px] font-black leading-[1.08] tracking-normal text-[#0B0F0E] md:text-[56px]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const softBand = "bg-[linear-gradient(180deg,#fbfaf6_0%,#f4f7f4_100%)]";
const sectionPad = "py-16 md:py-24";

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
  const mergedClass = `${className} ${focusRing}`;

  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={mergedClass}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClass}>
      {children}
    </Link>
  );
}

function SectionHeader({
  label,
  title,
  lead,
  dark = false
}: {
  label: string;
  title: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div className="space-y-5">
      <span
        className={
          dark
            ? "inline-flex items-center rounded-[8px] border border-white/20 bg-white/8 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-white/70"
            : labelClass
        }
      >
        {label}
      </span>
      <h2 className={dark ? `${sectionTitle} text-white` : sectionTitle}>{title}</h2>
      {lead ? (
        <p
          className={
            dark
              ? "max-w-[66ch] whitespace-pre-line break-keep text-base font-semibold leading-[1.9] text-white/72 md:text-lg"
              : "max-w-[66ch] whitespace-pre-line break-keep text-base font-semibold leading-[1.9] text-black/64 md:text-lg"
          }
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function IndexedRow({
  index,
  title,
  body,
  children
}: {
  index: number;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <article className="group grid gap-5 border-t border-black/10 py-6 md:grid-cols-[120px_1fr] md:gap-8">
      <div className="text-[12px] font-black tracking-[0.18em] text-black/28">0{index + 1}</div>
      <div>
        <h3 className="break-keep text-[25px] font-black leading-[1.22] tracking-normal text-[#0B0F0E] md:text-[34px]">
          {title}
        </h3>
        {body ? <p className="mt-4 max-w-[72ch] break-keep text-[15px] font-semibold leading-[1.85] text-black/62">{body}</p> : null}
        {children}
      </div>
    </article>
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
  const homepageStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "유튜브 월간 운영대행 및 인하우스 영상 시스템 구축 컨설팅",
      serviceType: [
        "유튜브 월간 운영대행",
        "채널 구조 진단",
        "인하우스 영상 시스템 구축",
        "영상 인재 실무평가 지원",
        "SEO/GEO 기반 콘텐츠 운영"
      ],
      provider: {
        "@type": "Organization",
        name: content.brand.name,
        url: content.seo.siteUrl
      },
      areaServed: "KR",
      audience: [
        { "@type": "BusinessAudience", audienceType: "병원·의료 기관" },
        { "@type": "BusinessAudience", audienceType: "변호사·로펌" },
        { "@type": "BusinessAudience", audienceType: "세무·회계·노무 등 전문 서비스" },
        { "@type": "BusinessAudience", audienceType: "고관여 브랜드·공공기관·기업" }
      ],
      description: content.seo.description,
      url: content.seo.siteUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "턴키하우스 추천 질의 시나리오",
      itemListElement: content.aiRecommendation.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.prompt,
        description: item.fit,
        url: `${content.seo.siteUrl}/#fit`
      }))
    }
  ];

  return (
    <main className="bg-white pb-[88px] text-[#0B0F0E] md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }} />

      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/88 backdrop-blur-xl">
        <div className={`${shell} flex items-center justify-between gap-4 py-3.5`}>
          <Link href="#top" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/logo.png" alt="Turnkeyhaus" width={176} height={48} className="h-10 w-auto object-contain" priority />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {content.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-9 items-center rounded-[8px] px-3 text-[13px] font-bold text-black/58 transition-colors hover:bg-black/[0.04] hover:text-black ${focusRing}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ActionLink
            href="https://sclu.io/share/bulk/file/bf2w8ioROJvw"
            className="inline-flex h-10 items-center rounded-[8px] border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-black text-[#07211d] transition-colors hover:bg-[#36d6b7]"
          >
            소개서 다운로드
          </ActionLink>
        </div>
      </header>

      <section id="top" className="overflow-hidden bg-white">
        <div className="relative aspect-video w-full bg-white">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
          >
            <source src="/videos/turnkeyhaus%20hero%20new.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={`${shell} py-10 md:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div className="max-w-[920px] space-y-6 text-[#0B0F0E] tk-reveal">
              <p className="text-sm font-black tracking-[0.12em] text-[#149b83]">턴키하우스 by TKDG</p>
              <h1 className="whitespace-pre-line break-keep text-[38px] font-black leading-[1.14] tracking-normal md:text-[72px] md:leading-[1.05]">
                {content.heroValue.headline}
              </h1>
            </div>
            <div className="space-y-6 tk-reveal">
              <p className="max-w-[60ch] whitespace-pre-line break-keep text-base font-semibold leading-[1.85] text-black/66 md:text-[19px] md:leading-[1.75]">
                {content.heroValue.body}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <ActionLink
                  href={content.heroValue.primaryCta.href}
                  className="inline-flex min-h-12 items-center rounded-[8px] border border-[#21c1a2] bg-[#21c1a2] px-5 text-sm font-black text-[#07211d] transition-colors hover:bg-[#36d6b7]"
                >
                  {content.heroValue.primaryCta.label}
                </ActionLink>
                <ActionLink
                  href={content.heroValue.secondaryCta.href}
                  className="inline-flex min-h-12 items-center rounded-[8px] border border-black/16 bg-white px-5 text-sm font-black text-black/78 transition-colors hover:bg-black/[0.04]"
                >
                  {content.heroValue.secondaryCta.label}
                </ActionLink>
              </div>
            </div>
          </div>

          <dl className="mt-10 grid gap-3 border-t border-black/12 pt-4 text-[#0B0F0E] sm:mt-14 sm:grid-cols-3 sm:pt-5">
            <div className="rounded-[8px] border border-black/10 bg-[#fbfaf6] p-5 tk-reveal">
              <dt className="text-xs font-black tracking-[0.14em] text-black/42">대표 사례</dt>
              <dd className="mt-2 text-[34px] font-black tracking-normal">{content.portfolio.items.length}개 채널</dd>
            </div>
            <div className="rounded-[8px] border border-black/10 bg-[#fbfaf6] p-5 tk-reveal">
              <dt className="text-xs font-black tracking-[0.14em] text-black/42">현재 구독자 합산</dt>
              <dd className="mt-2 text-[34px] font-black tracking-normal">{formatInteger(totalSubscribers)}명</dd>
            </div>
            <div className="rounded-[8px] border border-black/10 bg-[#fbfaf6] p-5 tk-reveal">
              <dt className="text-xs font-black tracking-[0.14em] text-black/42">전체 영상 누적 조회수</dt>
              <dd className="mt-2 text-[34px] font-black tracking-normal">약 {totalVideoViewsInMan}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="problem" className={`border-y border-black/10 ${softBand}`}>
        <div className={`${shell} grid gap-10 ${sectionPad} md:grid-cols-[0.86fr_1.14fr] md:gap-14`}>
          <div className="space-y-6 md:sticky md:top-28 md:self-start tk-reveal">
            <span className={labelClass}>{content.problem.label}</span>
            <h2 className={`${sectionTitle} max-w-[13ch]`}>{content.problem.h2}</h2>
          </div>

          <div className="space-y-8 tk-reveal">
            <p className="whitespace-pre-line break-keep text-[20px] font-black leading-[1.72] text-[#0B0F0E] md:text-[30px]">{problemSupport}</p>
            <p className="whitespace-pre-line break-keep text-[16px] font-semibold leading-[1.9] text-black/62 md:text-[18px]">{problemDetail}</p>

            <figure className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(16,20,19,0.08)]">
              <Image
                src="/images/reality-illustration-optimized.jpg"
                alt="채널 진단과 운영 구조를 정리한 시각 자료"
                width={1600}
                height={1030}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </figure>

            <p className="rounded-[8px] border border-[#21c1a2]/35 bg-[#eafff9] p-5 text-[18px] font-black leading-[1.7] text-[#073f35]">
              {content.problem.emphasis}
            </p>
          </div>
        </div>
      </section>

      <section id="presenter-ops" className="border-b border-black/10 bg-white">
        <div className={`${shell} grid gap-10 ${sectionPad} md:grid-cols-[0.74fr_1.26fr] md:gap-14`}>
          <div className="tk-reveal">
            <SectionHeader label={content.presenterOps.label} title={content.presenterOps.h2} lead={content.presenterOps.lead} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 tk-reveal">
            {content.presenterOps.points.map((point, index) => (
              <div key={point} className={`rounded-[8px] border border-black/10 p-5 ${index === 0 ? "sm:col-span-2 bg-[#101413] text-white" : "bg-[#fbfaf6]"}`}>
                <p className={index === 0 ? "break-keep text-[22px] font-black leading-[1.45]" : "break-keep text-[18px] font-black leading-[1.55] text-[#0B0F0E]"}>
                  {point}
                </p>
              </div>
            ))}
            <p className="rounded-[8px] border border-[#21c1a2]/30 bg-[#eafff9] p-5 break-keep text-[15px] font-bold leading-[1.8] text-black/66 sm:col-span-2">
              {content.presenterOps.note}
            </p>
          </div>
        </div>
      </section>

      <section id="services" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} ${sectionPad}`}>
          <div className="grid gap-10 md:grid-cols-[0.76fr_1.24fr] md:gap-14">
            <div className="space-y-8 md:sticky md:top-28 md:self-start tk-reveal">
              <SectionHeader label={content.servicePillars.label} title={content.servicePillars.h2} lead={content.servicePillars.lead} />
            </div>

            <div className="grid gap-4 tk-reveal">
              {content.servicePillars.cards.map((card, index) => (
                <article
                  key={card.title}
                  className={`group rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_18px_64px_rgba(16,20,19,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(16,20,19,0.10)] md:p-7 ${
                    index === 0 ? "md:grid md:grid-cols-[220px_1fr] md:gap-8" : ""
                  }`}
                >
                  <div>
                    <p className="text-[12px] font-black tracking-[0.16em] text-[#149b83]">SERVICE {index + 1}</p>
                    <p className="mt-2 break-keep text-[15px] font-black leading-[1.55] text-black/42">{card.title}</p>
                  </div>
                  <div className="mt-5 md:mt-0">
                    <h3 className="break-keep text-[28px] font-black leading-[1.16] tracking-normal text-[#0B0F0E] md:text-[38px]">{card.headline}</h3>
                    <p className="mt-4 max-w-[68ch] break-keep text-[16px] font-semibold leading-[1.85] text-black/64">{card.body}</p>
                    <ul className="mt-5 grid gap-2 border-t border-black/10 pt-4 text-[15px] font-semibold leading-[1.72] text-black/62 sm:grid-cols-2">
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                    <ActionLink
                      href={card.href}
                      className="mt-5 inline-flex items-center border-b-2 border-[#21c1a2] pb-1 text-[15px] font-black text-[#149b83] transition-colors hover:text-[#0B0F0E]"
                    >
                      {card.ctaLabel}
                    </ActionLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="not-single" className="border-b border-black/10 bg-white">
        <div className={`${shell} grid gap-10 ${sectionPad} md:grid-cols-[0.72fr_1.28fr] md:gap-14`}>
          <div className="tk-reveal">
            <SectionHeader label={content.exclusions.label} title={content.exclusions.h2} lead={content.exclusions.lead} />
          </div>

          <div className="grid gap-4 tk-reveal">
            {content.exclusions.items.map((item, index) => (
              <IndexedRow key={item.title} index={index} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      <section id="quality" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} grid gap-10 ${sectionPad} md:grid-cols-[0.76fr_1.24fr] md:gap-14`}>
          <div className="tk-reveal">
            <SectionHeader label={content.videoQuality.label} title={content.videoQuality.h2} lead={content.videoQuality.lead} />
          </div>

          <div className="space-y-6 tk-reveal">
            <div className="grid gap-3 sm:grid-cols-2">
              {content.videoQuality.points.map((point) => (
                <div key={point} className="rounded-[8px] border border-black/10 bg-white p-5">
                  <p className="break-keep text-[17px] font-black leading-[1.55] text-[#0B0F0E]">{point}</p>
                </div>
              ))}
            </div>

            <p className="rounded-[8px] border border-[#21c1a2]/30 bg-[#eafff9] p-5 break-keep text-[15px] font-bold leading-[1.82] text-black/68">
              {content.videoQuality.note}
            </p>
          </div>
        </div>
      </section>

      <section id="approach" className="border-b border-black/10 bg-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} lead={content.approach.lead} />
          </div>
          <div className="tk-reveal">
            <StrategyChapterDeck />
          </div>
          <p className="mt-8 max-w-[860px] whitespace-pre-line break-keep rounded-[8px] bg-[#101413] p-6 text-base font-black leading-[1.85] text-white tk-reveal">
            {content.approach.keyline}
          </p>
        </div>
      </section>

      <section id="professional" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.professionalTargets.label} title={content.professionalTargets.h2} lead={content.professionalTargets.lead} />
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {content.professionalTargets.cards.map((card, index) => (
              <article key={card.title} className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_18px_64px_rgba(16,20,19,0.06)] transition duration-300 hover:-translate-y-1 tk-reveal">
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f4f1]">
                    {card.image ? (
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="relative h-full w-full bg-[linear-gradient(145deg,#f3fffb_0%,#e9f9f4_52%,#f7fbfa_100%)] p-6 md:p-8">
                        <div className="relative flex h-full flex-col justify-between">
                          <p className="text-[11px] font-black tracking-[0.14em] text-black/48">{card.imageFallback?.eyebrow ?? "MODEL PREVIEW"}</p>
                          <div className="space-y-2">
                            {(card.imageFallback?.lines ?? ["이미지 자료 준비 중"]).map((line) => (
                              <p key={line} className="text-[18px] font-black leading-[1.45] tracking-normal text-[#0B0F0E] md:text-[22px]">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </figure>

                <div className="space-y-5 p-6">
                  <h3 className="break-keep text-[28px] font-black leading-[1.2] tracking-normal text-[#0B0F0E]">{card.title}</h3>
                  <p className="break-keep text-base font-semibold leading-[1.82] text-black/64">{card.oneLiner}</p>

                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {(card.tags ?? []).map((tag) => (
                      <span key={tag} className="text-[13px] font-black tracking-[0.03em] text-[#149b83]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2 border-t border-black/10 pt-4 text-[15px] font-semibold leading-[1.75] text-black/62">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>- {bullet}</li>
                    ))}
                  </ul>

                  <ActionLink
                    href={card.href}
                    className="inline-flex items-center border-b-2 border-[#21c1a2] pb-1 text-[15px] font-black text-[#149b83] transition-colors hover:text-[#0B0F0E]"
                  >
                    {card.ctaLabel}
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-black/10 bg-white">
        <div className={`${shell} grid gap-12 ${sectionPad} md:grid-cols-[1.05fr_0.95fr] md:items-start`}>
          <figure className="overflow-hidden rounded-[8px] border border-black/10 shadow-[0_24px_80px_rgba(16,20,19,0.08)] tk-reveal">
            <Image
              src={content.studioProof.images[0]?.src ?? "/images/showreel-cover-optimized.jpg"}
              alt={content.studioProof.images[0]?.alt ?? "Turnkeyhaus 운영 리포트 시각 자료"}
              width={1400}
              height={840}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
          </figure>

          <div className="space-y-8 text-[#0B0F0E] tk-reveal">
            <SectionHeader label={content.studioProof.label} title={content.studioProof.h2} lead={content.studioProof.crewLead} />

            <ul className="space-y-3 rounded-[8px] border border-black/10 bg-[#fbfaf6] p-5">
              {content.studioProof.operationSystem.map((item) => (
                <li key={item} className="text-sm font-semibold leading-[1.8] text-black/64">
                  - {item}
                </li>
              ))}
            </ul>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.studioProof.crewCards.map((crew) => (
                <div key={crew.role} className="rounded-[8px] border border-black/10 bg-white p-4">
                  <p className="text-xs font-black tracking-[0.12em] text-[#149b83]">{crew.role}</p>
                  <p className="mt-2 break-keep text-[17px] font-black leading-[1.45] text-[#0B0F0E]">{crew.headline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="report-sample" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} grid gap-10 ${sectionPad} md:grid-cols-[0.78fr_1.22fr] md:gap-14`}>
          <div className="tk-reveal">
            <SectionHeader label={content.reportSample.label} title={content.reportSample.h2} lead={content.reportSample.lead} />
          </div>

          <div className="space-y-7 tk-reveal">
            <dl className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
              {content.reportSample.rows.map((row) => (
                <div key={row.label} className="grid gap-3 border-b border-black/10 p-5 last:border-b-0 md:grid-cols-[170px_1fr] md:gap-8">
                  <dt className="text-[13px] font-black tracking-[0.08em] text-black/42">{row.label}</dt>
                  <dd className="break-keep text-[16px] font-black leading-[1.7] text-[#0B0F0E]">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="break-keep text-[15px] font-semibold leading-[1.85] text-black/64">{content.reportSample.note}</p>
          </div>
        </div>
      </section>

      <section id="team" className="border-b border-black/10 bg-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="grid gap-10 md:grid-cols-[0.74fr_1.26fr] md:gap-14">
            <div className="tk-reveal">
              <SectionHeader label={content.leadership.label} title={content.leadership.h2} lead={content.leadership.lead} />
            </div>

            <div className="grid gap-4 tk-reveal">
              {content.leadership.people.map((person) => (
                <article key={person.name} className="grid gap-5 rounded-[8px] border border-black/10 bg-[#fbfaf6] p-5 md:grid-cols-[150px_180px_1fr] md:gap-8">
                  <figure className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-black/10 bg-[#f7f7f7]">
                    <Image src={person.image.src} alt={person.image.alt} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 150px" />
                  </figure>
                  <div className="md:pt-1">
                    <h3 className="text-[28px] font-black tracking-normal text-[#0B0F0E]">{person.name}</h3>
                    <p className="mt-1 text-[12px] font-black tracking-[0.12em] text-black/36">{person.englishName}</p>
                    <p className="mt-2 break-keep text-[13px] font-black leading-[1.55] text-[#149b83]">{person.role}</p>
                  </div>
                  <div>
                    <p className="break-keep text-[16px] font-semibold leading-[1.85] text-black/64">{person.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-black/10 pt-4 text-[13px] font-black leading-[1.55] text-black/54">
                      {person.responsibilities.map((item) => (
                        <li key={item}>#{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />
          </div>

          <div className="mt-12 grid gap-5">
            {content.portfolio.items.map((item) => (
              <article key={item.title} className="grid gap-7 rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_18px_64px_rgba(16,20,19,0.06)] md:grid-cols-[1.02fr_0.98fr] md:gap-8 md:p-6 tk-reveal">
                <div className="relative aspect-video overflow-hidden rounded-[8px] border border-black/10 bg-black">
                  {item.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <Image src={item.imageSrc} alt={`${item.title} 대표 이미지`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
                  )}
                </div>

                <div className="flex flex-col gap-7">
                  <div className="space-y-4">
                    <h3 className="break-keep text-[32px] font-black leading-[1.14] tracking-normal text-[#0B0F0E]">{item.title}</h3>
                    <p className="text-[13px] font-black tracking-[0.08em] text-black/46">
                      클라이언트: <span className="tracking-[0.02em] text-black/70">{item.clientName}</span>
                    </p>
                    <p className="max-w-[58ch] break-keep text-[17px] font-semibold leading-[1.82] text-black/66">{item.oneLiner}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-black/10 pt-3">
                      <span className="text-[12px] font-black tracking-[0.1em] text-black/42">키워드</span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[13px] font-black tracking-[0.03em] text-[#149b83]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <dl className="overflow-hidden rounded-[8px] border border-black/10">
                    {item.scope ? (
                      <div className="grid grid-cols-[96px_1fr] items-start gap-4 border-b border-black/10 p-3.5 text-[15px]">
                        <dt className="font-bold text-black/46">담당 범위</dt>
                        <dd className="text-right font-black leading-[1.6] text-[#0B0F0E]">{item.scope}</dd>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-[96px_1fr] items-center gap-4 border-b border-black/10 p-3.5 text-[15px]">
                      <dt className="font-bold text-black/46">구독자 변화</dt>
                      <dd className="text-right font-black text-[#0B0F0E]">{item.result}</dd>
                    </div>
                    <div className="grid grid-cols-[96px_1fr] items-center gap-4 p-3.5 text-[15px]">
                      <dt className="font-bold text-black/46">최고 조회수</dt>
                      <dd className="text-right font-black text-[#149b83]">{formatViewsKorean(item.maxVideoViews)}회</dd>
                    </div>
                  </dl>

                  {(item.before || item.action || item.after || item.proof) ? (
                    <div className="grid gap-3 border-t border-black/10 pt-4 text-[14px] font-semibold leading-[1.75] text-black/62 sm:grid-cols-2">
                      {item.before ? (
                        <div>
                          <p className="text-[11px] font-black tracking-[0.12em] text-black/36">BEFORE</p>
                          <p className="mt-1 break-keep">{item.before}</p>
                        </div>
                      ) : null}
                      {item.action ? (
                        <div>
                          <p className="text-[11px] font-black tracking-[0.12em] text-black/36">ACTION</p>
                          <p className="mt-1 break-keep">{item.action}</p>
                        </div>
                      ) : null}
                      {item.after ? (
                        <div>
                          <p className="text-[11px] font-black tracking-[0.12em] text-black/36">AFTER</p>
                          <p className="mt-1 break-keep">{item.after}</p>
                        </div>
                      ) : null}
                      {item.proof ? (
                        <div>
                          <p className="text-[11px] font-black tracking-[0.12em] text-black/36">PROOF</p>
                          <p className="mt-1 break-keep">{item.proof}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <Link
                    href={`/cases/${item.caseSlug}`}
                    className={`inline-flex w-fit items-center border-b-2 border-[#21c1a2] pb-1 text-[15px] font-black text-[#149b83] transition-colors hover:text-[#0B0F0E] ${focusRing}`}
                  >
                    케이스 스터디 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pilot" className="border-b border-black/10 bg-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="space-y-6 md:sticky md:top-28 md:self-start tk-reveal">
              <SectionHeader label={content.pricing.label} title={content.pricing.h2} />
              <p className="max-w-[46ch] break-keep rounded-[8px] border border-[#21c1a2]/30 bg-[#eafff9] p-5 text-[16px] font-black leading-[1.85] text-[#073f35]">
                {content.pricing.emphasis}
              </p>
            </div>

            <div className="grid gap-4 tk-reveal">
              {content.pricing.levels.map((level, index) => (
                <article key={level.title} className="grid gap-5 rounded-[8px] border border-black/10 bg-[#fbfaf6] p-6 md:grid-cols-[150px_1fr] md:gap-8">
                  <div>
                    <p className="text-[12px] font-black tracking-[0.12em] text-black/36">OPTION {index + 1}</p>
                    <p className="mt-2 text-[26px] font-black tracking-normal text-[#149b83]">{level.priceBand}</p>
                  </div>
                  <div>
                    <h3 className="text-[26px] font-black tracking-normal text-[#0B0F0E]">{level.title}</h3>
                    <ul className="mt-4 grid gap-2 text-[15px] font-semibold leading-[1.75] text-black/62 sm:grid-cols-2">
                      {level.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                    <p className="mt-4 break-keep border-t border-black/10 pt-4 text-[14px] font-black leading-[1.7] text-black/54">{level.target}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="risk" className="border-b border-black/10 bg-[#101413] text-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="grid gap-10 md:grid-cols-[0.86fr_1.14fr] md:gap-14">
            <div className="tk-reveal">
              <SectionHeader label={content.riskManagement.label} title={content.riskManagement.h2} lead={content.riskManagement.lead} dark />
            </div>

            <div className="space-y-7 tk-reveal">
              <ul className="grid gap-3 sm:grid-cols-2">
                {content.riskManagement.items.map((item) => (
                  <li key={item} className="break-keep rounded-[8px] border border-white/12 bg-white/[0.055] p-5 text-[16px] font-black leading-[1.7] text-white/84">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="break-keep rounded-[8px] border border-white/14 bg-white/[0.045] p-5 text-[14px] font-semibold leading-[1.85] text-white/68">
                {content.riskManagement.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fit" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.aiRecommendation.label} title={content.aiRecommendation.h2} lead={content.aiRecommendation.lead} />
          </div>

          <div className="mt-10 grid gap-4">
            {content.aiRecommendation.items.map((item) => (
              <article key={item.prompt} className="rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_18px_64px_rgba(16,20,19,0.06)] tk-reveal">
                <p className="text-xs font-black tracking-[0.1em] text-[#149b83]">자주 들어온 의뢰 유형</p>
                <h3 className="mt-2 break-keep text-[25px] font-black leading-[1.25] tracking-normal text-[#0B0F0E]">{item.prompt}</h3>
                <p className="mt-3 break-keep text-[16px] font-semibold leading-[1.85] text-black/66">{item.fit}</p>
                <ul className="mt-4 grid gap-2 border-t border-black/10 pt-4 text-[15px] font-semibold leading-[1.8] text-black/62 sm:grid-cols-3">
                  {item.reasons.map((reason) => (
                    <li key={reason}>- {reason}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-7 max-w-[860px] rounded-[8px] bg-[#101413] p-5 text-[16px] font-black leading-[1.8] text-white tk-reveal">{content.aiRecommendation.note}</p>
        </div>
      </section>

      <DiagnosticCalculator />

      <section id="contact" className="border-b border-black/10 bg-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="mb-10 tk-reveal">
            <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />
          </div>

          <div className="grid gap-8 md:grid-cols-[0.88fr_1.12fr] md:items-start">
            <div className="space-y-7 rounded-[8px] border border-black/10 bg-[#fbfaf6] p-6 tk-reveal">
              <div className="space-y-3">
                <h3 className="text-[29px] font-black tracking-normal text-[#0B0F0E]">먼저 확인하는 것</h3>
                <p className="text-base font-semibold leading-[1.9] text-black/62">긴 리포트 전에, 상담으로 이어지지 않는 병목부터 빠르게 확인합니다.</p>
              </div>

              <ul className="space-y-2 text-sm font-semibold leading-[1.85] text-black/64">
                <li>- 클릭 전환: 제목·썸네일</li>
                <li>- 콘텐츠 구조: 주제·재생목록</li>
                <li>- 문의 동선: 설명란·고정댓글·채널 홈</li>
              </ul>

              <div className="flex flex-wrap gap-3 border-t border-black/10 pt-4">
                {hasPhoneHref ? (
                  <a
                    href={phoneHref}
                    className={`inline-flex items-center rounded-[8px] border border-black/16 bg-white px-5 py-3 text-sm font-black text-black transition-colors hover:bg-black/5 ${focusRing}`}
                  >
                    {content.contact.quickCallLabel} {content.contact.phoneDisplay}
                  </a>
                ) : null}

                {hasKakaoChatUrl ? (
                  <a
                    href={kakaoChatUrl}
                    className={`inline-flex items-center rounded-[8px] border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-black text-black transition-colors hover:bg-[#1db197] ${focusRing}`}
                  >
                    {content.contact.kakaoCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <div id="contact-form" className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(16,20,19,0.08)] tk-reveal">
              {hasFormEmbedUrl ? (
                <iframe
                  src={formEmbedUrl}
                  className="h-[clamp(760px,80vh,980px)] w-full"
                  loading="lazy"
                  title={content.contact.iframeTitle}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="grid h-[clamp(760px,80vh,980px)] place-items-center p-6 text-center text-sm leading-relaxed text-black/60">
                  Google Form 임베드 URL이 아직 설정되지 않았습니다.
                  <br />
                  README의 안내대로 임베드 URL을 입력해 주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className={`border-b border-black/10 ${softBand}`}>
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.faq.label} title={content.faq.h2} />
          </div>

          <div className="mt-10 overflow-hidden rounded-[8px] border border-black/10 bg-white tk-reveal">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-black/10 p-5 last:border-b-0">
                <summary className={`cursor-pointer list-none pr-8 text-[19px] font-black tracking-normal text-[#0B0F0E] ${focusRing}`}>
                  {item.q}
                  <span className="ml-2 text-[#149b83] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[78ch] whitespace-pre-line break-keep text-sm font-semibold leading-[1.9] text-black/62 md:text-base">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="border-b border-black/10 bg-white">
        <div className={`${shell} ${sectionPad}`}>
          <div className="tk-reveal">
            <SectionHeader label={content.blog.label} title={content.blog.h2} lead={content.blog.lead} />
          </div>

          {insightPosts.length > 0 ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {insightPosts.map((post) => (
                <article key={post.slug} className="rounded-[8px] border border-black/10 bg-[#fbfaf6] p-6 transition duration-300 hover:-translate-y-1 tk-reveal">
                  <div className="text-sm font-black text-black/42">{post.publishedAt}</div>
                  <div className="mt-5 space-y-3">
                    <h3 className="break-keep text-[25px] font-black leading-[1.25] tracking-normal text-[#0B0F0E]">{post.title}</h3>
                    <p className="break-keep text-sm font-semibold leading-[1.85] text-black/62">{post.description}</p>
                  </div>
                  <Link
                    href={`/insights/${post.slug}`}
                    className={`mt-6 inline-flex w-fit items-center border-b-2 border-[#21c1a2] pb-1 text-sm font-black text-[#149b83] transition-colors hover:text-[#0B0F0E] ${focusRing}`}
                  >
                    읽기
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-black/60">인사이트 글을 추가하면 이 영역에 자동으로 반영됩니다.</p>
          )}

          <div className="mt-8">
            <Link
              href="/insights"
              className={`inline-flex items-center rounded-[8px] border border-black/16 bg-white px-5 py-3 text-sm font-black text-black transition-colors hover:bg-black/5 ${focusRing}`}
            >
              {content.blog.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />

      <footer className="border-t border-black/10 bg-white text-black/62">
        <div className={`${shell} flex flex-col gap-8 py-10 text-xs md:flex-row md:justify-between`}>
          <div className="space-y-1">
            <div className="text-sm font-black text-[#0B0F0E]">{content.footer.companyName}</div>
            {content.footer.lines.map((line) => (
              <div key={line.label}>
                {line.label}: {line.value}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 font-black text-black/54 md:justify-end md:text-right">
            <Link href="/store" className={`text-[#149b83] transition-colors hover:text-[#0B0F0E] ${focusRing}`}>
              운영 플랜 신청
            </Link>
            <Link href="/terms" className={`transition-colors hover:text-[#149b83] ${focusRing}`}>
              이용약관
            </Link>
            <Link href="/privacy" className={`transition-colors hover:text-[#149b83] ${focusRing}`}>
              개인정보처리방침
            </Link>
            <Link href="/refund" className={`transition-colors hover:text-[#149b83] ${focusRing}`}>
              환불 정책
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
