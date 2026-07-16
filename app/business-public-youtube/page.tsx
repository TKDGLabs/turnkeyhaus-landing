import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("business-public-youtube");

export const metadata: Metadata = {
  title: "기업·공공기관 유튜브 운영대행",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/business-public-youtube`
  },
  openGraph: {
    title: page?.title ?? "기업·공공기관 유튜브 운영대행 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/business-public-youtube`
  }
};

export default function BusinessPublicYoutubePage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
