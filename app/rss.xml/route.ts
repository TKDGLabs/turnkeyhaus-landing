import { insights } from "@/content/insights";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function blockText(block: (typeof insights)[number]["body"][number]) {
  if (block.type === "ul") return block.content.map((item) => `- ${item}`).join("\n");
  if (Array.isArray(block.content)) return block.content.map((chunk) => chunk.v).join("");
  return block.content.replace(/\*\*/g, "");
}

export async function GET() {
  const sorted = [...insights].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const items = sorted.map((post) => {
    const url = `${SITE_URL}/insights/${post.slug}`;
    const fullText = post.body.map(blockText).join("\n\n");
    return [
      "<item>",
      `<title>${xmlEscape(post.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${new Date(`${post.publishedAt}T00:00:00+09:00`).toUTCString()}</pubDate>`,
      `<description>${xmlEscape(`${post.description}\n\n${fullText}`)}</description>`,
      "</item>"
    ].join("");
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>턴키하우스 인사이트</title><link>${SITE_URL}/insights</link><description>전문직 유튜브 운영 현장에서 확인한 기획, 촬영, 검색 유입, 전환 기준</description><language>ko-KR</language><lastBuildDate>${new Date(`${sorted[0]?.publishedAt ?? "2026-07-16"}T00:00:00+09:00`).toUTCString()}</lastBuildDate>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
