import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("incheon-youtube-agency");

export const metadata: Metadata = {
  title: page?.title ?? "인천·수도권 유튜브 운영대행 | Turnkeyhaus",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/incheon-youtube-agency`
  },
  openGraph: {
    title: page?.title ?? "인천·수도권 유튜브 운영대행 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/incheon-youtube-agency`
  }
};

export default function IncheonYoutubeAgencyPage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
