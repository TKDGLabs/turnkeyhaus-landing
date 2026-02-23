import type { Metadata } from "next";
import "./globals.css";
import { content } from "../content";

export const metadata: Metadata = {
  metadataBase: new URL("https://turnkey.haus"),
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  openGraph: {
    type: "website",
    url: "https://turnkey.haus",
    siteName: "Turnkeyhaus",
    title: content.seo.title,
    description: content.seo.description,
    images: ["/og.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
    images: ["/og.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
