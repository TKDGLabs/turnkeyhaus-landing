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

export type FooterLine = {
  label: string;
  value: string;
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

export type ImageCard = {
  title: string;
  oneLiner: string;
  tags?: string[];
  bullets: string[];
  image: ImageAsset;
  href: string;
  ctaLabel: string;
};

export type Content = {
  brand: {
    name: string;
    sub: string;
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
    backgroundGridEnabled: boolean;
    showreel: {
      enabled: boolean;
      badge: string;
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
    support: string;
  };
  brandStructure: {
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
    cards: ImageCard[];
  };
  studioProof: {
    label: string;
    h2: string;
    lead: string;
    images: ImageAsset[];
    caption: string;
  };
  differentiation: {
    label: string;
    h2: string;
    title: string;
    body: string;
    bullets: string[];
    image: ImageAsset;
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
  law: { src: "/images/pro-law.jpg", alt: "변호사·로펌 전문직 대표 이미지" },
  med: { src: "/images/pro-med.jpg", alt: "병원·의료 전문직 대표 이미지" },
  tax: { src: "/images/pro-tax.jpg", alt: "세무사 전문직 대표 이미지" },
  brand: { src: "/images/concept-brand.jpg", alt: "브랜드 구조 설계 컨셉 이미지" },
  different: { src: "/images/concept-different.jpg", alt: "차별화 컨셉 이미지" }
} satisfies Record<string, ImageAsset>;

export const content: Content = {
  brand: {
    name: "Turnkeyhaus",
    sub: "by TKDG Labs"
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
      "병원 유튜브",
      "채널 운영"
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
    h1: "컨설팅 펌처럼\n설계하고 실행합니다.",
    sub: "유튜브는 홍보물이 아니라 신뢰를 남기는 구조입니다.",
    body:
      "Turnkeyhaus는 TKDG Labs의 미디어 기반 실행 조직입니다.\n촬영부터 시작하지 않고, 채널 구조와 운영 시스템부터 설계합니다.",
    ctas: [
      { label: "채널 구조 진단 요청", href: "#contact", variant: "primary" },
      { label: "포트폴리오 보기", href: "#portfolio", variant: "ghost" }
    ],
    backgroundGridEnabled: true,
    showreel: {
      enabled: true,
      badge: "[ MEDIA ]",
      label: "Showreel (무음 · 자동재생)",
      mp4Src: "/videos/showreel.mp4",
      fallback: images.studio1,
      note: "영상은 분위기용 루프입니다. (파일이 없으면 fallback 이미지가 노출됩니다.)"
    }
  },
  problem: {
    label: "[ PROBLEM ]",
    h2: "전문직 채널의 시작이 흔들리는 이유",
    lead: "대부분의 채널은 ‘무엇을 만들지’부터 시작하고, 그래서 운영 구조가 남지 않습니다.",
    items: [
      "병원·전문직 채널인데 정체성이 명확하지 않음",
      "숏폼은 많지만 신뢰는 축적되지 않음",
      "조회수는 나오지만 상담·문의 전환이 약함",
      "제작은 했지만 반복 가능한 운영 시스템이 없음"
    ],
    emphasis: "문제는 콘텐츠가 아니라 구조의 부재입니다.",
    support: "컨설팅 관점에서 설계하고, 미디어 조직으로 실행합니다."
  },
  brandStructure: {
    label: "[ STRUCTURE ]",
    h2: "브랜드는 설계입니다",
    lead: "브랜드는 우연히 성장하지 않습니다. 시작-성장-확장-신뢰 축적은 구조로 설계됩니다.",
    bullets: [
      "포지셔닝과 말의 톤을 먼저 고정합니다.",
      "롱폼·숏폼의 역할을 분리하고 운영 시스템으로 연결합니다.",
      "검색(SEO)과 전환(CTA)을 함께 설계합니다."
    ],
    image: images.brand
  },
  professionalTargets: {
    label: "[ PROFESSIONAL ]",
    h2: "통합 전문직 적용",
    lead: "전문직 채널은 자극보다 신뢰 구조가 먼저입니다.",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "권위는 과장이 아니라 정의된 구조에서 나옵니다.",
        bullets: ["채널 포지셔닝/톤 설계", "사례/이슈 기반 포맷 구조화", "상담 전환형 CTA 설계"],
        image: images.law,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "정보 전달보다 기억되는 신뢰가 핵심입니다.",
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
    h2: "실행 증거",
    lead: "제작사처럼 보이지 않되, 실행 능력은 결과와 체계로 증명합니다.",
    images: [images.studio1, images.studio2],
    caption: "PD 2인 / 3CAM / 월 1~2회 촬영 기반 운영"
  },
  differentiation: {
    label: "[ DIFFERENTIATION ]",
    h2: "운영 중심 접근의 차이",
    title: "우리는 단순 유튜브 제작사가 아닙니다.",
    body:
      "촬영은 재료 생산 단계입니다.\n브랜드는 운영 과정에서 만들어집니다.\nTurnkeyhaus는 채널 운영 설계를 수행하는 미디어 기반 조직입니다.",
    bullets: ["채널 이름/정체성 정의", "말의 톤/콘텐츠 역할 분리", "성과 분석→성공 포맷 복제·발전"],
    image: images.different
  },
  portfolio: {
    label: "[ PORTFOLIO ]",
    h2: "실제 운영 결과",
    lead: "이론이 아니라 실제 운영 성과로 증명합니다.",
    items: [
      {
        title: "365Tube",
        oneLiner: "치과 네트워크 채널 설계 · 편성/아이덴티티 구축",
        tags: ["치과", "채널 설계", "운영"],
        result: "44 → 500",
        href: "https://youtube.com/",
        image: images.med,
        ctaLabel: "채널 보기"
      },
      {
        title: "법 잘하는 변호사들",
        oneLiner: "채널 리빌딩 · SEO/운영 설계 · 상담 전환 구조",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "500 → 5.7K",
        href: "https://youtube.com/",
        image: images.law,
        ctaLabel: "채널 보기"
      },
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭 · 원장 브랜딩 · 경쟁 리스크 최소화 설계",
        tags: ["치과", "런칭", "브랜드 미디어"],
        result: "0 → 517",
        href: "https://youtube.com/",
        image: images.tax,
        ctaLabel: "채널 보기"
      }
    ]
  },
  contact: {
    label: "[ CONTACT ]",
    h2: "채널 구조 진단",
    lead: "필요한 팀과만 협업합니다. 과장 없이 구조로 설득합니다.",
    panelTitle: "상담 예약하기",
    panelBody: "폼을 작성해주시면 채널 구조 관점에서 검토 후 회신드립니다.",
    panelHint: "Google Form URL은 content.ts에서 교체 가능합니다.",
    googleFormEmbedUrl: "https://docs.google.com/forms/d/e/XXXXXXXXXXXX/viewform?embedded=true",
    primaryCtaLabel: "상담 예약하기",
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
