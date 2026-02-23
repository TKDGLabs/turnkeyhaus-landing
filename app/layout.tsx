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
    title: content.seo.title,
    description: content.seo.description,
    images: [{ url: content.seo.ogImagePath, width: 1200, height: 630, alt: content.seo.title }]
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
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
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={a2z.variable}>
      <body className="bg-white text-[#0B0F0E] antialiased">{children}</body>
    </html>
  );
}
