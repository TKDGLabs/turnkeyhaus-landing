import Image from "next/image";
import Link from "next/link";
import { content } from "../content";

const clsCard =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20";
const clsMedia =
  "relative aspect-video overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20";
const clsOverlay = "absolute inset-0 bg-[#041411]/60";

function SectionHeader({ h2, lead }: { h2: string; lead?: string }) {
  return (
    <div className="mb-6 grid gap-2">
      <div className="text-xs font-semibold tracking-[0.14em] text-white/60">{h2}</div>
      {lead ? <div className="text-sm leading-relaxed text-white/70">{lead}</div> : null}
    </div>
  );
}

function MediaFrame({
  src,
  alt,
  overlay = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  scaleClass = "group-hover:scale-[1.02]"
}: {
  src: string;
  alt: string;
  overlay?: boolean;
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
      {overlay ? <div className={clsOverlay} /> : null}
    </div>
  );
}

function Showreel() {
  const sr = content.hero.showreel;
  if (!sr.enabled) return null;

  // mp4가 없을 경우를 대비해 fallback 이미지 제공
  // (mp4 파일이 실제로 존재하면 video가 정상 재생됨)
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold tracking-[0.14em] text-white/60">[ MEDIA ]</div>
        <div className="text-xs text-white/50">{sr.label}</div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-[#041411]/55" />

        {/* video는 파일이 없으면 404이지만, 페이지는 깨지지 않음.
            실제 운영에서는 public/videos/showreel.mp4 를 넣는 것을 권장 */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={sr.mp4Src}
        />

        {/* fallback image: 영상이 없어도 분위기 유지 */}
        <Image
          src={sr.fallbackImageSrc}
          alt="showreel fallback"
          fill
          className="object-cover opacity-60"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={false}
        />

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="text-xs text-white/70">{sr.note}</div>
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
          {content.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-xl px-3 py-2 text-xs text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-5 pb-12 pt-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-10">
            {content.hero.backgroundGridEnabled ? (
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(33,193,162,0.18),transparent_55%),radial-gradient(circle_at_100%_10%,rgba(33,193,162,0.12),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
            ) : null}

            <div className="relative z-10 grid gap-5">
              <div className="text-xs font-semibold tracking-[0.14em] text-white/60">
                {content.hero.eyebrow}
              </div>

              <h1 className="whitespace-pre-line text-4xl font-semibold leading-[1.06] tracking-[-0.02em] md:text-5xl">
                {content.hero.h1}
              </h1>

              <p className="text-base leading-relaxed text-white/80 md:text-lg">{content.hero.sub}</p>

              <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">{content.hero.body}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                {content.hero.ctas.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className={
                      c.variant === "primary"
                        ? "rounded-xl bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black"
                        : "rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white"
                    }
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Showreel />
        </div>
      </section>

      <section id="problem" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.problem.h2} lead={content.problem.lead} />
          <div className="grid gap-5 md:grid-cols-2">
            <ul className="grid gap-3">
              {content.problem.items.map((it) => (
                <li
                  key={it}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70"
                >
                  {it}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-[#21c1a2]/25 bg-[#21c1a2]/10 p-6">
              <div className="text-sm leading-relaxed text-white">
                <b>{content.problem.emphasis}</b>
              </div>
              <div className="mt-3 text-xs leading-relaxed text-white/70">
                컨설팅 관점에서 설계하고, 미디어 조직으로 실행합니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="structure" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.brandStructure.h2} lead={content.brandStructure.lead} />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="grid gap-3">
              {content.brandStructure.bullets.map((b) => (
                <div
                  key={b}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70"
                >
                  {b}
                </div>
              ))}
            </div>

            <MediaFrame src={content.brandStructure.imageSrc} alt="brand structure concept" />
          </div>
        </div>
      </section>

      <section id="professional" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.professionalTargets.h2} lead={content.professionalTargets.lead} />

          <div className="grid gap-5 md:grid-cols-3">
            {content.professionalTargets.cards.map((c) => (
              <a key={c.title} href={c.href} className={clsCard}>
                <MediaFrame src={c.imageSrc} alt={c.title} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="grid gap-3 p-5">
                  <div className="text-base font-semibold">{c.title}</div>
                  <div className="text-sm leading-relaxed text-white/70">{c.oneLiner}</div>
                  <ul className="grid gap-2 text-sm text-white/70">
                    {c.bullets.map((b) => (
                      <li key={b} className="list-inside list-disc">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold text-[#21c1a2]">구조 진단 요청 →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.studioProof.h2} lead={content.studioProof.lead} />

          <div className="grid gap-5 md:grid-cols-2">
            {content.studioProof.images.map((im) => (
              <MediaFrame key={im.src} src={im.src} alt={im.alt} />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70">
            {content.studioProof.caption}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.differentiation.h2} />
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="grid gap-4">
              <div className="text-2xl font-semibold">{content.differentiation.title}</div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                {content.differentiation.body}
              </div>
              <ul className="grid gap-2 text-sm text-white/70">
                {content.differentiation.bullets.map((b) => (
                  <li key={b} className="list-inside list-disc">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <MediaFrame
              src={content.differentiation.imageSrc}
              alt="differentiation concept"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.portfolio.h2} lead={content.portfolio.lead} />

          <div className="grid gap-5 md:grid-cols-3">
            {content.portfolio.items.map((it) => (
              <a key={it.title} href={it.href} target="_blank" rel="noreferrer" className={clsCard}>
                <MediaFrame
                  src={it.imageSrc}
                  alt={`${it.title} 썸네일`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  scaleClass="group-hover:scale-[1.03]"
                />
                <div className="grid gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-base font-semibold">{it.title}</div>
                    <div className="shrink-0 rounded-full bg-[#21c1a2]/20 px-2 py-1 text-xs font-semibold text-[#21c1a2]">
                      {it.result}
                    </div>
                  </div>
                  <div className="text-sm text-white/70">{it.oneLiner}</div>
                  <div className="flex flex-wrap gap-2">
                    {it.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-white/60">채널 보기 →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.pricing.h2} />
          <div className="grid gap-3 md:grid-cols-3">
            {content.pricing.lines.map((l) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70">
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeader h2={content.contact.h2} lead={content.contact.lead} />

          <div className="grid gap-5 md:grid-cols-[1fr_420px] md:items-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70">
              <div className="text-base font-semibold text-white">{content.contact.primaryCtaLabel}</div>
              <div className="mt-2 leading-relaxed">
                아래 폼을 작성해주시면, 채널 구조 관점에서 빠르게 확인 후 회신드립니다.
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/60">
                * Google Form 임베드 URL은 content.ts에서 교체 가능합니다.
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <iframe
                src={content.contact.googleFormEmbedUrl}
                className="h-[780px] w-full"
                loading="lazy"
                title="Turnkeyhaus 상담 폼"
              />
            </div>
          </div>

          <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60">
            <div className="grid gap-1">
              <div className="text-white/80">{content.footer.companyName}</div>
              <div>대표자: {content.footer.ceo}</div>
              <div>사업자등록번호: {content.footer.bizNo}</div>
              <div>법인등록번호: {content.footer.corpNo}</div>
              <div>주소: {content.footer.address}</div>
              <div>Email: {content.footer.email}</div>
              <div>Tel: {content.footer.tel}</div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
