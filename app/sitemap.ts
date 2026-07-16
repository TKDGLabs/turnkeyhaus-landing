import type { MetadataRoute } from "next";
import { content } from "@/content";
import { insights } from "@/content/insights";
import { industryPages } from "@/lib/industry-pages";
import { SEO } from "@/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date("2026-07-16T00:00:00+09:00");
  const postRoutes: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${SEO.siteUrl}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const industryRoutes: MetadataRoute.Sitemap = industryPages.map((page) => ({
    url: `${SEO.siteUrl}/${page.slug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.86
  }));

  const caseRoutes: MetadataRoute.Sitemap = content.portfolio.items.map((item) => ({
    url: `${SEO.siteUrl}/cases/${item.caseSlug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.82
  }));

  return [
    {
      url: SEO.siteUrl,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SEO.siteUrl}/youtube-channel-management`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.95
    },
    {
      url: `${SEO.siteUrl}/company`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.86
    },
    {
      url: `${SEO.siteUrl}/insights`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${SEO.siteUrl}/proposal.html`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.78
    },
    ...industryRoutes,
    ...caseRoutes,
    ...postRoutes
  ];
}
