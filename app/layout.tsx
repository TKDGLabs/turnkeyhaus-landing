import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { content } from "../content";
import CursorFollower from "../components/CursorFollower";

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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Turnkeyhaus",
    legalName: content.footer.companyName,
    alternateName: "TKDG Labs",
    url: "https://www.turnkey.haus",
    description: "전문직을 위한 유튜브 브랜딩 및 채널 운영 대행",
    logo: `${content.seo.siteUrl}/logo.png`,
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${content.seo.siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.brand.name,
    url: content.seo.siteUrl,
    description: content.seo.description
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
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
