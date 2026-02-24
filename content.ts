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

export type OperatingLevelCard = {
  title: string;
  priceBand: string;
  bullets: string[];
  target: string;
};

export type ProductionCrewCard = {
  role: string;
  headline: string;
  bullets: string[];
};

export type FooterLine = {
  label: string;
  value: string;
};

export type StrategyStep = {
  title: string;
  detail: string;
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
  problem: {
    label: string;
    h2: string;
    lead: string;
    items: string[];
    emphasis: string;
  };
  strategyFrame: {
    label: string;
    h2: string;
    steps: StrategyStep[];
  };
  approach: {
    label: string;
    h2: string;
    lead: string;
    steps: StrategyStep[];
    keyline: string;
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
    operationTitle: string;
    operationSystem: string[];
    crewTitle: string;
    crewLead: string;
    crewCards: ProductionCrewCard[];
    crewNote: string;
    closing: string;
    images: ImageAsset[];
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
    levels: OperatingLevelCard[];
    emphasis: string;
  };
  contact: {
    label: string;
    h2: string;
    lead: string;
    panelTitle: string;
    panelBody: string;
    panelHint: string;
    googleFormEmbedUrl: string;
    googleFormShareUrl: string;
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
    { label: "문제", href: "#problem" },
    { label: "방식", href: "#approach" },
    { label: "전문직 적용", href: "#professional" },
    { label: "실행 증거", href: "#proof" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "운영 레벨", href: "#pricing" },
    { label: "채널 진단", href: "#contact" }
  ],
  problem: {
    label: "[ 문제 · 현실 점검 ]",
    h2: "대부분의 콘텐츠는 비슷한 이야기를 합니다.\n그래서 수백만원을 써도 채널이 남지 않습니다.",
    lead:
      "영상은 늘어나지만,\n자산은 쌓이지 않습니다.\n\n유튜브는 캠페인이 아니라 구조입니다.\n조회수는 순간이고,\n구조는 축적입니다.",
    items: [],
    emphasis: "문제는 비용이 아니라 구조입니다."
  },
  strategyFrame: {
    label: "[ 전략 설계 프레임 ]",
    h2: "전략은 감각이 아니라\n단계로 설계됩니다.",
    steps: [
      {
        title: "진단",
        detail: "타겟 질문·검색 맥락·현재 채널 상태를 먼저 정리합니다."
      },
      {
        title: "포지셔닝",
        detail: "채널의 말투·톤·판단 기준을 고정해 일관성을 만듭니다."
      },
      {
        title: "편성",
        detail: "롱폼·숏폼의 역할을 분리해 축적 가능한 편성 구조를 만듭니다."
      },
      {
        title: "운영",
        detail: "SEO·CTA·성과 분석을 결합해 전환 흐름을 안정화합니다."
      }
    ]
  },
  approach: {
    label: "[ 방식 ]",
    h2: "우리는 제작 공정이 아니라\n운영 프레임을 설계합니다.",
    lead: "각 단계는 독립이 아니라, 다음 단계의 품질을 결정하는 연결 구조입니다.",
    steps: [
      {
        title: "① 포지셔닝 · 톤 정의",
        detail: "전문직 채널에서 어떤 관점으로 말할지 기준을 먼저 확정합니다."
      },
      {
        title: "② 롱폼/숏폼 역할 분리",
        detail: "확신을 만드는 콘텐츠와 도달을 만드는 콘텐츠를 분리해 설계합니다."
      },
      {
        title: "③ 검색(SEO) · 전환(CTA) 동시 설계",
        detail: "유입 키워드와 상담 동선을 같은 화면에서 작동하도록 맞춥니다."
      },
      {
        title: "④ 성과 분석 · 포맷 축적",
        detail: "반응 데이터를 바탕으로 성공 포맷을 재사용 가능한 자산으로 고정합니다."
      }
    ],
    keyline: "촬영은 재료 생산입니다.\n운영은 신뢰를 축적하는 과정입니다."
  },
  professionalTargets: {
    label: "[ 전문직 적용 ]",
    h2: "전문직은 자극이 아니라\n신뢰의 기준이 필요합니다.",
    lead: "말투·구조·운영을 규칙으로 고정",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "사건이 아니라 ‘판단의 프레임’을 설계합니다.",
        tags: ["법률", "로펌", "상담"],
        bullets: ["의뢰 전 질문 시리즈 구조", "사건/유형 키워드 맵", "상담 전환 동선"],
        image: images.law,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "불안을 줄이는 설명은, 구조에서 시작됩니다.",
        tags: ["병원", "의료", "브랜딩"],
        bullets: ["환자 질문 포맷 표준화", "비교·오해·주의 구조", "신뢰 축적 루틴"],
        image: images.med,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "세무 · 회계 · 노무",
        oneLiner: "규정은 어렵고, 사례는 남습니다.",
        tags: ["세무", "회계", "노무"],
        bullets: ["시즌/이슈 캘린더 편성", "상황별 템플릿", "판단 기준 기반 문의 설계"],
        image: images.tax,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      }
    ]
  },
  studioProof: {
    label: "[ 전략 실행 기반 ]",
    h2: "컨설팅은 말이 아니라,\n운영 시스템으로 증명합니다.",
    operationTitle: "운영 시스템",
    operationSystem: [
      "전담 PD 2인 운영 구조",
      "Sony FX 시네마 라인 운용",
      "3CAM 기반 인터뷰 설계",
      "전국 촬영 대응 (출장비 별도 없음)"
    ],
    crewTitle: "전담 구조",
    crewLead:
      "전문직 채널은 전담 구조로 운영됩니다.\n촬영은 일부이고, 기준과 설계가 중심입니다.",
    crewCards: [
      {
        role: "Account Lead",
        headline: "전문직 브랜딩 설계",
        bullets: [
          "업종별 포지셔닝 기준 수립",
          "메시지 톤 및 채널 판단 기준 고정",
          "상담 전환 구조 설계"
        ]
      },
      {
        role: "Marketing Producer",
        headline: "SEO 기반 운영 설계",
        bullets: [
          "검색 키워드 맵 설계",
          "월간 성과 리포트 운영",
          "콘텐츠 자산화 전략 수립"
        ]
      },
      {
        role: "Video Director",
        headline: "촬영 표준 운영",
        bullets: [
          "촬영 품질 표준 가이드 적용",
          "인터뷰/브랜딩 포맷 연출",
          "운영 계획 기반 촬영 실행"
        ]
      },
      {
        role: "Creative Lead",
        headline: "채널 디자인 구조",
        bullets: [
          "썸네일/브랜딩 시스템 고정",
          "포맷별 시각 규칙 관리",
          "장기 운영 관점 개선"
        ]
      }
    ],
    crewNote: "",
    closing: "",
    images: [
      { src: "/images/equipment-storage.jpg", alt: "장비 보관 및 운영 준비 현장" },
      { src: "/images/equipment-travel.jpg", alt: "전국 출장 촬영 세팅 현장" }
    ]
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
    label: "[ 운영 레벨 ]",
    h2: "유튜브는 건별 제작이 아니라\n운영 단위로 설계됩니다.",
    levels: [
      {
        title: "Structure Foundation",
        priceBand: "월 300만원대",
        bullets: [
          "월 1회 촬영",
          "채널 포지셔닝 설계",
          "롱폼/숏폼 구조화",
          "기본 전환 동선 설계"
        ],
        target: "대상: 신규 채널 또는 운영 체계가 없는 경우"
      },
      {
        title: "Structure Growth",
        priceBand: "월 400만원대",
        bullets: [
          "월 1–2회 촬영",
          "SEO 기반 콘텐츠 설계",
          "숏폼 자산화 시스템",
          "월간 운영 분석 리포트"
        ],
        target: "대상: 이미 채널이 있으나 구조가 정리되지 않은 경우"
      },
      {
        title: "Structure Intensive",
        priceBand: "월 500–600만원대",
        bullets: [
          "고난도 브랜딩 재설계",
          "전담 운영 구조",
          "팀 단위 채널 관리",
          "장기 성장 설계"
        ],
        target: "대상: 브랜드 단위 채널을 운영하는 전문직"
      }
    ],
    emphasis: "상세 제안은 채널 구조 진단 이후에만 가능합니다."
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
    googleFormShareUrl: "https://forms.gle/L58BK4pc3gEq81iM9",
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
