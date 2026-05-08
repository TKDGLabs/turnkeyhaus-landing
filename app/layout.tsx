import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { content } from "../content";

const a2z = localFont({
  src: [
    { path: "../public/fonts/a2z-100-thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/a2z-200-extralight.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/a2z-300-light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/a2z-400-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/a2z-500-medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/a2z-600-semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/a2z-700-bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/a2z-800-extrabold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/a2z-900-black.woff2", weight: "900", style: "normal" }
  ],
  variable: "--font-a2z",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(content.seo.siteUrl),
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  alternates: {
    canonical: content.seo.canonical
  },
  openGraph: {
    type: "website",
    url: content.seo.siteUrl,
    siteName: content.brand.name,
    locale: content.seo.locale,
    title: content.seo.openGraphTitle,
    description: content.seo.openGraphDescription,
    images: [
      {
        url: `${content.seo.siteUrl}${content.seo.ogImagePath}`,
        width: 1200,
        height: 630,
        alt: content.seo.openGraphTitle
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.openGraphTitle,
    description: content.seo.openGraphDescription,
    images: [content.seo.ogImagePath]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

const footerValue = (label: string) =>
  content.footer.lines.find((line) => line.label === label)?.value ?? "";

const geoKeywords = [
  "유튜브 채널 운영대행",
  "전문직 유튜브 운영대행",
  "인천 유튜브 대행",
  "수도권 유튜브 대행",
  "유튜브 SEO",
  "GEO",
  "병원 유튜브 마케팅",
  "로펌 유튜브 마케팅",
  "세무사 유튜브 마케팅",
  "노무사 유튜브 마케팅",
  "기업 유튜브 운영대행",
  "공공기관 유튜브 운영대행",
  "B2B 유튜브 운영대행",
  "전문직 채널 진단",
  "인하우스 영상팀 구축",
  "영상 PD 채용 실무평가",
  "유튜브 월간 운영대행",
  "고관여 브랜드 유튜브 운영",
  "부천 유튜브 대행",
  "김포 유튜브 대행",
  "송도 유튜브 대행",
  "청라 유튜브 대행"
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Turnkeyhaus",
    legalName: content.footer.companyName,
    alternateName: "TKDG Labs",
    url: "https://www.turnkey.haus",
    description: content.seo.description,
    logo: `${content.seo.siteUrl}/logo.png`,
    founder: {
      "@type": "Person",
      name: footerValue("대표자")
    },
    areaServed: "KR",
    knowsAbout: geoKeywords,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Turnkeyhaus 운영 서비스",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "유튜브 월간 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "병원·의료기관 유튜브 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "변호사·로펌 유튜브 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "세무·노무·회계 유튜브 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "기업·공공기관 유튜브 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "인천·수도권 유튜브 운영대행" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "인하우스 영상 제작 시스템 구축 컨설팅" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "영상 인재 실무평가 지원" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "24시간 3포인트 채널 진단" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "운영 진단 리포트" } }
      ]
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: footerValue("Email"),
      telephone: "+82-507-1463-3664"
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: footerValue("주소"),
      addressCountry: "KR"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.brand.name,
    url: content.seo.siteUrl,
    inLanguage: "ko-KR"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.brand.name,
    url: content.seo.siteUrl,
    description: content.seo.description,
    inLanguage: "ko-KR",
    about: geoKeywords
  }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={a2z.variable}>
      <body className="bg-white text-[#0B0F0E] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
