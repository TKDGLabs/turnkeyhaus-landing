import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/content";
import { getInsightBySlug, insights } from "@/content/insights";
import { ORGANIZATION_ID, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

type InsightParams = {
  params: {
    slug: string;
  };
};

function renderInline(contentText: string) {
  return contentText
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });
}

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: InsightParams): Metadata {
  const post = getInsightBySlug(params.slug);

  if (!post) return {};

  return {
    title: { absolute: post.title },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://www.turnkey.haus/insights/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.turnkey.haus/insights/${post.slug}`,
      type: "article",
      images: [
        {
          url: `${content.seo.siteUrl}${content.seo.ogImagePath}`,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      publishedTime: `${post.publishedAt}T00:00:00+09:00`
    }
  };
}

export default function InsightDetailPage({ params }: InsightParams) {
  const post = getInsightBySlug(params.slug);

  if (!post) return notFound();

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${content.seo.siteUrl}/insights/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        image: `${content.seo.siteUrl}${content.seo.ogImagePath}`,
        inLanguage: "ko-KR",
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        mainEntityOfPage: `${content.seo.siteUrl}/insights/${post.slug}`,
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        keywords: post.keywords.join(", ")
      },
      breadcrumbJsonLd([
        { name: "홈", path: "/" },
        { name: "인사이트", path: "/insights" },
        { name: post.title, path: `/insights/${post.slug}` }
      ])
    ]
  };

  const keywordText = post.keywords.join(" ");
  const industryLink = keywordText.match(/병원|의료|치과/)
    ? { href: "/medical-youtube", label: "병원·의원 유튜브 운영 방식" }
    : keywordText.match(/로펌|변호사|법률/)
      ? { href: "/lawfirm-youtube", label: "변호사·로펌 유튜브 운영 방식" }
      : { href: "/youtube-channel-management", label: "전문직 유튜브 운영 범위" };

  return (
    <main id="main-content" className="min-h-screen bg-white pt-[82px] text-[#0B0F0E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleStructuredData) }}
      />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <article>
          <header className="mb-10">
            <div className="text-sm text-black/60">{post.publishedAt}</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
            <p className="mt-4 text-black/70">{post.description}</p>
          </header>

          <div className="space-y-6 leading-relaxed">
            {post.body.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={`${block.type}-${index}`} className="pt-6 text-2xl font-semibold">
                    {block.content}
                  </h2>
                );
              }

              if (block.type === "ul") {
                return (
                  <ul key={`${block.type}-${index}`} className="list-disc space-y-2 pl-6 text-black/80">
                    {block.content.map((item) => (
                      <li key={item}>{renderInline(item)}</li>
                    ))}
                  </ul>
                );
              }

              const c = block.content;
              return (
                <p key={`${block.type}-${index}`} className="text-black/80">
                  {Array.isArray(c)
                    ? c.map((ch, i) =>
                        ch.t === "strong" ? (
                          <strong key={i} className="font-semibold text-black">
                            {ch.v}
                          </strong>
                        ) : (
                          <span key={i}>{ch.v}</span>
                        )
                      )
                    : c}
                </p>
              );
            })}
          </div>

          <aside className="mt-12 border-y border-black/15 py-6" aria-label="작성자 정보">
            <p className="text-[12px] font-semibold tracking-[0.1em] text-black/45">작성·검수</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <div><strong className="text-[18px]">턴키하우스 by TKDG 운영팀</strong><p className="mt-1 text-[14px] leading-relaxed text-black/60">티케이디지랩스 주식회사 · 전문직 유튜브 운영 현장 기록</p></div>
              <Link href="/company" className="text-[13px] font-semibold underline underline-offset-4">운영팀 경력 확인</Link>
            </div>
          </aside>

          <footer className="mt-10 border border-black/12 bg-[#f4f3ef] p-6 md:p-8">
            <div className="text-sm text-black/55">이 글과 연결된 운영 자료</div>
            <div className="mt-2 text-xl font-semibold">현장에서 쓰는 기준을 서비스와 사례로 이어서 확인하세요.</div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={industryLink.href} className="inline-flex border border-black/20 bg-white px-5 py-3 text-sm font-semibold">{industryLink.label}</Link>
              <Link href="/#work" className="inline-flex border border-black/20 bg-white px-5 py-3 text-sm font-semibold">운영 사례 보기</Link>
              <a href="/#contact" className="inline-flex bg-black px-5 py-3 text-sm font-semibold text-white">채널 운영 상담</a>
            </div>
          </footer>
        </article>
      </section>
    </main>
  );
}
