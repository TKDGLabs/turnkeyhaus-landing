import type { MetadataRoute } from "next";
import { SEO } from "@/seo.config";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/api/", "/auth", "/store/payment/", "/store/result/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: ["Googlebot", "Yeti", "bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: privatePaths
      }
    ],
    sitemap: [`${SEO.siteUrl}/sitemap.xml`, `${SEO.siteUrl}/video-sitemap.xml`],
    host: SEO.siteUrl
  };
}
