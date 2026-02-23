export type Cta = { label: string; href: string; variant: "primary" | "ghost" };

export type PortfolioItem = {
  title: string;
  oneLiner: string;
  tags: string[];
  result: string;
  href: string;
  imageSrc: string; // public/images/*
};

export type ImageCard = {
  title: string;
  oneLiner: string;
  bullets: string[];
  imageSrc: string;
  href: string;
};

export type Content = {
  brand: {
    name: string;
    sub: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    body: string;
    ctas: Cta[];
    backgroundGridEnabled: boolean;
    showreel: {
      enabled: boolean;
      label: string;
      // 컨설팅 톤 유지용: 유튜브 임베드 대신 자체 mp4 권장 (정책/안정성)
      mp4Src: string; // public/videos/showreel.mp4
      fallbackImageSrc: string; // public/images/studio-1.jpg 등
      note: string;
    };
  };
  problem: {
    h2: string;
    lead: string;
    items: string[];
    emphasis: string;
  };
  brandStructure: {
    h2: string;
    lead: string;
    bullets: string[];
    imageSrc: string;
  };
  professionalTargets: {
    h2: string;
    lead: string;
    cards: ImageCard[];
  };
  studioProof: {
    h2: string;
    lead: string;
    images: { src: string; alt: string }[];
    caption: string;
  };
  differentiation: {
    h2: string;
    title: string;
    body: string;
    bullets: string[];
    imageSrc: string;
  };
  portfolio: {
    h2: string;
    lead: string;
    items: PortfolioItem[];
  };
  pricing: {
    h2: string;
    lines: string[];
  };
  contact: {
    h2: string;
    lead: string;
    googleFormEmbedUrl: string;
    primaryCtaLabel: string;
  };
  footer: {
    companyName: string;
    ceo: string;
    bizNo: string;
    corpNo: string;
    address: string;
    email: string;
    tel: string;
  };
};

