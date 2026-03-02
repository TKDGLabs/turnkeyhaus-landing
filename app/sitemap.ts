import type { MetadataRoute } from "next";
import { content } from "@/content";
import { SEO } from "@/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const postRoutes: MetadataRoute.Sitemap = content.blog.posts.map((post) => ({
    url: `${SEO.siteUrl}/blog/${post.slug}`,
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
      url: `${SEO.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...postRoutes
  ];
}
