import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { SEO } from "@/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const postRoutes: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${SEO.siteUrl}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8
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
    ...postRoutes
  ];
}
