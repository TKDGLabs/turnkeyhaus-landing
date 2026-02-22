import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";

function getEmbeddedFormUrl(formUrl: string) {
  const hasQuery = formUrl.includes("?");
  const hasEmbedParam = formUrl.includes("embedded=true");

  if (hasEmbedParam) {
    return formUrl;
  }

  return `${formUrl}${hasQuery ? "&" : "?"}embedded=true`;
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

type ActionLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
};

function ActionLink({ href, className, children, ariaLabel }: ActionLinkProps) {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function HeroVideoBg() {
  const video = content.heroVideo;
  if (!video.enabled || !video.youtubeId) {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    loop: "1",
    playlist: video.youtubeId
  });

  if (video.start > 0) {
    params.set("start", String(video.start));
  }

  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-[#041411]/70" />
      <iframe
        className="h-full w-full scale-[1.15]"
        src={`https://www.youtube.com/embed/${video.youtubeId}?${params.toString()}`}
        title={content.ui.heroVideoTitle}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={false}
        loading="lazy"
      />
    </div>
  );
}

type SectionHeadingProps = {
  index: string;
  title: string;
  subtitle: string;
};

function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="section-label">{index}</span>
      <div className="space-y-1">
        <h2>{title}</h2>
        <p className="text-sm text-[color:var(--muted)] md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const embeddedFormUrl = getEmbeddedFormUrl(content.sections.contact.formUrl);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(4,20,17,0.92)] backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <Link
            href="#hero"
            className="brand-mark"
            aria-label={`${content.site.name} ${content.ui.scrollToTopAriaLabel}`}
          >
            {content.site.name}
          </Link>
          <nav
            aria-label={content.ui.navigationAriaLabel}
            className="flex max-w-[70%] items-center gap-1 overflow-x-auto py-1 md:max-w-none md:gap-2"
          >
            {content.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section id="hero" className="container-shell pb-16 pt-14 md:pb-24 md:pt-20">
          <article className="panel hero-panel hero-panel-video relative overflow-hidden rounded-2xl border border-white/10 bg-[#041411] p-8 md:p-16">
            <HeroVideoBg />
            <div className="relative z-10 max-w-4xl">
              <p className="eyebrow">{content.hero.label}</p>
              <h1 className="hero-title">{content.hero.headline}</h1>
              <p className="hero-subtitle">{content.hero.subheadline}</p>
              <p className="hero-description">{content.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {content.hero.ctas.map((cta) => (
                  <ActionLink
                    key={`${cta.href}-${cta.label}`}
                    href={cta.href}
                    className={cta.variant === "primary" ? "btn-primary" : "btn-secondary"}
                  >
                    {cta.label}
                  </ActionLink>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section id={content.sections.problem.id} className="section-shell">
          <SectionHeading
            index={content.sections.problem.index}
            title={content.sections.problem.title}
            subtitle={content.sections.problem.subtitle}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {content.sections.problem.items.map((item) => (
              <article key={item} className="panel card-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
          <p className="key-line">{content.sections.problem.emphasis}</p>
        </section>

        <section id={content.sections.process.id} className="section-shell">
          <SectionHeading
            index={content.sections.process.index}
            title={content.sections.process.title}
            subtitle={content.sections.process.subtitle}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {content.sections.process.steps.map((step) => (
              <article key={step.step} className="panel">
                <p className="step-index">{step.step}</p>
                <h3 className="card-title">{step.title}</h3>
                <p className="card-text">{step.description}</p>
              </article>
            ))}
          </div>
          <p className="key-line">{content.sections.process.emphasis}</p>
        </section>

        <section id={content.sections.brandStructure.id} className="section-shell">
          <SectionHeading
            index={content.sections.brandStructure.index}
            title={content.sections.brandStructure.title}
            subtitle={content.sections.brandStructure.subtitle}
          />
          <div className="grid items-stretch gap-5 md:grid-cols-2">
            <article className="panel flex flex-col justify-between">
              <div className="space-y-4">
                {content.sections.brandStructure.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="card-text">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="key-line mt-6">{content.sections.brandStructure.emphasis}</p>
            </article>
            <figure className="group">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20">
                <Image
                  src={content.sections.brandStructure.image.src}
                  alt={content.sections.brandStructure.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[#041411]/60" />
              </div>
            </figure>
          </div>
        </section>

        <section id={content.sections.professionalTargets.id} className="section-shell">
          <SectionHeading
            index={content.sections.professionalTargets.index}
            title={content.sections.professionalTargets.title}
            subtitle={content.sections.professionalTargets.subtitle}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {content.sections.professionalTargets.cards.map((card) => (
              <article
                key={card.title}
                className="panel group overflow-hidden border border-white/10 p-0 transition-colors hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-[#041411]/60" />
                </div>
                <div className="space-y-4 p-5 md:p-6">
                  <h3 className="card-title mb-0">{card.title}</h3>
                  <p className="card-text">{card.oneLiner}</p>
                  <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="list-line py-2 text-sm">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <ActionLink href={card.href} className="btn-secondary w-full">
                    {card.hrefLabel}
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id={content.sections.studioProof.id} className="section-shell">
          <SectionHeading
            index={content.sections.studioProof.index}
            title={content.sections.studioProof.title}
            subtitle={content.sections.studioProof.subtitle}
          />
          <p className="card-text mb-6">{content.sections.studioProof.description}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {content.sections.studioProof.items.map((item) => (
              <figure
                key={item.image.src}
                className="group overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-[#041411]/60" />
                </div>
                <figcaption className="space-y-1 border-t border-white/10 bg-[#041411] p-4">
                  <p className="text-sm text-white">{item.captionTop}</p>
                  <p className="text-xs text-[color:var(--muted)]">{item.captionBottom}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id={content.sections.differentiation.id} className="section-shell">
          <SectionHeading
            index={content.sections.differentiation.index}
            title={content.sections.differentiation.title}
            subtitle={content.sections.differentiation.subtitle}
          />
          <div className="grid items-start gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <article className="panel">
              <h3 className="card-title">{content.sections.differentiation.headline}</h3>
              <div className="space-y-4">
                {content.sections.differentiation.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="card-text">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="key-line mt-6">{content.sections.differentiation.emphasis}</p>
            </article>
            <figure className="group mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={content.sections.differentiation.image.src}
                  alt={content.sections.differentiation.image.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[#041411]/60" />
              </div>
            </figure>
          </div>
        </section>

        <section id={content.sections.portfolio.id} className="section-shell">
          <SectionHeading
            index={content.sections.portfolio.index}
            title={content.sections.portfolio.title}
            subtitle={content.sections.portfolio.subtitle}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {content.sections.portfolio.items.map((item) => (
              <article
                key={`${item.title}-${item.href}`}
                className="panel group overflow-hidden border border-white/10 p-0 transition-colors hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden border-b border-white/10">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041411]/70 to-transparent" />
                </div>
                <div className="space-y-4 p-5 md:p-6">
                  <h3 className="card-title mb-0">{item.title}</h3>
                  <p className="card-text">{item.oneLiner}</p>
                  <p className="list-line text-sm">{item.metric}</p>
                  <ActionLink href={item.href} className="btn-secondary w-full">
                    {item.linkLabel}
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id={content.sections.about.id} className="section-shell">
          <SectionHeading
            index={content.sections.about.index}
            title={content.sections.about.title}
            subtitle={content.sections.about.subtitle}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {content.sections.about.relation.map((item) => (
              <article key={item.org} className="panel">
                <p className="step-index">{item.org}</p>
                <h3 className="card-title">{item.role}</h3>
                <p className="card-text">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id={content.sections.contact.id} className="section-shell">
          <SectionHeading
            index={content.sections.contact.index}
            title={content.sections.contact.title}
            subtitle={content.sections.contact.subtitle}
          />
          <article className="panel space-y-5">
            <p className="hero-subtitle">{content.sections.contact.body}</p>
            <div className="form-shell">
              <iframe
                src={embeddedFormUrl}
                title={content.sections.contact.subtitle}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-[600px] w-full"
              />
            </div>
            <ActionLink href={content.sections.contact.formUrl} className="btn-primary inline-flex">
              {content.sections.contact.buttonLabel}
            </ActionLink>
          </article>
        </section>
      </main>

      <footer className="container-shell border-t border-white/10 py-10">
        <p className="footer-company">{content.footer.company}</p>
        <div className="footer-grid">
          <p>
            {content.ui.footerLabels.ceo}: {content.footer.ceo}
          </p>
          <p>
            {content.ui.footerLabels.businessNumber}: {content.footer.businessNumber}
          </p>
          <p>
            {content.ui.footerLabels.corporateNumber}: {content.footer.corporateNumber}
          </p>
          <p>
            {content.ui.footerLabels.address}: {content.footer.address}
          </p>
          <p>
            {content.ui.footerLabels.email}:{" "}
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
          </p>
          <p>
            {content.ui.footerLabels.tel}:{" "}
            <a href={`tel:${content.footer.tel.replaceAll("-", "")}`}>{content.footer.tel}</a>
          </p>
        </div>
      </footer>
    </>
  );
}
