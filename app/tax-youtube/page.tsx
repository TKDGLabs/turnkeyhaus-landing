import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("tax-youtube");

export const metadata: Metadata = {
  title: page?.title ?? "세무·노무 유튜브 운영대행 | Turnkeyhaus",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/tax-youtube`
  },
  openGraph: {
    title: page?.title ?? "세무·노무 유튜브 운영대행 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/tax-youtube`
  }
};

export default function TaxYoutubePage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
