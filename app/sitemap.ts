import type { MetadataRoute } from "next";
import { content } from "@/content";
import { insights } from "@/content/insights";
import { industryPages } from "@/lib/industry-pages";
import { SEO } from "@/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const postRoutes: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${SEO.siteUrl}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const industryRoutes: MetadataRoute.Sitemap = industryPages.map((page) => ({
    url: `${SEO.siteUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9
  }));

  const caseRoutes: MetadataRoute.Sitemap = content.portfolio.items.map((item) => ({
    url: `${SEO.siteUrl}/cases/${item.caseSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.82
  }));

  return [
    {
      url: SEO.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SEO.siteUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...industryRoutes,
    ...caseRoutes,
    ...postRoutes
  ];
}
