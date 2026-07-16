import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { getSortedInsights } from "@/content/insights";
import { ORGANIZATION_ID, SITE_URL, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "전문직 유튜브 운영 인사이트",
  description: "고신뢰·고관여 업종을 포함한 브랜딩 콘텐츠 제작과 유튜브 채널 운영 인사이트 모음.",
  alternates: {
    canonical: `${content.seo.siteUrl}/insights`,
    types: { "application/rss+xml": `${content.seo.siteUrl}/rss.xml` }
  },
  openGraph: {
    title: "인사이트 | 브랜딩 콘텐츠·유튜브 운영 인사이트 - TKDG Labs",
    description: "고신뢰·고관여 업종을 포함한 브랜딩 콘텐츠 제작과 유튜브 채널 운영 인사이트 모음.",
    url: `${content.seo.siteUrl}/insights`,
    siteName: content.brand.name,
    type: "website"
  }
};

export default function InsightsPage() {
  const posts = getSortedInsights();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/insights#collection`,
        name: "전문직 유튜브 운영 인사이트",
        description: "턴키하우스 운영팀이 현장에서 확인한 유튜브 기획, 촬영, 검색 유입, 전환 기준",
        url: `${SITE_URL}/insights`,
        inLanguage: "ko-KR",
        publisher: { "@id": ORGANIZATION_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/insights/${post.slug}`,
            name: post.title
          }))
        }
      },
      breadcrumbJsonLd([{ name: "홈", path: "/" }, { name: "인사이트", path: "/insights" }])
    ]
  };

  return (
    <main id="main-content" className="min-h-screen bg-white pt-[82px] text-[#0B0F0E]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">인사이트</h1>
        <p className="mt-3 text-black/60">
          티케이디지랩스·턴키하우스 운영팀이 실제 채널에서 확인한 기획, 촬영, 검색 유입, 전환 기준을 기록합니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-[13px] font-semibold">
          <Link href="/company" className="underline underline-offset-4">작성팀 경력 확인</Link>
          <a href="/rss.xml" className="underline underline-offset-4">RSS 구독</a>
          <Link href="/youtube-channel-management" className="underline underline-offset-4">운영 서비스 보기</Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className="rounded-2xl border border-black/10 p-6 hover:bg-black/[0.02]"
            >
              <div className="text-sm text-black/60">{post.publishedAt}</div>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-black/60">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
