import { content } from "@/content";

export const SITE_URL = content.seo.siteUrl;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const BRAND_ID = `${SITE_URL}/#brand`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/youtube-channel-management#service`;

export const companyAddress = {
  "@type": "PostalAddress",
  streetAddress: "파랑로 451, 10층 1010호",
  addressLocality: "서구",
  addressRegion: "인천광역시",
  addressCountry: "KR"
};

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: content.footer.companyName,
  foundingDate: "2025",
  alternateName: ["턴키하우스 by TKDG", "Turnkeyhaus", "TKDG Labs"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`
  },
  image: `${SITE_URL}${content.seo.ogImagePath}`,
  description: content.seo.description,
  email: "contact@tkdglabs.com",
  telephone: "+82-507-1463-3664",
  address: companyAddress,
  founder: { "@id": `${SITE_URL}/company#chae-dongwoo` },
  brand: {
    "@type": "Brand",
    "@id": BRAND_ID,
    name: "턴키하우스 by TKDG",
    alternateName: "Turnkeyhaus"
  },
  sameAs: ["https://www.tkdglabs.com"],
  knowsAbout: [
    "전문직 유튜브 채널 운영",
    "유튜브 콘텐츠 기획",
    "유튜브 촬영과 편집",
    "유튜브 검색 최적화",
    "병원·로펌·기업 콘텐츠",
    "인하우스 영상팀 구축"
  ]
};

export const professionalServiceJsonLd = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#professional-service`,
  name: "턴키하우스 by TKDG",
  url: SITE_URL,
  description: "병원·로펌·기업 등 전문직과 고관여 브랜드의 유튜브 채널을 기획부터 촬영, 편집, 발행, 월간 리뷰까지 운영합니다.",
  parentOrganization: { "@id": ORGANIZATION_ID },
  email: "contact@tkdglabs.com",
  telephone: "+82-507-1463-3664",
  address: companyAddress,
  areaServed: [
    { "@type": "Country", name: "대한민국" },
    { "@type": "AdministrativeArea", name: "인천광역시" },
    { "@type": "AdministrativeArea", name: "서울특별시" },
    { "@type": "AdministrativeArea", name: "경기도" }
  ],
  priceRange: "상담 후 운영 범위에 따라 확정"
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "턴키하우스 by TKDG",
  alternateName: "Turnkeyhaus",
  url: SITE_URL,
  inLanguage: "ko-KR",
  publisher: { "@id": ORGANIZATION_ID }
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path}`
    }))
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
