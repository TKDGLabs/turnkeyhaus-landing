import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SEO } from "@/seo.config";

const a2z = localFont({
  src: [
    {
      path: "../public/fonts/a2z-100-thin.woff2",
      style: "normal",
      weight: "100"
    },
    {
      path: "../public/fonts/a2z-200-extralight.woff2",
      style: "normal",
      weight: "200"
    },
    {
      path: "../public/fonts/a2z-300-light.woff2",
      style: "normal",
      weight: "300"
    },
    {
      path: "../public/fonts/a2z-400-regular.woff2",
      style: "normal",
      weight: "400"
    },
    {
      path: "../public/fonts/a2z-500-medium.woff2",
      style: "normal",
      weight: "500"
    },
    {
      path: "../public/fonts/a2z-600-semibold.woff2",
      style: "normal",
      weight: "600"
    },
    {
      path: "../public/fonts/a2z-700-bold.woff2",
      style: "normal",
      weight: "700"
    },
    {
      path: "../public/fonts/a2z-800-extrabold.woff2",
      style: "normal",
      weight: "800"
    },
    {
      path: "../public/fonts/a2z-900-black.woff2",
      style: "normal",
      weight: "900"
    }
  ],
  variable: "--font-a2z",
  display: "swap"
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SEO.siteUrl}#organization`,
      name: "티케이디지랩스 주식회사",
      alternateName: "TKDG Labs",
      url: SEO.siteUrl,
      logo: `${SEO.siteUrl}/logo.png`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@tkdglabs.com",
          telephone: "+82 0507-1463-3664",
          availableLanguage: ["ko"]
        }
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "인천광역시 서구 파랑로 451, 10층 1010호",
        addressCountry: "KR"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${SEO.siteUrl}#website`,
      url: SEO.siteUrl,
      name: SEO.siteName,
      description: SEO.description,
      inLanguage: "ko-KR"
    },
    {
      "@type": "WebPage",
      "@id": `${SEO.siteUrl}#webpage`,
      name: "Turnkeyhaus",
      url: SEO.siteUrl,
      isPartOf: {
        "@id": `${SEO.siteUrl}#website`
      },
      about: {
        "@id": `${SEO.siteUrl}#organization`
      },
      description: SEO.description
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: SEO.title,
  description: SEO.description,
  alternates: {
    canonical: SEO.canonical
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SEO.siteUrl,
    title: SEO.title,
    description: SEO.description,
    siteName: SEO.siteName,
    images: [
      {
        url: SEO.ogImagePath,
        width: 1200,
        height: 630,
        alt: "Turnkeyhaus OG Image"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImagePath]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={a2z.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
