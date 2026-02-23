import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content } from "../content";

const clsCard =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20";
const clsMedia =
  "group relative aspect-video overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20";
const clsOverlay = "absolute inset-0 bg-[#041411]/60";

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
  h2,
  lead
}: {
  label: string;
  h2: string;
  lead?: string;
}) {
  return (
    <div className="mb-6 grid gap-2 md:mb-8">
      <div className="text-xs font-semibold tracking-[0.14em] text-white/60">{label}</div>
      <h2 className="text-2xl font-semibold tracking-[-0.01em] md:text-3xl">{h2}</h2>
      {lead ? <div className="text-sm leading-relaxed text-white/70 md:text-base">{lead}</div> : null}
    </div>
  );
}

function MediaFrame({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  scaleClass = "group-hover:scale-[1.02]"
}: {
  src: string;
  alt: string;
  sizes?: string;
  scaleClass?: string;
}) {
  return (
    <div className={clsMedia}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-300 ${scaleClass}`}
        sizes={sizes}
      />
      <div className={clsOverlay} />
    </div>
  );
}

function Showreel() {
  const showreel = content.hero.showreel;
  if (!showreel.enabled) {
    return null;
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold tracking-[0.14em] text-white/60">{showreel.badge}</div>
        <div className="text-xs text-white/50">{showreel.label}</div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={showreel.fallback.src}
          alt={showreel.fallback.alt}
          fill
          className="object-cover opacity-65"
          sizes="(max-width: 768px) 100vw, 40vw"
        />

        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={showreel.fallback.src}
        >
          <source src={showreel.mp4Src} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#041411]/55" />

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="text-xs text-white/70">{showreel.note}</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#041411] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="#top" className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-[0.06em]">{content.brand.name}</span>
          <span className="text-xs text-white/60">{content.brand.sub}</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {content.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-xs text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-5 pb-12 pt-6 md:pb-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-10">
            {content.hero.backgroundGridEnabled ? (
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(33,193,162,0.18),transparent_55%),radial-gradient(circle_at_100%_10%,rgba(33,193,162,0.12),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
            ) : null}

            <div className="relative z-10 grid gap-5">
              <div className="text-xs font-semibold tracking-[0.14em] text-white/60">{content.hero.label}</div>

              <h1 className="whitespace-pre-line text-4xl font-semibold leading-[1.06] tracking-[-0.02em] md:text-6xl">
                {content.hero.h1}
              </h1>

              <p className="text-base leading-relaxed text-white/80 md:text-lg">{content.hero.sub}</p>

              <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">{content.hero.body}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                {content.hero.ctas.map((cta) => (
                  <ActionLink
                    key={`${cta.href}-${cta.label}`}
                    href={cta.href}
                    className={
                      cta.variant === "primary"
                        ? "rounded-xl bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black"
                        : "rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white"
                    }
                  >
                    {cta.label}
                  </ActionLink>
                ))}
              </div>
            </div>
          </div>

          <Showreel />
        </div>
      </section>

      <section id="problem" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader label={content.problem.label} h2={content.problem.h2} lead={content.problem.lead} />

          <div className="grid gap-5 md:grid-cols-2">
            <ul className="grid gap-3">
              {content.problem.items.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-[#21c1a2]/25 bg-[#21c1a2]/10 p-6">
              <div className="text-sm leading-relaxed text-white">
                <strong>{content.problem.emphasis}</strong>
              </div>
              <div className="mt-3 text-xs leading-relaxed text-white/70">{content.problem.support}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="structure" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader
            label={content.brandStructure.label}
            h2={content.brandStructure.h2}
            lead={content.brandStructure.lead}
          />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="grid gap-3">
              {content.brandStructure.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70"
                >
                  {bullet}
                </div>
              ))}
            </div>

            <MediaFrame src={content.brandStructure.image.src} alt={content.brandStructure.image.alt} />
          </div>
        </div>
      </section>

      <section id="professional" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader
            label={content.professionalTargets.label}
            h2={content.professionalTargets.h2}
            lead={content.professionalTargets.lead}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {content.professionalTargets.cards.map((card) => (
              <article key={card.title} className={clsCard}>
                <MediaFrame
                  src={card.image.src}
                  alt={card.image.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="grid gap-3 p-5">
                  <div className="text-base font-semibold">{card.title}</div>
                  <div className="text-sm leading-relaxed text-white/70">{card.oneLiner}</div>
                  {(card.tags ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(card.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <ul className="grid gap-2 text-sm text-white/70">
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

      <section id="proof" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader label={content.studioProof.label} h2={content.studioProof.h2} lead={content.studioProof.lead} />

          <div className="grid gap-5 md:grid-cols-2">
            {content.studioProof.images.map((image) => (
              <MediaFrame key={image.src} src={image.src} alt={image.alt} />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70">
            {content.studioProof.caption}
          </div>
        </div>
      </section>

      <section id="differentiation" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader label={content.differentiation.label} h2={content.differentiation.h2} />

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="grid gap-4">
              <div className="text-2xl font-semibold">{content.differentiation.title}</div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-white/70">{content.differentiation.body}</div>
              <ul className="grid gap-2 text-sm text-white/70">
                {content.differentiation.bullets.map((bullet) => (
                  <li key={bullet} className="list-inside list-disc">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <MediaFrame
              src={content.differentiation.image.src}
              alt={content.differentiation.image.alt}
              sizes="(max-width: 768px) 100vw, 40vw"
              scaleClass="group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader label={content.portfolio.label} h2={content.portfolio.h2} lead={content.portfolio.lead} />

          <div className="grid gap-5 md:grid-cols-3">
            {content.portfolio.items.map((item) => (
              <article key={item.title} className={clsCard}>
                <MediaFrame
                  src={item.image.src}
                  alt={item.image.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  scaleClass="group-hover:scale-[1.03]"
                />

                <div className="grid gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-base font-semibold">{item.title}</div>
                    <div className="shrink-0 rounded-full bg-[#21c1a2]/20 px-2 py-1 text-xs font-semibold text-[#21c1a2]">
                      {item.result}
                    </div>
                  </div>

                  <div className="text-sm text-white/70">{item.oneLiner}</div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ActionLink href={item.href} className="text-xs font-semibold text-white/60">
                    {item.ctaLabel} →
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <SectionHeader label={content.contact.label} h2={content.contact.h2} lead={content.contact.lead} />

          <div className="grid gap-5 md:grid-cols-[1fr_420px] md:items-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70">
              <div className="text-base font-semibold text-white">{content.contact.panelTitle}</div>
              <div className="mt-2 leading-relaxed">{content.contact.panelBody}</div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/60">
                {content.contact.panelHint}
              </div>
              <ActionLink href={content.contact.googleFormEmbedUrl} className="btn-primary mt-5 inline-flex">
                {content.contact.primaryCtaLabel}
              </ActionLink>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <iframe
                src={content.contact.googleFormEmbedUrl}
                className="h-[780px] w-full"
                loading="lazy"
                title={content.contact.iframeTitle}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60">
            <div className="grid gap-1">
              <div className="text-white/80">{content.footer.companyName}</div>
              {content.footer.lines.map((line) => (
                <div key={line.label}>
                  {line.label}: {line.value}
                </div>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
