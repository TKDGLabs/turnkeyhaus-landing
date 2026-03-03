import { content } from "../content";

const isHttpUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://");

export default function MidCTA() {
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoHref = content.contact.kakaoChatUrl.trim();
  const hasPhone = phoneHref.startsWith("tel:");
  const hasKakao = isHttpUrl(kakaoHref);

  if (!hasPhone && !hasKakao) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-sm text-black/60">{content.contact.midCtaEyebrow}</div>
          <div className="text-lg font-semibold tracking-tight text-[#0B0F0E] md:text-xl">
            {content.contact.midCtaTitle}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {hasPhone ? (
            <a
              href={phoneHref}
              className="inline-flex rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:border-black/25 hover:bg-black/[0.02]"
            >
              {content.contact.quickCallLabel} · {content.contact.phoneDisplay}
            </a>
          ) : null}

          {hasKakao ? (
            <a
              href={kakaoHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
            >
              {content.contact.kakaoCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
