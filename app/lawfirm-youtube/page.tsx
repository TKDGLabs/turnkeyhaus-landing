import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("lawfirm-youtube");

export const metadata: Metadata = {
  title: page?.title ?? "로펌 유튜브 운영대행 | Turnkeyhaus",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/lawfirm-youtube`
  },
  openGraph: {
    title: page?.title ?? "로펌 유튜브 운영대행 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/lawfirm-youtube`
  }
};

export default function LawfirmYoutubePage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
