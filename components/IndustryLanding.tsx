import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";
import type { IndustryPageData } from "@/lib/industry-pages";

const shell = "mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-10";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

export default function IndustryLanding({ page }: { page: IndustryPageData }) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      serviceType: page.eyebrow,
      description: page.description,
      url: `${content.seo.siteUrl}/${page.slug}`,
      provider: {
        "@type": "Organization",
        name: content.brand.name,
        url: content.seo.siteUrl
      },
      areaServed: "KR",
      keywords: page.keywords.join(", ")
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `${page.eyebrow}는 언제 필요하나요?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: page.lead
          }
        },
        {
          "@type": "Question",
          name: page.failureTitle,
          acceptedAnswer: {
            "@type": "Answer",
            text: page.failures.join(" ")
          }
        },
        {
          "@type": "Question",
          name: page.structureTitle,
          acceptedAnswer: {
            "@type": "Answer",
            text: page.structures.join(" ")
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: content.seo.siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.eyebrow,
          item: `${content.seo.siteUrl}/${page.slug}`
        }
      ]
    }
  ];

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
            href="/#contact"
            className={`inline-flex h-10 items-center border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] ${focusRing}`}
          >
            24시간 진단 요청
          </Link>
        </div>
      </header>

      <section className="border-b border-black/12">
        <div className={`${shell} py-16 md:py-24`}>
          <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ {page.eyebrow} ]</p>
          <h1 className="mt-5 max-w-[940px] whitespace-pre-line break-keep text-[38px] font-semibold leading-[1.18] tracking-tight md:text-[68px]">
            {page.hero}
          </h1>
          <p className="mt-6 max-w-[72ch] break-keep text-[17px] leading-[1.9] text-black/70 md:text-[20px]">
            {page.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className={`inline-flex items-center border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] ${focusRing}`}
            >
              24시간 3포인트 진단 받기
            </Link>
            <Link
              href="/#pilot"
              className={`inline-flex items-center border border-black/20 px-5 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03] ${focusRing}`}
            >
              운영 플랜 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/12">
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.78fr_1.22fr] md:py-20`}>
          <h2 className="break-keep text-[30px] font-semibold leading-[1.24] tracking-tight md:text-[46px]">
            {page.failureTitle}
          </h2>
          <ul className="space-y-3 text-[16px] leading-[1.9] text-black/72">
            {page.failures.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-black/12 bg-[#fbfcfc]">
        <div className={`${shell} grid gap-8 py-16 md:grid-cols-2 md:py-20`}>
          <TextBlock title={page.structureTitle} items={page.structures} />
          <TextBlock title={page.proofTitle} items={page.proof} />
        </div>
      </section>

      <section>
        <div className={`${shell} grid gap-10 py-16 md:grid-cols-[0.86fr_1.14fr] md:items-start md:py-20`}>
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 첫 구매 ]</p>
            <h2 className="mt-4 break-keep text-[30px] font-semibold leading-[1.24] tracking-tight md:text-[46px]">
              {page.offerTitle}
            </h2>
          </div>
          <div className="space-y-5">
            <ul className="divide-y divide-black/12 border-y border-black/12">
              {page.offers.map((item) => (
                <li key={item} className="py-4 text-[17px] font-semibold leading-[1.75] text-[#0B0F0E]">
                  {item}
                </li>
              ))}
            </ul>
            <p className="break-keep text-sm leading-[1.8] text-black/58">
              결제 등록 전 운영 적합성을 먼저 확인합니다. 업종, 촬영 환경, 내부 승인 구조를 확인한 뒤 계약 범위와 결제 방식을
              안내드립니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className={`inline-flex items-center border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] ${focusRing}`}
              >
                채널 진단 요청
              </Link>
              <a
                href={content.contact.kakaoChatUrl}
                className={`inline-flex items-center border border-black/20 px-5 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03] ${focusRing}`}
              >
                카카오톡 상담
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TextBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border-t border-black/15 pt-5">
      <h2 className="break-keep text-[28px] font-semibold tracking-tight text-[#0B0F0E] md:text-[36px]">{title}</h2>
      <ul className="mt-5 space-y-3 text-[15px] leading-[1.85] text-black/70">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </article>
  );
}
