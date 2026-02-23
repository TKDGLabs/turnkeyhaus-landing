import { content } from "@/content";

const siteUrl = "https://turnkey.haus";

export const SEO = {
  siteUrl,
  siteName: content.brand.name,
  title: content.seo.title,
  description: content.seo.description,
  ogImagePath: "/og.png",
  canonical: siteUrl
} as const;
