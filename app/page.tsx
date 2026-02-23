import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content } from "../content";

const clsCard =
  "group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-black/20";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[#f8faf9] transition-colors hover:border-black/20";
const clsTag = "rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/70";

const showreelMp4Path = content.hero.showreel.mp4Src.replace(/^\//, "");
const hasShowreelVideo = existsSync(path.join(process.cwd(), "public", showreelMp4Path));

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

function SectionHeader({
  label,
  title,
  lead
}: {
  label: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="mb-8 grid gap-2 md:mb-10">
      <div className="text-xs font-semibold tracking-[0.14em] text-black/55">{label}</div>
      <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[#0B0F0E] md:text-3xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-black/70 md:text-base">{lead}</p>
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

function ShowreelCard() {
  const showreel = content.hero.showreel;
  if (!showreel.enabled) {
    return null;
  }

  return (
    <aside className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-[0.12em] text-black/60">[ SHOWREEL ]</span>
        <span className="text-xs text-black/45">{showreel.label}</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[#f6f8f7]">
        <Image
          src={showreel.fallback.src}
          alt={showreel.fallback.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 35vw"
        />

        {hasShowreelVideo ? (
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
            <source src={showreel.mp4Src} type="video/mp4" />
          </video>
        ) : null}

        <div className="absolute inset-0 bg-black/15" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-black/55">{showreel.note}</p>
    </aside>
  );
}

function isGoogleFormEmbedUrl(url: string) {
  return (
    url.startsWith("https://docs.google.com/forms/d/e/") &&
    url.includes("/viewform?embedded=true")
  );
}

export default function Page() {
  const formEmbedUrl = content.contact.googleFormEmbedUrl.trim();
  const hasFormEmbedUrl = isGoogleFormEmbedUrl(formEmbedUrl);

  return (
    <main id="top" className="min-h-screen bg-white text-[#0B0F0E]">
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

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-start">
          <div className="rounded-2xl border border-black/10 bg-white p-8 md:p-12">
            <div className="text-xs font-semibold tracking-[0.14em] text-black/55">{content.hero.label}</div>

            <h1 className="mt-5 whitespace-pre-line text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#0B0F0E] md:text-6xl">
              {content.hero.h1}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#0B0F0E] md:text-xl">{content.hero.sub}</p>

            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-black/65 md:text-base">{content.hero.body}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {content.hero.ctas.map((cta) => (
                <ActionLink
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className={
                    cta.variant === "primary"
                      ? "rounded-2xl border border-[#1aa98d] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-white"
                      : "rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-[#0B0F0E]"
                  }
                >
                  {cta.label}
                </ActionLink>
              ))}
            </div>
          </div>

          <ShowreelCard />
        </div>
      </section>

      <section id="problem" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader label={content.problem.label} title={content.problem.h2} lead={content.problem.lead} />

          <div className="grid gap-4 md:grid-cols-2">
            <ul className="grid gap-3">
              {content.problem.items.map((item) => (
                <li key={item} className="rounded-2xl border border-black/10 bg-[#fbfcfb] px-5 py-4 text-sm text-black/70">
                  {item}
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-[#21c1a2]/40 bg-[#21c1a2]/10 p-6">
              <p className="text-base font-semibold text-[#0B0F0E]">{content.problem.emphasis}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="structure" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader label={content.structure.label} title={content.structure.h2} lead={content.structure.lead} />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="grid gap-3">
              {content.structure.bullets.map((bullet) => (
                <div key={bullet} className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black/72">
                  {bullet}
                </div>
              ))}
            </div>

            <MediaFrame image={content.structure.image} overlayClass="bg-black/8" />
          </div>
        </div>
      </section>

      <section id="professional" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader
            label={content.professionalTargets.label}
            title={content.professionalTargets.h2}
            lead={content.professionalTargets.lead}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {content.professionalTargets.cards.map((card) => (
              <article key={card.title} className={clsCard}>
                <MediaFrame image={card.image} sizes="(max-width: 768px) 100vw, 33vw" overlayClass="bg-black/12" />

                <div className="grid gap-3 p-5">
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

                  <p className="text-sm leading-relaxed text-black/72">{card.oneLiner}</p>

                  <ul className="grid gap-2 text-sm text-black/72">
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
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader label={content.studioProof.label} title={content.studioProof.h2} lead={content.studioProof.lead} />

          <div className="grid gap-5 md:grid-cols-2">
            {content.studioProof.images.map((image) => (
              <MediaFrame key={image.src} image={image} overlayClass="bg-black/8" />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfcfb] px-5 py-4 text-sm text-black/70">
            {content.studioProof.caption}
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader label={content.portfolio.label} title={content.portfolio.h2} lead={content.portfolio.lead} />

          <div className="grid gap-5 md:grid-cols-3">
            {content.portfolio.items.map((item) => (
              <article key={item.title} className={clsCard}>
                <MediaFrame image={item.image} sizes="(max-width: 768px) 100vw, 33vw" overlayClass="bg-black/10" />

                <div className="grid gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#0B0F0E]">{item.title}</h3>
                    <span className="shrink-0 rounded-full border border-[#21c1a2]/35 bg-[#21c1a2]/15 px-2.5 py-1 text-xs font-semibold text-[#127763]">
                      {item.result}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-black/72">{item.oneLiner}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className={clsTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ActionLink href={item.href} className="text-xs font-semibold text-black/65">
                    {item.ctaLabel} →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeader label={content.contact.label} title={content.contact.h2} lead={content.contact.lead} />

          <div className="grid gap-5 md:grid-cols-[1fr_460px] md:items-start">
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/72">
              <h3 className="text-base font-semibold text-[#0B0F0E]">{content.contact.panelTitle}</h3>
              <p className="mt-2 leading-relaxed">{content.contact.panelBody}</p>
              <div className="mt-4 rounded-2xl border border-black/10 bg-[#fbfcfb] p-4 text-xs text-black/55">
                {content.contact.panelHint}
              </div>

              {hasFormEmbedUrl ? (
                <ActionLink
                  href={formEmbedUrl}
                  className="mt-5 inline-flex rounded-2xl border border-[#1aa98d] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-white"
                >
                  {content.contact.primaryCtaLabel}
                </ActionLink>
              ) : (
                <div className="mt-5 inline-flex rounded-2xl border border-black/10 bg-[#f2f4f3] px-5 py-3 text-sm font-semibold text-black/45">
                  임베드 URL 등록 필요
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              {hasFormEmbedUrl ? (
                <iframe
                  src={formEmbedUrl}
                  className="h-[760px] w-full"
                  loading="lazy"
                  title={content.contact.iframeTitle}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="grid h-[360px] place-items-center p-6 text-center text-sm leading-relaxed text-black/60">
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
          <div className="grid gap-1">
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
