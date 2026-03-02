import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { content } from "../content";

const SplineHero = dynamic(() => import("../components/SplineHero"), { ssr: false });

const clsCard =
  "group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-black/20";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[#f8faf9] transition-colors hover:border-black/20";
const clsTag = "rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/70";
const sectionShell = "mx-auto max-w-6xl px-5 py-16 md:py-20";
const sectionStack = "space-y-6 md:space-y-8";
const bodyCopy = "max-w-[52ch] whitespace-pre-line text-base leading-[1.95] text-black/72 md:text-lg";
const sectionLabelClass = "text-sm font-semibold tracking-[0.14em] text-black/45 md:text-base";
const sectionTitleClass =
  "max-w-[22ch] whitespace-pre-line text-3xl font-semibold leading-[1.28] tracking-tight text-[#0B0F0E] md:text-4xl md:leading-[1.26]";

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
    <div className="max-w-[52ch] space-y-4">
      <SectionLabel>{label}</SectionLabel>
      <h2 className={sectionTitleClass}>
        {title}
      </h2>
      {lead ? <p className={bodyCopy}>{lead}</p> : null}
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
  const [problemSupport = "", problemDetail = ""] = content.problem.lead.split("\n\n");
  const proofImage = content.studioProof.images[0] ?? {
    src: "/images/showreel-cover.jpg",
    alt: "Turnkeyhaus 실행 기반 대표 이미지"
  };

  return (
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="#top" className="flex h-11 shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="Turnkeyhaus"
              width={164}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1.5">
              {content.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold tracking-[0.02em] text-black/72 transition-colors hover:bg-black/[0.03] hover:text-black"
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
        <div className="relative mx-auto w-full max-w-[1920px] aspect-square md:aspect-[16/9]">
          <SplineHero />
          <div className="pointer-events-none absolute inset-0 z-0 md:hidden">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/mobile-hero-cover.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section id="strategy-frame" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.strategyFrame.label} title={content.strategyFrame.h2} />

          <div className="grid gap-4 md:grid-cols-4">
            {content.strategyFrame.steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-black/10 bg-white p-5 md:p-6">
                <div className="text-sm font-semibold tracking-[0.08em] text-black/45">{`0${index + 1}`}</div>
                <h3 className="mt-3 text-lg font-semibold text-[#0B0F0E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.95] text-black/70">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="problem" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="space-y-10">
            <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12">
              <div className="space-y-8">
                <SectionLabel>{content.problem.label}</SectionLabel>
                <h2 className={sectionTitleClass}>
                  {content.problem.h2}
                </h2>

                <p className="max-w-[55ch] whitespace-pre-line text-base leading-[2] text-black/75 md:text-lg">
                  {problemSupport}
                </p>

                <p className="max-w-[55ch] whitespace-pre-line text-base leading-[2] text-black/75 md:text-lg">
                  {problemDetail}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-4 md:p-6">
                <Image
                  src="/images/reality-illustration.png"
                  alt="문제와 현실 점검 일러스트"
                  width={1200}
                  height={1200}
                  className="w-full h-auto max-h-56 object-contain md:max-h-[420px]"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#21c1a2]/30 bg-[#21c1a2]/10 p-6">
              <p className="text-base font-semibold leading-[1.95] text-black md:text-lg">
                {content.problem.emphasis}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="border-t border-black/10">
        <div className={`${sectionShell} ${sectionStack}`}>
          <SectionHeader label={content.approach.label} title={content.approach.h2} lead={content.approach.lead} />

          <div className="grid gap-4 md:grid-cols-2">
            {content.approach.steps.map((step) => (
              <article key={step.title} className="rounded-2xl border border-black/10 bg-white p-5 md:p-6">
                <h3 className="text-lg font-semibold text-[#0B0F0E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.95] text-black/72">{step.detail}</p>
              </article>
            ))}
          </div>

          <p className="max-w-[52ch] whitespace-pre-line text-base font-semibold leading-[1.95] text-black/80 md:text-lg">
            {content.approach.keyline}
          </p>
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

                  <p className="whitespace-pre-line text-base leading-[1.95] text-black/72 md:text-lg">{card.oneLiner}</p>

                  <ul className="space-y-2 text-sm text-black/72">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="list-inside list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <ActionLink href={card.href} className="text-xs font-semibold text-[#21c1a2]">
                    {card.ctaLabel} →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl space-y-8 px-5 py-20 md:grid md:grid-cols-[1fr_0.9fr] md:items-start md:gap-10 md:space-y-0 md:py-24">
          <div className="space-y-6">
            <SectionLabel>{content.studioProof.label}</SectionLabel>
            <h2 className={sectionTitleClass}>
              {content.studioProof.h2}
            </h2>
            <p className={bodyCopy}>{content.studioProof.crewLead}</p>

            <ul className="space-y-3">
              {content.studioProof.operationSystem.map((item) => (
                <li key={item} className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm leading-[1.95] text-black/75">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:pt-2">
            <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[20px] border border-black/10 md:ml-auto">
              <Image
                src={proofImage.src}
                alt={proofImage.alt}
                width={1600}
                height={1067}
                className="block w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-black/10">
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

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#0B0F0E]">{item.title}</h3>
                    <span className="shrink-0 rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-semibold text-black/70">
                      {item.result}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-base leading-[1.95] text-black/72 md:text-lg">{item.oneLiner}</p>

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
            {content.pricing.levels.map((level) => {
              const targetText = level.target.replace(/^대상:\s*/, "");

              return (
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

                  <p className="mt-5 border-t border-black/10 pt-4 text-sm leading-[1.9] text-black/65 md:text-base">
                    <span className="font-medium text-black/72">대상:</span>
                    <br />
                    <span>{targetText}</span>
                  </p>
                </article>
              );
            })}
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="max-w-[52ch] whitespace-pre-line text-base font-semibold leading-[1.95] text-black/80 md:text-lg">
              {content.pricing.emphasis}
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="mb-10 max-w-[52ch] space-y-6">
            <SectionLabel>{content.contact.label}</SectionLabel>
            <h2 className={sectionTitleClass}>
              {content.contact.h2}
            </h2>
            <p className={bodyCopy}>{content.contact.lead}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div className="space-y-8 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
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

              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black"
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
