import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content } from "../content";

const clsCard =
  "group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-black/20";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[#f8faf9] transition-colors hover:border-black/20";
const clsTag = "rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/70";
const sectionShell = "mx-auto max-w-6xl px-5 py-20 md:py-24";
const sectionStack = "space-y-8 md:space-y-10";
const bodyCopy = "whitespace-pre-line text-base leading-[1.85] text-black/72 md:text-lg";
const sectionLabelClass = "text-sm font-semibold tracking-[0.14em] text-black/45 md:text-base";

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
    <div className="max-w-2xl space-y-4">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="whitespace-pre-line text-3xl font-semibold leading-[1.2] tracking-tight text-[#0B0F0E] md:text-4xl">
        {title}
      </h2>
      {lead ? <p className={`${bodyCopy} max-w-2xl`}>{lead}</p> : null}
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
  const formEmbedUrl = content.contact.googleFormEmbedUrl.trim();
  const formShareUrl = content.contact.googleFormShareUrl.trim();
  const hasFormEmbedUrl = isGoogleFormEmbedUrl(formEmbedUrl);
  const hasFormShareUrl = formShareUrl.startsWith("http://") || formShareUrl.startsWith("https://");

  return (
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="#top" className="flex items-center">
            <Image src="/logo.png" alt="Turnkeyhaus" width={150} height={40} priority />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {content.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-xs font-medium tracking-[0.08em] text-black/65 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="border-b border-black/10 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr] md:items-stretch">
            <div className="space-y-10">
              <SectionLabel>[ PROFESSIONAL YOUTUBE STRUCTURE ]</SectionLabel>

              <h1 className="max-w-[18ch] whitespace-pre-line text-5xl font-semibold leading-[1.05] tracking-tight text-black md:text-6xl">
                전문직 유튜브,
                {"\n"}
                조회수 말고 구조로 만드십시오.
              </h1>

              <p className="max-w-[48ch] whitespace-pre-line text-lg leading-[1.85] text-black/70 md:text-xl">
                유튜브에 월 수백을 쓰고도
                {"\n"}
                상담이 늘지 않는 이유는
                {"\n"}
                콘텐츠가 아니라 구조입니다.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#contact"
                  className="rounded-xl bg-[#21c1a2] px-8 py-4 font-semibold text-black"
                >
                  채널 구조 진단 요청
                </a>

                <a
                  href="#portfolio"
                  className="rounded-xl border border-black/20 px-8 py-4 font-semibold text-black"
                >
                  포트폴리오 보기
                </a>
              </div>
            </div>

            <div className="h-full space-y-6 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
              <SectionLabel>[ MEDIA EXECUTION ]</SectionLabel>

              <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/10">
                <Image
                  src="/images/showreel-cover.jpg"
                  alt="Turnkeyhaus Media Execution"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>

              <p className="whitespace-pre-line text-sm leading-[1.85] text-black/60">
                컨설팅은 말로,
                {"\n"}
                실행은 시스템으로 증명합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.problem.label} title={content.problem.h2} lead={content.problem.lead} />

          {content.problem.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-3">
                {content.problem.items.map((item) => (
                  <li
                    key={item}
                    className="whitespace-pre-line rounded-2xl border border-black/10 bg-[#fbfcfb] px-5 py-4 text-sm text-black/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-6">
                <p className="max-w-2xl whitespace-pre-line text-base leading-[1.85] font-semibold text-[#0B0F0E] md:text-lg">
                  {content.problem.emphasis}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-6">
              <p className="max-w-2xl whitespace-pre-line text-base leading-[1.85] font-semibold text-[#0B0F0E] md:text-lg">
                {content.problem.emphasis}
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="reality-check" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader
            label={content.realityCheck.label}
            title={content.realityCheck.h2}
            lead={content.realityCheck.lead}
          />

          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-stretch">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-6">
                <p className="max-w-2xl whitespace-pre-line text-base font-semibold leading-[1.85] text-[#0B0F0E] md:text-lg">
                  {content.realityCheck.emphasis}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6">
                <p className={`${bodyCopy} max-w-2xl`}>{content.realityCheck.body}</p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-black/10 bg-[#fbfcfb] p-6">
              <p className={`${bodyCopy} max-w-2xl`}>{content.realityCheck.ctaLead}</p>

              <ActionLink
                href={content.realityCheck.ctaHref}
                className="inline-flex w-fit rounded-2xl border border-[#1aa98d] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-white"
              >
                {content.realityCheck.ctaLabel}
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.approach.label} title={content.approach.h2} lead={content.approach.lead} />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <ul className="space-y-3">
                {content.approach.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black/72">
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-5">
                <p className="max-w-2xl whitespace-pre-line text-base leading-[1.85] font-semibold text-[#0B0F0E] md:text-lg">
                  {content.approach.keyline}
                </p>
              </div>
            </div>

            <MediaFrame image={content.approach.image} overlayClass="bg-black/8" />
          </div>
        </div>
      </section>

      <section id="professional" className="border-t border-black/10">
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

                <div className="space-y-4 p-5">
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

                  <p className="whitespace-pre-line text-base leading-[1.85] text-black/72 md:text-lg">{card.oneLiner}</p>

                  <ul className="space-y-2 text-sm text-black/72">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="list-inside list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <ActionLink href={card.href} className="text-xs font-semibold text-[#189b82]">
                    {card.ctaLabel} →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.studioProof.label} title={content.studioProof.h2} lead={content.studioProof.lead} />

          <div className="grid gap-5 md:grid-cols-2">
            {content.studioProof.images.map((image) => (
              <div
                key={image.src}
                className="relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-black/5"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>

          {content.studioProof.caption ? (
            <div className="rounded-2xl border border-black/10 bg-[#fbfcfb] px-5 py-4">
              <p className={`${bodyCopy} max-w-2xl`}>{content.studioProof.caption}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section id="portfolio" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <div className="max-w-2xl space-y-4">
            <SectionLabel>{content.portfolio.h2}</SectionLabel>
            <p className={`${bodyCopy} max-w-2xl`}>{content.portfolio.lead}</p>
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

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#0B0F0E]">{item.title}</h3>
                    <span className="shrink-0 rounded-full border border-[#21c1a2]/35 bg-[#21c1a2]/15 px-2.5 py-1 text-xs font-semibold text-[#127763]">
                      {item.result}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-base leading-[1.85] text-black/72 md:text-lg">{item.oneLiner}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className={clsTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ActionLink href={item.href} className="text-xs font-semibold text-black/65">
                    영상 보기 →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.pricing.label} title={content.pricing.h2} />

          <div className="grid gap-4 md:grid-cols-3">
            {content.pricing.levels.map((level) => (
              <article key={level.title} className="rounded-2xl border border-black/10 bg-white p-5 md:p-6">
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

                <p className="mt-5 border-t border-black/10 pt-4 text-xs leading-relaxed text-black/55">
                  {level.target}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-6">
            <p className="max-w-2xl whitespace-pre-line text-base font-semibold leading-[1.85] text-[#0B0F0E] md:text-lg">
              {content.pricing.emphasis}
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="mb-10 max-w-2xl space-y-6">
            <SectionLabel>{content.contact.label}</SectionLabel>
            <h2 className="whitespace-pre-line text-3xl font-semibold leading-[1.2] tracking-tight text-[#0B0F0E] md:text-4xl">
              {content.contact.h2}
            </h2>
            <p className={`${bodyCopy} max-w-2xl`}>{content.contact.lead}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div className="space-y-8 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold tracking-tight text-[#0B0F0E]">채널 구조 진단</h3>
                <p className="whitespace-pre-line text-base leading-[1.85] text-black/70">
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

              <p className="text-xs leading-[1.85] text-black/50">
                제작 견적이 아니라 구조 진단이 먼저입니다.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex rounded-xl border border-[#1aa98d] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black"
                >
                  설문 작성하기
                </a>

                {hasFormShareUrl ? (
                  <a
                    href={formShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black"
                  >
                    새 창으로 열기
                  </a>
                ) : null}
              </div>
            </div>

            <div
              id="contact-form"
              className="overflow-hidden rounded-2xl border border-black/10 bg-white"
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

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 text-xs text-black/65">
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
