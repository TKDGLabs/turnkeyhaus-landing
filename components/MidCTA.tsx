import { content } from "../content";

const isHttpUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://");

export default function MidCTA() {
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoHref = content.contact.kakaoChatUrl.trim();
  const hasPhone = phoneHref.startsWith("tel:");
  const hasKakao = isHttpUrl(kakaoHref);

  if (!hasPhone && !hasKakao) return null;

  return (
    <section className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-6 lg:px-8 md:py-16">
        <div className="grid gap-6 rounded-[24px] border border-black/10 bg-[#f8fbfa] p-6 shadow-[0_10px_28px_rgba(11,15,14,0.04)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="space-y-2">
            <div className="text-sm font-medium tracking-[0.01em] text-black/56 md:text-base">{content.contact.midCtaEyebrow}</div>
            <div className="text-lg font-semibold tracking-tight leading-[1.35] text-[#0B0F0E] md:text-[24px]">
              {content.contact.midCtaTitle}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 md:justify-end">
            {hasPhone ? (
              <a
                href={phoneHref}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-4 text-sm font-semibold text-black transition-colors hover:border-black/25 hover:bg-black/[0.02]"
              >
                {content.contact.quickCallLabel} · {content.contact.phoneDisplay}
              </a>
            ) : null}

            {hasKakao ? (
              <a
                href={kakaoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
              >
                {content.contact.kakaoCtaLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
