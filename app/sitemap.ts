import type { MetadataRoute } from "next";
import { SEO } from "@/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SEO.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
