import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/content";

type BlogParams = {
  params: {
    slug: string;
  };
};

function getPost(slug: string) {
  return content.blog.posts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return content.blog.posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogParams): Metadata {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: `${content.brand.name} 인사이트`
    };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${content.seo.siteUrl}/blog/${post.slug}`
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `${content.seo.siteUrl}/blog/${post.slug}`,
      siteName: content.brand.name,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [content.seo.ogImagePath]
    }
  };
}

export default function BlogDetailPage({ params }: BlogParams) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
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

          <Link
            href="/blog"
            className="inline-flex h-10 items-center rounded-xl border border-black/15 px-4 text-sm font-semibold text-black/75 hover:bg-black/[0.03]"
          >
            인사이트 목록
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="space-y-5 border-b border-black/10 pb-8 md:pb-10">
          <div className="text-sm font-semibold tracking-[0.14em] text-black/45 md:text-base">{post.category}</div>
          <h1 className="max-w-[22ch] text-3xl font-semibold leading-[1.28] tracking-tight text-[#0B0F0E] md:text-5xl md:leading-[1.18]">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-black/55">
            <time>{post.publishedAt}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <p className="max-w-[55ch] text-base leading-[1.95] text-black/72 md:text-lg">{post.excerpt}</p>
        </div>

        <div className="mt-10 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="max-w-[24ch] text-2xl font-semibold leading-[1.32] tracking-tight text-[#0B0F0E] md:text-3xl">
                {section.heading}
              </h2>

              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-[1.95] text-black/75 md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.bullets ? (
                <ul className="space-y-2 rounded-2xl border border-black/10 bg-[#fbfcfb] p-5 text-sm leading-[1.95] text-black/75 md:text-base">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="list-inside list-disc">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <h3 className="text-xl font-semibold tracking-tight text-[#0B0F0E]">채널 구조 진단이 필요하신가요?</h3>
          <p className="mt-3 max-w-[52ch] text-base leading-[1.95] text-black/72">
            업종과 현재 채널 상태를 남겨주시면, 운영 구조 관점으로 진단 포인트를 정리해드립니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex rounded-xl border border-[#21c1a2] bg-[#21c1a2] px-5 py-3 text-sm font-semibold text-black"
            >
              채널 구조 진단 요청
            </Link>
            <Link
              href="/blog"
              className="inline-flex rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              인사이트 더 보기
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
