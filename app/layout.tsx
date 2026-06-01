import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { content } from "../content";
import Header from "@/components/Header"; // 🚨 대표님의 실제 헤더 컴포넌트 경로로 맞춰주세요!

const a2z = localFont({
  src: [
    { path: "../public/fonts/a2z-100-thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/a2z-400-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/a2z-700-bold.woff2", weight: "700", style: "normal" }
  ],
  variable: "--font-a2z",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(content.seo.siteUrl),
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  // ... (기존 메타데이터 내용과 동일하므로 가독성을 위해 중략)
};

const footerValue = (label: string) =>
  content.footer.lines.find((line) => line.label === label)?.value ?? "";

const geoKeywords = [ "유튜브 채널 운영대행", "인천 유튜브 대행", "청라 유튜브 대행" ]; // (중략)
const structuredData = [ /* 기존 구조화 데이터 내용 동일 */ ];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={a2z.variable}>
      <body className="bg-white text-[#0B0F0E] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* 🚨 뼈대에 공통 메뉴바를 장착합니다! */}
        <Header />

        {children}
      </body>
    </html>
  );
}
