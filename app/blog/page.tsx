import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";

export const metadata: Metadata = {
  title: `인사이트 | ${content.brand.name}`,
  description:
    "전문직 유튜브 브랜딩 인사이트 아카이브. 세무사, 변호사, 병원 채널 운영 전략과 성공 구조를 정리합니다.",
  alternates: {
    canonical: `${content.seo.siteUrl}/blog`
  },
  openGraph: {
    title: `인사이트 | ${content.brand.name}`,
    description:
      "전문직 유튜브 브랜딩 인사이트 아카이브. 검색 유입을 만드는 구조형 콘텐츠를 제공합니다.",
    url: `${content.seo.siteUrl}/blog`,
    siteName: content.brand.name,
    type: "article"
  }
};

export default function BlogPage() {
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

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="max-w-[56ch] space-y-4">
            <div className="text-sm font-semibold tracking-[0.14em] text-black/45 md:text-base">
              {content.blog.label}
            </div>
            <h1 className="max-w-[22ch] text-3xl font-semibold leading-[1.28] tracking-tight text-[#0B0F0E] md:text-4xl">
              {content.blog.h2}
            </h1>
            <p className="max-w-[52ch] whitespace-pre-line text-base leading-[1.95] text-black/72 md:text-lg">
              {content.blog.lead}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {content.blog.posts.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-medium text-black/65">
                    {post.category}
                  </span>
                  <div className="text-xs text-black/50">{post.readTime}</div>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-[#0B0F0E]">{post.title}</h2>
                <p className="mt-3 text-sm leading-[1.95] text-black/72 md:text-base">{post.excerpt}</p>

                <div className="mt-5 flex items-center justify-between">
                  <time className="text-xs text-black/50">{post.publishedAt}</time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-black/[0.03]"
                  >
                    자세히 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
