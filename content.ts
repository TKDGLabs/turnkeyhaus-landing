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
  youtubeId?: string;
  imageSrc: string;
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
  approach: {
    label: string;
    h2: string;
    lead: string;
    bullets: string[];
    keyline: string;
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
  pricing: {
    label: string;
    h2: string;
    lead?: string;
    lines: string[];
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
  different: { src: "/images/concept-different.jpg", alt: "차별화 개념 이미지" }
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
    { label: "APPROACH", href: "#approach" },
    { label: "PROFESSIONAL", href: "#professional" },
    { label: "PROOF", href: "#proof" },
    { label: "PORTFOLIO", href: "#portfolio" },
    { label: "PRICING", href: "#pricing" },
    { label: "CONTACT", href: "#contact" }
  ],
  hero: {
    label: "[ CONSULTING FIRM · MEDIA EXECUTION ]",
    h1: "콘텐츠는 흐르고,\n구조는 남습니다.",
    sub: "전문직 채널을\n운영 시스템으로 설계합니다.",
    body:
      "Turnkeyhaus는 TKDG Labs의\n미디어 기반 실행 조직입니다.\n촬영보다 먼저, 기준과 구조를 고정합니다.",
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
    label: "[ 문제 ]",
    h2: "대부분의 콘텐츠는\n비슷한 이야기를 합니다.",
    lead: "조회수가 많다고,\n매출이 늘진 않습니다.",
    items: [],
    emphasis: "잠재 고객이 찾던 맥락에\n놓이지 못하면 남지 않습니다."
  },
  approach: {
    label: "[ 방식 ]",
    h2: "잠재 고객이 찾는 질문을\n구조로 바꿉니다.",
    lead: "",
    bullets: [
      "포지셔닝 · 톤 정의",
      "롱폼/숏폼 역할 분리",
      "검색(SEO) · 전환(CTA) 동시 설계",
      "성과 분석 → 성공 포맷 축적"
    ],
    keyline: "촬영은 재료 생산입니다.\n운영은 신뢰를 축적하는 과정입니다.",
    image: images.structure
  },
  professionalTargets: {
    label: "[ 전문직 적용 ]",
    h2: "전문직은 자극이 아니라\n신뢰의 기준이 필요합니다.",
    lead: "",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "채널의 말투와 구조를\n일관되게 유지합니다.",
        tags: ["법률", "로펌", "상담"],
        bullets: ["질문 중심 포맷 설계", "사례/상황 기반 구조화", "문의 전환 동선 설계"],
        image: images.law,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "채널의 말투와 구조를\n일관되게 유지합니다.",
        tags: ["병원", "의료", "브랜딩"],
        bullets: ["질문 중심 포맷 설계", "사례/상황 기반 구조화", "문의 전환 동선 설계"],
        image: images.med,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "세무 · 회계 · 노무",
        oneLiner: "채널의 말투와 구조를\n일관되게 유지합니다.",
        tags: ["세무", "회계", "노무"],
        bullets: ["질문 중심 포맷 설계", "사례/상황 기반 구조화", "문의 전환 동선 설계"],
        image: images.tax,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      }
    ]
  },
  studioProof: {
    label: "[ 실행 증거 ]",
    h2: "컨설팅은 말로,\n실행은 시스템으로.",
    lead: "PD 2인 · 3CAM · 월 1~2회 촬영\n(촬영은 최소화, 운영은 지속)",
    images: [images.studio1, images.studio2],
    caption: ""
  },
  portfolio: {
    label: "[ 포트폴리오 ]",
    h2: "[ 포트폴리오 ]",
    lead: "썸네일을 클릭하면 해당 영상으로 이동합니다.",
    items: [
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭 · 원장 브랜딩 · 운영 설계",
        tags: ["치과", "런칭", "운영"],
        result: "구독자 0 → 517명",
        href: "https://youtu.be/ajOQC_X-5bE",
        youtubeId: "ajOQC_X-5bE",
        imageSrc: "/images/studio-1.jpg"
      },
      {
        title: "법 잘하는 변호사들 · 로맨즈",
        oneLiner: "채널 리빌딩 · SEO/운영 설계 · 전환 구조",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "구독자 500 → 5.7천명",
        href: "https://youtu.be/mozP07dCcuk",
        youtubeId: "mozP07dCcuk",
        imageSrc: "/images/pro-law.jpg"
      },
      {
        title: "유안티비",
        oneLiner: "채널 운영 설계 · 포맷 구조화 · 장기 자산화",
        tags: ["채널 운영", "구조화", "자산화"],
        result: "구독자 2.2천 → 11.7만",
        href: "https://youtu.be/Fii93LBGjSY",
        youtubeId: "Fii93LBGjSY",
        imageSrc: "/images/studio-2.jpg"
      }
    ]
  },
  pricing: {
    label: "[ 운영 구조 ]",
    h2: "채널 운영은 월 단위입니다.",
    lines: [
      "촬영은 매월 1~2회 진행됩니다.",
      "상세 견적은 진단 후 안내드립니다."
    ]
  },
  contact: {
    label: "[ 채널 구조 진단 ]",
    h2: "지금 필요한 건\n더 많은 제작이 아니라\n더 나은 구조입니다.",
    lead: "현재 상황과 목표를 남겨주시면\n채널 구조 관점으로 빠르게 검토 후 회신드립니다.",
    panelTitle: "상담 예약하기",
    panelBody: "현재 상황과 목표를 남겨주시면\n채널 구조 관점으로 빠르게 검토 후 회신드립니다.",
    panelHint: "Google Form은 임베드 URL만 사용합니다. (forms.gle 공유 링크 직접 사용 금지)",
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScnyuTnc051RnX8yaGNlPW6TSOe9INyaV-Gp8lc8xqUSL6kQg/viewform?embedded=true",
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
