import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("medical-youtube");

export const metadata: Metadata = {
  title: "병원·의원 유튜브 운영대행",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/medical-youtube`
  },
  openGraph: {
    title: page?.title ?? "병원 유튜브 운영대행 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/medical-youtube`
  }
};

export default function MedicalYoutubePage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
