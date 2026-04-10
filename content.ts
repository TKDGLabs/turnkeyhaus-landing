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
  subscriberStart: number;
  subscriberCurrent: number;
  maxVideoViews: number;
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

export type CtaLink = {
  label: string;
  href: string;
};

export type StrategyStep = {
  title: string;
  detail: string;
};

export type SignalInsightItem = {
  eyebrow: string;
  title: string;
  summary: string;
  note: string;
  variant: "dependency" | "ctr" | "setup";
};

export type FaqItem = {
  q: string;
  a: string;
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
    openGraphTitle: string;
    openGraphDescription: string;
    locale: string;
  };
  nav: NavItem[];
  heroValue: {
    headline: string;
    body: string;
    scrollGuide: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
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
  signalInsights: {
    label: string;
    h2: string;
    lead: string;
    items: SignalInsightItem[];
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
  faq: {
    label: string;
    h2: string;
    items: FaqItem[];
  };
  blog: {
    label: string;
    h2: string;
    lead: string;
    ctaLabel: string;
  };
  contact: {
    label: string;
    h2: string;
    lead: string;
    midCtaEyebrow: string;
    midCtaTitle: string;
    panelTitle: string;
    panelBody: string;
    panelHint: string;
    googleFormEmbedUrl: string;
    googleFormShareUrl: string;
    primaryCtaLabel: string;
    phoneDisplay: string;
    phoneHref: string;
    quickCallLabel: string;
    kakaoChatUrl: string;
    kakaoCtaLabel: string;
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
    siteUrl: "https://www.turnkey.haus",
    canonical: "https://www.turnkey.haus",
    ogImagePath: "/og-image.jpg",
    title: "전문직 유튜브 브랜딩 대행 | Turnkeyhaus",
    description:
      "세무사, 변호사, 의사 등 전문직을 위한 유튜브 채널 기획·제작·운영 대행. 전략 중심 브랜딩 시스템.",
    keywords: [
      "전문직 유튜브 대행",
      "세무사 유튜브 제작",
      "변호사 유튜브 제작",
      "의사 유튜브 마케팅",
      "유튜브 브랜딩 대행"
    ],
    openGraphTitle: "전문직 유튜브 브랜딩 | Turnkeyhaus",
    openGraphDescription: "전환 중심 전문직 유튜브 채널 운영 시스템",
    locale: "ko_KR"
  },
  nav: [
    { label: "문제", href: "#problem" },
    { label: "방식", href: "#approach" },
    { label: "전문직 적용", href: "#professional" },
    { label: "실행 증거", href: "#proof" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "인사이트", href: "/insights" },
    { label: "운영 레벨", href: "#pricing" },
    { label: "채널 진단", href: "#contact" }
  ],
  heroValue: {
    headline: "전문분야 브랜딩 채널 \n상담 전환까지 설계합니다.",
    body: "검색 유입부터 결정 전환까지\n고객 기준으로 운영 구조를 만듭니다.",
    scrollGuide:
      "상담을 받지 않으셔도 괜찮습니다.\n끝까지 스크롤하시면 브랜딩 채널 운영에 유익한 기준을 얻어가실 수 있습니다.",
    primaryCta: { label: "무료 전략 점검 받기", href: "#contact" },
    secondaryCta: { label: "실제 성장 사례 보기", href: "#portfolio" }
  },
  problem: {
    label: "[ 문제 · 현실 점검 ]",
    h2: "대부분의 채널은\n성장이 쉽지 않습니다.",
    lead:
      "콘텐츠를 꾸준히 올려도\n채널의 방향이 선명해지지 않는 경우가 많습니다.\n\n유튜브는 단기 제작이 아니라 운영 설계입니다.\n조회수보다 중요한 것은\n일관된 기준과 구조입니다.",
    items: [],
    emphasis: "유튜브는 '업로드'가 아니라 '설계'의 영역입니다."
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
  signalInsights: {
    label: "[ 운영 신호 ]",
    h2: "실제 성과는\n이 신호에서 먼저 움직입니다.",
    lead:
      "광고 의존도, 클릭률, 채널 세팅.\n이 세 가지가 먼저 정리되어야 상담 구조가 안정됩니다.\n\n문제는 양이 아니라 구조입니다.",
    items: [
      {
        eyebrow: "광고 의존도",
        title: "광고비를 줄여도 버티는 구조",
        summary: "보여주기용 콘텐츠가 아니라\n상담과 내원으로 이어지는 구조를 먼저 만듭니다.",
        note: "광고 의존도는 낮추고, 상담 연결 흐름은 높이는 방향으로 설계합니다.",
        variant: "dependency"
      },
      {
        eyebrow: "클릭률",
        title: "초반 30초보다 먼저 CTR",
        summary: "썸네일과 제목에서 클릭이 일어나지 않으면\n좋은 영상도 출발하지 못합니다.",
        note: "초기 시청보다 먼저, 클릭을 만드는 첫 관문을 점검합니다.",
        variant: "ctr"
      },
      {
        eyebrow: "채널 세팅",
        title: "영상 퀄리티보다 채널 세팅",
        summary: "개별 영상보다 중요한 건\n누가, 왜, 어떤 맥락으로 들어오는지에 대한 설계입니다.",
        note: "타깃 질문과 유입 경로, 전환 동선을 먼저 고정합니다.",
        variant: "setup"
      }
    ]
  },
  approach: {
    label: "[ 방식 ]",
    h2: "우리는 이렇게 운영합니다.",
    lead: "전문직 채널일수록 프로세스가 성과를 좌우합니다.",
    steps: [
      {
        title: "STEP 1 · 시장 구조 분석",
        detail: "타깃 질문, 검색 맥락, 경쟁 채널 구성을 먼저 분석합니다."
      },
      {
        title: "STEP 2 · 전환 키워드 설계",
        detail: "유입 키워드와 상담 키워드를 분리해 콘텐츠 흐름을 구성합니다."
      },
      {
        title: "STEP 3 · 대본/촬영 시스템",
        detail: "촬영 전에 대본과 구성표를 고정해 현장 부담을 줄입니다."
      },
      {
        title: "STEP 4 · 데이터 기반 개선",
        detail: "반응 데이터를 바탕으로 성공 포맷을 누적 자산으로 고정합니다."
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
        oneLiner: "시청이 아닌 '상담을 유도하는 콘텐츠'로",
        tags: ["법률", "로펌", "상담"],
        bullets: ["의뢰 전 질문 시리즈 구조", "사건/유형 키워드 맵", "상담 전환 동선"],
        image: images.law,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "잠재 고객의 '내원을 이끄는 콘텐츠'로",
        tags: ["병원", "의료", "브랜딩"],
        bullets: ["환자 질문 포맷 표준화", "비교·오해·주의 구조", "신뢰 축적 루틴"],
        image: images.med,
        href: "#contact",
        ctaLabel: "구조 진단 요청"
      },
      {
        title: "세무 · 회계 · 노무",
        oneLiner: "규정과 사례를 '납득시키는 콘텐츠'로",
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
      { src: "/images/showreel-cover-optimized.jpg", alt: "Turnkeyhaus 실행 기반 대표 이미지" }
    ]
  },
  portfolio: {
    label: "[ 포트폴리오 ]",
    h2: "실행의 결과는\n숫자로 증명됩니다.",
    lead: "대표 채널 3개의 구독자 변화와 단일 영상 최고 조회수를 함께 확인하세요.",
    items: [
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭 · 원장 브랜딩 · 운영 설계",
        tags: ["치과", "런칭", "운영"],
        result: "구독자 0 → 541명",
        subscriberStart: 0,
        subscriberCurrent: 541,
        maxVideoViews: 23000,
        href: "https://youtu.be/ajOQC_X-5bE",
        youtubeId: "ajOQC_X-5bE",
        imageSrc: "/images/studio-1.jpg"
      },
      {
        title: "법 잘하는 변호사들 · 로맨즈",
        oneLiner: "채널 리빌딩 · SEO/운영 설계 · 전환 구조",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "구독자 500 → 5,970명",
        subscriberStart: 500,
        subscriberCurrent: 5970,
        maxVideoViews: 370000,
        href: "https://youtu.be/mozP07dCcuk",
        youtubeId: "mozP07dCcuk",
        imageSrc: "/images/pro-law.jpg"
      },
      {
        title: "유안티비",
        oneLiner: "채널 운영 설계 · 포맷 구조화 · 장기 자산화",
        tags: ["채널 운영", "구조화", "자산화"],
        result: "구독자 2.2천 → 11.7만",
        subscriberStart: 2200,
        subscriberCurrent: 117000,
        maxVideoViews: 2180000,
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
  faq: {
    label: "[ FAQ ]",
    h2: "턴키 방식 적용 전\n자주 묻는 질문입니다.",
    items: [
      {
        q: "성과는 언제부터 확인할 수 있나요?",
        a: "초기 반응은 1~2개월 내 확인할 수 있지만, 유의미한 상담 전환은 보통 6~12개월 운영 축적이 필요합니다."
      },
      {
        q: "촬영만 맡길 수도 있나요?",
        a: "가능하지만 권장하지 않습니다. 촬영 단독보다 채널 기준·편성·전환 동선을 함께 설계할 때 성과가 안정적입니다."
      },
      {
        q: "운영 범위는 어떻게 정해지나요?",
        a: "월 운영 레벨(촬영 횟수, 포맷 복잡도, 분석 범위)에 따라 제안 범위가 달라지며 구조 진단 이후 확정됩니다."
      },
      {
        q: "지역 제한이 있나요?",
        a: "전국 대응합니다. 현재 운영 범위 내에서는 추가 출장비 없이 진행됩니다."
      }
    ]
  },
  blog: {
    label: "[ 인사이트 ]",
    h2: "검색에서 발견되고,\n결정에서 선택되기까지",
    lead: "전문직 유튜브 운영 경험을\n정리한 아카이브입니다.",
    ctaLabel: "인사이트 전체 보기"
  },
  contact: {
    label: "[ 채널 구조 진단 ]",
    h2: "단 한 번의 컨설팅으로\n브랜드의 성장을 예측하세요.",
    lead: "현재 상황과 목표를 남겨주시면\n채널 구조 관점으로 빠르게 검토 후 회신드립니다.",
    midCtaEyebrow: "채널 진단",
    midCtaTitle: "지금 채널 상태, 10분만에 방향을 잡아드립니다.",
    panelTitle: "상담 예약하기",
    panelBody: "현재 상황과 목표를 남겨주시면\n채널 구조 관점으로 빠르게 검토 후 회신드립니다.",
    panelHint: "Google Form은 임베드 URL만 사용합니다. (forms.gle 공유 링크 직접 사용 금지)",
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScnyuTnc051RnX8yaGNlPW6TSOe9INyaV-Gp8lc8xqUSL6kQg/viewform?embedded=true",
    googleFormShareUrl: "https://forms.gle/L58BK4pc3gEq81iM9",
    primaryCtaLabel: "내 채널 구조 점검 받기",
    phoneDisplay: "0507-1463-3664",
    phoneHref: "tel:050714633664",
    quickCallLabel: "전화 상담",
    kakaoChatUrl: "http://pf.kakao.com/_dyNPn/chat",
    kakaoCtaLabel: "카카오톡 상담",
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
