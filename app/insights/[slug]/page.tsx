import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/content";
import { getInsightBySlug, insights } from "@/content/insights";

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
    title: `${post.title} | TKDG Labs`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://www.turnkey.haus/insights/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.turnkey.haus/insights/${post.slug}`,
      type: "article"
    }
  };
}

export default function InsightDetailPage({ params }: InsightParams) {
  const post = getInsightBySlug(params.slug);

  if (!post) return notFound();

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
            href="/insights"
            className="inline-flex h-10 items-center rounded-xl border border-black/15 px-4 text-sm font-semibold text-black/75 hover:bg-black/[0.03]"
          >
            인사이트 목록
          </Link>
        </div>
      </header>

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

          <footer className="mt-12 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
            <div className="text-sm text-black/60">전문직 유튜브 운영 상담</div>
            <div className="mt-2 text-lg font-semibold">채널 구조/대본/전환 설계까지 함께 잡습니다.</div>
            <a
              href="/#contact"
              className="mt-4 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              상담 요청하기
            </a>
          </footer>
        </article>
      </section>
    </main>
  );
}
