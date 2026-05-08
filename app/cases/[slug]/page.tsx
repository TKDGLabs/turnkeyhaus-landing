import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { content } from "@/content";

const shell = "mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-10";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type CaseParams = {
  params: {
    slug: string;
  };
};

function getCase(slug: string) {
  return content.portfolio.items.find((item) => item.caseSlug === slug);
}

function formatInteger(n: number) {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

function formatViews(n: number) {
  if (n >= 10000) {
    const tenThousands = n / 10000;
    return `${tenThousands.toFixed(tenThousands % 1 === 0 ? 0 : 1)}만회`;
  }
  return `${formatInteger(n)}회`;
}

export function generateStaticParams() {
  return content.portfolio.items.map((item) => ({ slug: item.caseSlug }));
}

export function generateMetadata({ params }: CaseParams): Metadata {
  const item = getCase(params.slug);

  if (!item) {
    return {
      title: "운영 사례 | Turnkeyhaus"
    };
  }

  const title = `${item.title} 운영 사례 | Turnkeyhaus`;
  const description = `${item.clientName} 사례. ${item.oneLiner} ${item.scope ? `담당 범위: ${item.scope}.` : ""}`;

  return {
    title,
    description,
    keywords: [item.clientName, item.title, ...item.tags, "유튜브 운영 사례", "유튜브 운영대행"],
    alternates: {
      canonical: `${content.seo.siteUrl}/cases/${item.caseSlug}`
    },
    openGraph: {
      title,
      description,
      url: `${content.seo.siteUrl}/cases/${item.caseSlug}`,
      images: [item.imageSrc]
    }
  };
}

export default function CaseStudyPage({ params }: CaseParams) {
  const item = getCase(params.slug);

  if (!item) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${item.title} 운영 사례`,
    headline: item.oneLiner,
    description: `${item.clientName} 유튜브 채널 운영 사례. ${item.scope ?? "채널 운영 범위와 성과를 정리한 사례입니다."}`,
    url: `${content.seo.siteUrl}/cases/${item.caseSlug}`,
    provider: {
      "@type": "Organization",
      name: content.brand.name,
      url: content.seo.siteUrl
    },
    about: item.tags,
    isPartOf: {
      "@type": "WebSite",
      name: content.brand.name,
      url: content.seo.siteUrl
    }
  };

  const caseBlocks = [
    { label: "Before", title: "시작 상태", body: item.before },
    { label: "Action", title: "맡은 범위와 운영 방식", body: item.action },
    { label: "After", title: "운영 결과", body: item.after },
    { label: "Proof", title: "확인 가능한 증거", body: item.proof }
  ].filter((block) => block.body);
  const caseDetails = [
    { label: "운영 기간", value: item.operatingPeriod },
    { label: "월 제작 편성", value: item.monthlyVolume },
    { label: "콘텐츠 포맷", value: item.contentFormats },
    { label: "제목·썸네일·업로드 전략", value: item.distributionStrategy },
    { label: "정성 신호", value: item.qualitativeSignal },
    { label: "운영 원리", value: item.operatingPrinciple }
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <main className="bg-white text-[#0B0F0E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="border-b border-black/10 bg-white">
        <div className={`${shell} flex items-center justify-between py-4`}>
          <Link href="/" className={`inline-flex items-center ${focusRing}`}>
            <Image src="/logo.png" alt="Turnkeyhaus" width={176} height={48} className="h-11 w-auto object-contain" />
          </Link>
          <Link
            href="/#portfolio"
            className={`inline-flex h-10 items-center border border-black/20 px-4 text-sm font-semibold text-black/76 transition-colors hover:bg-black/[0.03] ${focusRing}`}
          >
            사례 목록으로
          </Link>
        </div>
      </header>

      <section className="border-b border-black/12">
        <div className={`${shell} py-14 md:py-20`}>
          <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 운영 사례 ]</p>
          <div className="mt-5 grid gap-8 md:grid-cols-[0.94fr_1.06fr] md:gap-12 md:items-end">
            <div>
              <h1 className="break-keep text-[38px] font-semibold leading-[1.14] tracking-tight md:text-[64px]">
                {item.title}
              </h1>
              <p className="mt-5 text-[13px] font-semibold tracking-[0.08em] text-black/56">
                클라이언트: <span className="tracking-[0.02em] text-black/78">{item.clientName}</span>
              </p>
              <p className="mt-6 max-w-[58ch] break-keep text-[18px] leading-[1.85] text-black/72">
                {item.oneLiner}
              </p>
            </div>

            <dl className="grid gap-4 border-y border-black/14 py-5 sm:grid-cols-3 md:py-6">
              <div>
                <dt className="text-xs font-semibold tracking-[0.12em] text-black/48">구독자 변화</dt>
                <dd className="mt-2 break-keep text-[24px] font-semibold tracking-tight">{item.result}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.12em] text-black/48">최고 조회수</dt>
                <dd className="mt-2 text-[24px] font-semibold tracking-tight text-[#21c1a2]">{formatViews(item.maxVideoViews)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.12em] text-black/48">담당 범위</dt>
                <dd className="mt-2 break-keep text-[15px] font-semibold leading-[1.55]">{item.scope ?? "채널 운영 구조 설계"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-black/12">
        <div className={`${shell} grid gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-start md:py-20`}>
          <div className="relative aspect-video overflow-hidden border border-black/10 bg-black">
            {item.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
                title={`${item.title} 대표 영상`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <Image
                src={item.imageSrc}
                alt={`${item.title} 대표 이미지`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-x-3 gap-y-2 border-y border-black/12 py-4">
              <span className="text-[12px] font-semibold tracking-[0.1em] text-black/52">키워드</span>
              {item.tags.map((tag) => (
                <span key={tag} className="text-[14px] font-semibold tracking-[0.03em] text-black/74">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="break-keep text-[16px] leading-[1.85] text-black/68">
              이 페이지는 단순 포트폴리오가 아니라, 고객이 계약 전에 확인하고 싶어 하는 시작 상태, 실제 담당 범위,
              운영 결과, 확인 가능한 증거를 한 번에 볼 수 있도록 정리한 케이스 스터디입니다.
            </p>
          </div>
        </div>
      </section>

      {caseDetails.length > 0 ? (
        <section className="border-b border-black/12 bg-white">
          <div className={`${shell} grid gap-8 py-12 md:grid-cols-[0.72fr_1.28fr] md:gap-12 md:py-16`}>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 운영 해부도 ]</p>
              <h2 className="mt-4 break-keep text-[30px] font-semibold leading-[1.24] tracking-tight md:text-[42px]">
                숫자 뒤에 있는
                실제 운영 범위입니다.
              </h2>
            </div>

            <dl className="divide-y divide-black/12 border-y border-black/14">
              {caseDetails.map((detail) => (
                <div key={detail.label} className="grid gap-3 py-4 md:grid-cols-[190px_1fr] md:gap-8">
                  <dt className="text-[13px] font-semibold tracking-[0.08em] text-black/50">{detail.label}</dt>
                  <dd className="break-keep text-[16px] font-semibold leading-[1.7] text-[#0B0F0E]">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="border-b border-black/12 bg-[#fbfcfc]">
        <div className={`${shell} grid gap-6 py-14 md:grid-cols-2 md:py-20`}>
          {caseBlocks.map((block) => (
            <article key={block.label} className="border-t border-black/15 pt-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-black/45">{block.label}</p>
              <h2 className="mt-3 break-keep text-[28px] font-semibold leading-[1.25] tracking-tight md:text-[36px]">
                {block.title}
              </h2>
              <p className="mt-4 break-keep text-[16px] leading-[1.85] text-black/70">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className={`${shell} grid gap-8 py-14 md:grid-cols-[0.86fr_1.14fr] md:py-20 md:items-center`}>
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 다음 단계 ]</p>
            <h2 className="mt-4 break-keep text-[30px] font-semibold leading-[1.24] tracking-tight md:text-[46px]">
              우리 채널도 같은 기준으로
              먼저 점검할 수 있습니다.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="break-keep text-[16px] leading-[1.9] text-black/70">
              채널 링크와 이번 분기 목표를 보내주시면 제목/썸네일, 주제 구조, 문의 CTA 중 바로 손봐야 할 3가지를
              먼저 확인해드립니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className={`inline-flex items-center border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] ${focusRing}`}
              >
                24시간 3포인트 진단 받기
              </Link>
              <Link
                href="/#pricing"
                className={`inline-flex items-center border border-black/20 px-5 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03] ${focusRing}`}
              >
                운영 플랜 추천기 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
