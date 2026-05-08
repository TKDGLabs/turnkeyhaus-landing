import type { Metadata } from "next";
import IndustryLanding from "@/components/IndustryLanding";
import { content } from "@/content";
import { getIndustryPage } from "@/lib/industry-pages";

const page = getIndustryPage("video-hiring-evaluation");

export const metadata: Metadata = {
  title: page?.title ?? "영상 인재 실무평가 컨설팅 | Turnkeyhaus",
  description: page?.description,
  keywords: page?.keywords,
  alternates: {
    canonical: `${content.seo.siteUrl}/video-hiring-evaluation`
  },
  openGraph: {
    title: page?.title ?? "영상 인재 실무평가 컨설팅 | Turnkeyhaus",
    description: page?.description,
    url: `${content.seo.siteUrl}/video-hiring-evaluation`
  }
};

export default function VideoHiringEvaluationPage() {
  if (!page) return null;
  return <IndustryLanding page={page} />;
}
