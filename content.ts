export type Cta = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
};

export type NavItem = {
  label: string;
  href: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type ProfessionalCard = {
  title: string;
  oneLiner: string;
  tags?: string[];
  bullets: string[];
  image: ImageAsset;
  href: string;
  ctaLabel: string;
};

export type PortfolioItem = {
  title: string;
  oneLiner: string;
  tags: string[];
  result: string;
  href: string;
  image: ImageAsset;
  ctaLabel: string;
};

export type FooterLine = {
  label: string;
  value: string;
};

export type Content = {
  brand: {
    name: string;
    logoAlt: string;
    logoSvgPath: string;
    logoPngPath: string;
  };
  seo: {
    siteUrl: string;
    canonical: string;
    ogImagePath: string;
    title: string;
    description: string;
    keywords: string[];
  };
  nav: NavItem[];
  hero: {
    label: string;
    h1: string;
    sub: string;
    body: string;
    ctas: Cta[];
    showreel: {
      enabled: boolean;
      label: string;
      mp4Src: string;
      fallback: ImageAsset;
      note: string;
    };
  };
  problem: {
    label: string;
    h2: string;
    lead: string;
    items: string[];
    emphasis: string;
  };
  structure: {
    label: string;
    h2: string;
    lead: string;
    bullets: string[];
    image: ImageAsset;
  };
  professionalTargets: {
    label: string;
    h2: string;
    lead: string;
    cards: ProfessionalCard[];
  };
  studioProof: {
    label: string;
    h2: string;
    lead: string;
    images: ImageAsset[];
    caption: string;
  };
  portfolio: {
    label: string;
    h2: string;
    lead: string;
    items: PortfolioItem[];
  };
  contact: {
    label: string;
    h2: string;
    lead: string;
    panelTitle: string;
    panelBody: string;
    panelHint: string;
    googleFormEmbedUrl: string;
    primaryCtaLabel: string;
    iframeTitle: string;
  };
  footer: {
    companyName: string;
    lines: FooterLine[];
  };
};

const images = {
  studio1: { src: "/images/studio-1.jpg", alt: "Turnkeyhaus studio setup 1" },
  studio2: { src: "/images/studio-2.jpg", alt: "Turnkeyhaus studio setup 2" },
  law: { src: "/images/pro-law.jpg", alt: "변호사·로펌 대표 이미지" },
  med: { src: "/images/pro-med.jpg", alt: "병원·의료 대표 이미지" },
  tax: { src: "/images/pro-tax.jpg", alt: "세무·회계·노무 대표 이미지" },
  structure: { src: "/images/concept-brand.jpg", alt: "브랜드 구조 설계 이미지" },
  different: { src: "/images/concept-different.jpg", alt: "차별화 개념 이미지" },
  portfolio365: { src: "/images/portfolio-365tube.png", alt: "365Tube 포트폴리오 썸네일" },
  portfolioLaw: { src: "/images/portfolio-law.png", alt: "법 잘하는 변호사들 포트폴리오 썸네일" },
  portfolioJuchia: { src: "/images/portfolio-juchia.png", alt: "주치아 앞선tube 포트폴리오 썸네일" }
} as const;

export const content: Content = {
  brand: {
    name: "Turnkeyhaus",
    logoAlt: "Turnkeyhaus",
    logoSvgPath: "/logo.svg",
    logoPngPath: "/logo.png"
  },
  seo: {
    siteUrl: "https://turnkey.haus",
    canonical: "https://turnkey.haus",
    ogImagePath: "/og.png",
    title: "전문직 유튜브 브랜딩 | Turnkeyhaus (세무사·변호사·병원 채널 설계)",
    description:
      "Turnkeyhaus는 세무사·변호사·병원 등 전문직 유튜브 브랜딩을 설계하는 미디어 실행 조직입니다. 단순 유튜브 제작사가 아닌 채널 구조와 운영 시스템을 통해 신뢰 자산을 구축합니다.",
    keywords: [
      "전문직 유튜브",
      "유튜브 브랜딩",
      "유튜브 컨설팅",
      "유튜브 제작사",
      "세무사 유튜브",
      "변호사 유튜브",
      "병원 유튜브"
    ]
  },
  nav: [
    { label: "PROBLEM", href: "#problem" },
    { label: "STRUCTURE", href: "#structure" },
    { label: "PROFESSIONAL", href: "#professional" },
    { label: "PROOF", href: "#proof" },
    { label: "PORTFOLIO", href: "#portfolio" },
    { label: "CONTACT", href: "#contact" }
  ],
  hero: {
    label: "[ CONSULTING FIRM · MEDIA EXECUTION ]",
    h1: "컨설팅 기준으로 설계하고\n미디어로 실행합니다.",
    sub: "유튜브는 홍보물이 아니라 신뢰를 남기는 구조입니다.",
    body:
      "Turnkeyhaus는 TKDG Labs의 미디어 기반 실행 조직입니다.\n제작물 단위가 아니라 채널 구조와 운영 체계를 먼저 설계합니다.",
    ctas: [
      { label: "채널 구조 진단 요청", href: "#contact", variant: "primary" },
      { label: "포트폴리오 보기", href: "#portfolio", variant: "ghost" }
    ],
    showreel: {
      enabled: true,
      label: "Showreel (Muted Loop)",
      mp4Src: "/videos/showreel.mp4",
      fallback: images.studio1,
      note: "짧은 무음 루프로 실행 역량만 간결하게 보여줍니다."
    }
  },
  problem: {
    label: "[ PROBLEM ]",
    h2: "전문직 채널이 멈추는 지점",
    lead: "대부분의 채널은 콘텐츠 제작부터 시작해 운영 구조를 놓칩니다.",
    items: [
      "전문성은 높지만 채널 정체성이 일관되지 않음",
      "영상 수는 늘어나지만 신뢰 축적이 느림",
      "조회수 대비 상담·문의 전환이 약함",
      "제작 후 반복 가능한 운영 시스템이 남지 않음"
    ],
    emphasis: "문제는 콘텐츠가 아니라 구조의 부재입니다."
  },
  structure: {
    label: "[ STRUCTURE ]",
    h2: "브랜드는 구조로 완성됩니다",
    lead: "포지셔닝, 톤, 편성, 전환 동선을 하나의 운영 체계로 연결합니다.",
    bullets: [
      "타겟과 포지셔닝을 먼저 정의합니다.",
      "롱폼·숏폼 역할을 분리해 채널 체계를 만듭니다.",
      "검색 유입과 문의 전환 동선을 함께 설계합니다."
    ],
    image: images.structure
  },
  professionalTargets: {
    label: "[ PROFESSIONAL ]",
    h2: "통합 전문직 적용",
    lead: "분야는 다르지만 운영 원칙은 동일합니다.",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "법률 서비스는 일관된 신뢰 톤이 경쟁력입니다.",
        tags: ["법률", "로펌", "상담"],
        bullets: ["채널 포지셔닝/톤 설계", "사례·이슈 기반 포맷 구조화", "상담 전환형 CTA 설계"],
        image: images.law,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "의료 정보는 명확성과 신뢰의 반복이 핵심입니다.",
        tags: ["병원", "의료", "브랜딩"],
        bullets: ["원장 브랜딩 구조", "환자 관점 설명형 포맷", "롱폼→숏폼 자산화"],
        image: images.med,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "세무 · 회계 · 노무",
        oneLiner: "숫자와 규정은 ‘구조화된 설명’이 신뢰를 만듭니다.",
        tags: ["세무", "회계", "노무"],
        bullets: [
          "키워드 기반 콘텐츠 설계(세무/회계/노무별)",
          "사례·상황별 포맷 구조화",
          "문의 전환 동선(CTA) 설계"
        ],
        image: images.tax,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      }
    ]
  },
  studioProof: {
    label: "[ PROOF ]",
    h2: "실행 인프라",
    lead: "실행은 단발 제작이 아니라 반복 가능한 시스템으로 운영합니다.",
    images: [images.studio1, images.studio2],
    caption: "PD 2인 / 3CAM / 월 1~2회 촬영 기반 운영"
  },
  portfolio: {
    label: "[ PORTFOLIO ]",
    h2: "운영 결과",
    lead: "성과는 결과 숫자와 운영 지속성으로 확인합니다.",
    items: [
      {
        title: "365Tube",
        oneLiner: "치과 네트워크 채널 설계 · 편성/아이덴티티 구축",
        tags: ["치과", "채널 설계", "운영"],
        result: "44 → 500",
        href: "https://youtube.com/",
        image: images.portfolio365,
        ctaLabel: "채널 보기"
      },
      {
        title: "법 잘하는 변호사들",
        oneLiner: "채널 리빌딩 · SEO/운영 설계 · 상담 전환 구조",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "500 → 5.7K",
        href: "https://youtube.com/",
        image: images.portfolioLaw,
        ctaLabel: "채널 보기"
      },
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭 · 원장 브랜딩 · 경쟁 리스크 최소화 설계",
        tags: ["치과", "런칭", "브랜드 미디어"],
        result: "0 → 517",
        href: "https://youtube.com/",
        image: images.portfolioJuchia,
        ctaLabel: "채널 보기"
      }
    ]
  },
  contact: {
    label: "[ CONTACT ]",
    h2: "채널 구조 진단",
    lead: "필요한 팀과만 협업합니다. 과장 없이 구조로 설득합니다.",
    panelTitle: "상담 예약하기",
    panelBody: "폼을 작성해주시면 채널 구조 관점에서 빠르게 검토 후 회신드립니다.",
    panelHint: "Google Form은 임베드 URL만 사용합니다. (forms.gle 공유 링크 직접 사용 금지)",
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScnyuTnc051RnX8yaGNlPW6TSOe9INyaV-Gp8lc8xqUSL6kQg/viewform?embedded=true",
    primaryCtaLabel: "상담 폼 열기",
    iframeTitle: "Turnkeyhaus 상담 폼"
  },
  footer: {
    companyName: "티케이디지랩스 주식회사",
    lines: [
      { label: "대표자", value: "채동우" },
      { label: "사업자등록번호", value: "763-87-03415" },
      { label: "법인등록번호", value: "120111-0144223" },
      { label: "주소", value: "인천광역시 서구 파랑로 451, 10층 1010호" },
      { label: "Email", value: "contact@tkdglabs.com" },
      { label: "Tel", value: "0507-1463-3664" }
    ]
  }
};
