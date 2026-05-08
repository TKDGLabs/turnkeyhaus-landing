import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("inhouse-video-system");

export const metadata: Metadata = {
  title: page?.title ?? "인하우스 영상 시스템 구축 컨설팅 | Turnkeyhaus",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/inhouse-video-system`
  },
  openGraph: {
    title: page?.title ?? "인하우스 영상 시스템 구축 컨설팅 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/inhouse-video-system`
  }
};

export default function InhouseVideoSystemPage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
