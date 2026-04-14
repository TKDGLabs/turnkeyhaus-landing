import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";
import { getSortedInsights } from "@/content/insights";

export const metadata: Metadata = {
  title: "인사이트 | 브랜딩 콘텐츠·유튜브 운영 인사이트 - TKDG Labs",
  description: "고신뢰·고관여 업종을 포함한 브랜딩 콘텐츠 제작과 유튜브 채널 운영 인사이트 모음.",
  alternates: {
    canonical: `${content.seo.siteUrl}/insights`
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

  return (
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex h-11 shrink-0 items-center">
            <Image
              src="/logo.png"
              alt={content.brand.logoAlt}
              width={164}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-black/75 hover:bg-black/[0.03]"
            >
              홈으로
            </Link>
            <Link
              href="/#contact"
              className="inline-flex h-10 items-center rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-4 text-sm font-semibold text-black"
            >
              채널 진단
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">인사이트</h1>
        <p className="mt-3 text-black/60">
          브랜딩 콘텐츠 제작과 채널 운영에서 반복되는 문제를 구조 관점으로 정리합니다.
        </p>

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