export const content: Content = {
  brand: {
    name: "Turnkeyhaus",
    sub: "by TKDG Labs"
  },
  seo: {
    title: "전문직 유튜브 브랜딩 | Turnkeyhaus (세무사·변호사·병원 채널 설계)",
    description:
      "Turnkeyhaus는 세무사·변호사·병원 등 전문직 유튜브 브랜딩을 설계하는 미디어 운영 조직입니다. 단순 유튜브 제작사가 아닌 채널 구조와 운영을 중심으로 신뢰 자산을 구축합니다.",
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
    { label: "문제", href: "#problem" },
    { label: "구조", href: "#structure" },
    { label: "전문직", href: "#professional" },
    { label: "증거", href: "#proof" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "진단", href: "#contact" }
  ],
  hero: {
    eyebrow: "[ CONSULTING FIRM · MEDIA-BASED EXECUTION ]",
    h1: "컨설팅 펌처럼,\n설계하고 실행합니다.",
    sub: "유튜브는 홍보물이 아니라 신뢰를 남기는 구조입니다.",
    body:
      "Turnkeyhaus는 TKDG Labs의 미디어 실행 조직입니다.\n우리는 촬영부터 시작하지 않습니다. 채널 구조와 운영 시스템부터 설계합니다.",
    ctas: [
      { label: "채널 구조 진단 요청", href: "#contact", variant: "primary" },
      { label: "포트폴리오 보기", href: "#portfolio", variant: "ghost" }
    ],
    backgroundGridEnabled: true,
    showreel: {
      enabled: true,
      label: "Showreel (무음 · 자동재생)",
      mp4Src: "/videos/showreel.mp4",
      fallbackImageSrc: "/images/studio-1.jpg",
      note:
        "컨설팅 톤을 해치지 않도록 ‘짧은 무음 루프’로만 보여줍니다. (영상 파일이 없으면 이미지로 대체)"
    }
  },
  problem: {
    h2: "[ 문제 ]",
    lead: "대부분의 채널은 “무엇을 만들지”부터 시작합니다.",
    items: [
      "병원/전문직 채널인데 정체성이 없음",
      "숏폼은 많은데 신뢰는 쌓이지 않음",
      "조회수는 나오지만 상담·문의 전환이 없음",
      "제작은 했지만 운영 구조가 없어 남지 않음"
    ],
    emphasis: "문제는 콘텐츠가 아니라 구조의 부재입니다."
  },
  brandStructure: {
    h2: "[ 브랜드는 구조 ]",
    lead: "브랜드는 우연히 성장하지 않습니다. 시작→성장→확장→신뢰 축적은 ‘구조’입니다.",
    bullets: [
      "포지셔닝과 톤을 먼저 고정합니다.",
      "롱폼·숏폼의 역할을 분리하고, 운영 시스템을 설계합니다.",
      "검색(SEO)과 전환(CTA)을 함께 설계합니다."
    ],
    imageSrc: "/images/concept-brand.jpg"
  },
  professionalTargets: {
    h2: "[ 통합 전문직 적용 ]",
    lead: "전문직은 ‘자극’이 아니라 ‘신뢰 구조’가 먼저입니다.",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "권위는 과장이 아니라 ‘정의된 구조’에서 나옵니다.",
        bullets: ["채널 포지셔닝/톤 설계", "사례/이슈 기반 포맷 구조화", "상담 전환형 CTA 설계"],
        imageSrc: "/images/pro-law.jpg",
        href: "#contact"
      },
      {
        title: "병원 · 의료",
        oneLiner: "정보 전달보다 ‘기억되는 신뢰’가 핵심입니다.",
        bullets: ["원장 브랜딩 구조", "환자 관점 설명형 포맷", "롱폼→숏폼 자산화"],
        imageSrc: "/images/pro-med.jpg",
        href: "#contact"
      },
      {
        title: "세무사",
        oneLiner: "복잡한 지식을 ‘명확한 시스템’으로 설계합니다.",
        bullets: ["키워드 기반 콘텐츠 설계", "사례/상황별 구조화", "문의 유도 동선 설계"],
        imageSrc: "/images/pro-tax.jpg",
        href: "#contact"
      }
    ]
  },
  studioProof: {
    h2: "[ 실행 증거 ]",
    lead: "우리는 ‘제작사처럼 보이지 않되’, 실행 능력은 증거로 보여줍니다.",
    images: [
      { src: "/images/studio-1.jpg", alt: "Turnkeyhaus studio setup 1" },
      { src: "/images/studio-2.jpg", alt: "Turnkeyhaus studio setup 2" }
    ],
    caption: "PD 2인 · 3CAM · 월 1~2회 촬영 기반 운영 (촬영은 재료 생산, 운영이 본질)"
  },
  differentiation: {
    h2: "[ 차별화 ]",
    title: "우리는 단순 유튜브 제작사가 아닙니다.",
    body:
      "촬영은 재료 생산 단계입니다.\n브랜드는 운영 과정에서 만들어집니다.\nTurnkeyhaus는 ‘채널 운영 설계’를 수행하는 미디어 기반 조직입니다.",
    bullets: ["채널 이름/정체성 정의", "말의 톤/콘텐츠 역할 분리", "성과 분석→성공 포맷 복제·발전"],
    imageSrc: "/images/concept-different.jpg"
  },
  portfolio: {
    h2: "[ 포트폴리오 ]",
    lead: "이론이 아니라, 실제 운영 결과로 증명합니다.",
    items: [
      {
        title: "365Tube",
        oneLiner: "치과 네트워크 채널 설계 · 편성/아이덴티티 구축",
        tags: ["치과", "채널 설계", "운영"],
        result: "구독자 44 → 500명",
        href: "https://youtube.com/",
        imageSrc: "/images/portfolio-365tube.png"
      },
      {
        title: "법 잘하는 변호사들",
        oneLiner: "채널 리빌딩 · SEO/운영 설계 · 상담 전환 구조",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "구독자 500 → 5.7천명",
        href: "https://youtube.com/",
        imageSrc: "/images/portfolio-law.png"
      },
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭 · 원장 브랜딩 · 경쟁 리스크 최소화 설계",
        tags: ["치과", "런칭", "브랜드 미디어"],
        result: "구독자 0 → 517명",
        href: "https://youtube.com/",
        imageSrc: "/images/portfolio-juchia.png"
      }
    ]
  },
  pricing: {
    h2: "[ 운영 구조 ]",
    lines: [
      "채널 운영은 월 단위 계약입니다.",
      "촬영은 매월 1~2회 진행됩니다.",
      "상세 견적은 상담 후 안내드립니다."
    ]
  },
  contact: {
    h2: "[ 채널 구조 진단 ]",
    lead: "필요한 팀과만 협업합니다. 과장 없이, 구조로 설득합니다.",
    googleFormEmbedUrl: "https://docs.google.com/forms/d/e/XXXXXXXXXXXX/viewform?embedded=true",
    primaryCtaLabel: "상담 예약하기"
  },
  footer: {
    companyName: "티케이디지랩스 주식회사",
    ceo: "채동우",
    bizNo: "763-87-03415",
    corpNo: "120111-0144223",
    address: "인천광역시 서구 파랑로 451, 10층 1010호",
    email: "contact@tkdglabs.com",
    tel: "0507-1463-3664"
  }
};
