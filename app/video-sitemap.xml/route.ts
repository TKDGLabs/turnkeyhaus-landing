import { content } from "@/content";

export const dynamic = "force-static";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function durationSeconds(duration?: string) {
  if (!duration) return undefined;
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return undefined;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

export async function GET() {
  const entries = content.portfolio.items
    .filter((item) => item.youtubeId && item.videoPublishedAt)
    .map((item) => {
      const duration = durationSeconds(item.videoDuration);
      return `<url><loc>${content.seo.siteUrl}/cases/${item.caseSlug}</loc><video:video><video:thumbnail_loc>https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg</video:thumbnail_loc><video:title>${xmlEscape(item.videoTitle ?? item.title)}</video:title><video:description>${xmlEscape(`${item.clientName} 채널의 대표 영상. ${item.oneLiner}`)}</video:description><video:player_loc allow_embed="yes">https://www.youtube.com/embed/${item.youtubeId}</video:player_loc><video:publication_date>${item.videoPublishedAt}</video:publication_date>${duration ? `<video:duration>${duration}</video:duration>` : ""}<video:family_friendly>yes</video:family_friendly></video:video></url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${entries}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
