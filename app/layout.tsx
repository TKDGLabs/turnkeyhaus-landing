import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import "lenis/dist/lenis.css";
import { content } from "../content";
import Header from "@/components/Header";
import CursorFollower from "@/components/CursorFollower";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  serializeJsonLd,
  websiteJsonLd
} from "@/lib/seo";

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
  title: {
    default: content.seo.title,
    template: "%s | 턴키하우스 by TKDG"
  },
  description: content.seo.description,
  keywords: content.seo.keywords,
  alternates: {
    canonical: content.seo.canonical,
    types: {
      "application/rss+xml": `${content.seo.siteUrl}/rss.xml`
    }
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
    images: [`${content.seo.siteUrl}${content.seo.ogImagePath}`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  creator: "티케이디지랩스 주식회사",
  publisher: "티케이디지랩스 주식회사",
  category: "유튜브 채널 운영대행",
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NAVER_SITE_VERIFICATION
      ? { other: { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION } }
      : {})
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationJsonLd, professionalServiceJsonLd, websiteJsonLd]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={a2z.variable}>
      <body className="bg-white text-[#0B0F0E] antialiased">
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        <Header />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
