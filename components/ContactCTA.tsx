import { content } from "../content";

const isHttpUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://");

export default function ContactCTA() {
  const phoneHref = content.contact.phoneHref.trim();
  const kakaoHref = content.contact.kakaoChatUrl.trim();
  const hasPhone = phoneHref.startsWith("tel:");
  const hasKakao = isHttpUrl(kakaoHref);

  if (!hasPhone && !hasKakao) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <div className="rounded-2xl border border-black/10 bg-white/95 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.10)] backdrop-blur">
          <div className="px-1 pb-2 text-[11px] font-semibold tracking-[0.08em] text-black/45">빠른 상담</div>

          <div className="flex flex-col gap-2">
            {hasKakao ? (
              <a
                href={kakaoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[220px] items-center justify-center rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
                aria-label="카카오톡으로 상담하기"
              >
                {content.contact.kakaoCtaLabel}
              </a>
            ) : null}

            {hasPhone ? (
              <a
                href={phoneHref}
                className="inline-flex min-w-[220px] items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:border-black/25 hover:bg-black/[0.02]"
                aria-label={`전화 상담 ${content.contact.phoneDisplay}`}
              >
                {content.contact.quickCallLabel} · {content.contact.phoneDisplay}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-[1360px] gap-2">
          {hasPhone ? (
            <a
              href={phoneHref}
              className="flex-1 rounded-xl border border-black/15 bg-white py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-black/[0.02]"
              aria-label={`전화 상담 ${content.contact.phoneDisplay}`}
            >
              전화
            </a>
          ) : null}

          {hasKakao ? (
            <a
              href={kakaoHref}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl border border-[#21c1a2] bg-[#21c1a2] py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-[#1db197]"
              aria-label="카카오톡으로 상담하기"
            >
              카카오톡
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
