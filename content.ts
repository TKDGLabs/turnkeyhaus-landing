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
  image?: ImageAsset;
  imageFallback?: {
    eyebrow: string;
    lines: string[];
  };
  href: string;
  ctaLabel: string;
};

export type PortfolioItem = {
  title: string;
  clientName: string;
  oneLiner: string;
  tags: string[];
  result: string;
  subscriberStart: number;
  subscriberCurrent: number;
  maxVideoViews: number;
  href: string;
  youtubeId?: string;
  channelHref?: string;
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

export type AiRecommendationCase = {
  prompt: string;
  fit: string;
  reasons: string[];
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
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  heroStats: {
    totalVideoViews: number;
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
  aiRecommendation: {
    label: string;
    h2: string;
    lead: string;
    items: AiRecommendationCase[];
    note: string;
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
  law: { src: "/images/pro-law.jpg", alt: "고신뢰 서비스 채널 사례 이미지" },
  med: { src: "/images/pro-med.jpg", alt: "고관여 브랜딩 채널 사례 이미지" },
  tax: { src: "/images/pro-tax.jpg", alt: "상담 전환형 채널 사례 이미지" },
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
    title: "브랜딩 콘텐츠 제작·유튜브 채널 운영대행 | Turnkeyhaus",
    description:
      "브랜딩 콘텐츠 제작부터 유튜브 채널 운영대행까지 통합 지원합니다. 병원·로펌·정부 기관·커머스 등 업종별 검색 유입(SEO/GEO)과 전환 구조를 함께 설계합니다.",
    keywords: [
      "유튜브 채널 운영대행",
      "브랜딩 콘텐츠 제작",
      "유튜브 브랜딩",
      "콘텐츠 운영대행",
      "병원 유튜브 마케팅",
      "로펌 유튜브 마케팅",
      "정부 기관 콘텐츠 운영",
      "커머스 콘텐츠 마케팅",
      "유튜브 SEO GEO"
    ],
    openGraphTitle: "브랜딩 콘텐츠 제작·채널 운영대행 | Turnkeyhaus",
    openGraphDescription:
      "브랜딩 콘텐츠 제작부터 채널 운영대행까지 통합 지원. 병원·로펌·정부 기관·커머스 업종별 전환형 운영 구조를 설계합니다.",
    locale: "ko_KR"
  },
  // 상단 메뉴(GNB)를 핵심 5개로 압축하고, 결제 페이지(/store)를 눈에 띄게 추가했습니다!
  nav: [
    { label: "브랜딩 방식", href: "/#approach" },
    { label: "포트폴리오", href: "/#portfolio" },
    { label: "인사이트", href: "/insights" },
    { label: "서비스 결제", href: "/store" },
    { label: "채널 진단", href: "/#contact" }
  ],
  heroValue: {
    headline: "브랜딩 채널은\n지속 가능한\n운영 구조부터.",
    body: "브랜드의 핵심 메시지와 톤을 먼저 설계하고,\n롱폼·숏폼·채널 자산을 일관된 기준으로 제작합니다.",
    primaryCta: { label: "내 채널 구조 진단 요청", href: "#contact" },
    secondaryCta: { label: "운영 사례 확인", href: "#portfolio" }
  },
  heroStats: {
    totalVideoViews: 20200000
  },
  problem: {
    label: "[ 문제 · 현실 점검 ]",
    h2: "영상은 올라가는데\n상담은 늘지 않는 이유",
    lead:
      "대부분의 채널은 콘텐츠 품질보다\n채널 구조에서 먼저 막힙니다.\n\n타깃 질문이 분산되어 있고,\n롱폼·숏폼 역할이 섞여 있으며,\nCTA가 일관되지 않기 때문입니다.",
    items: [],
    emphasis: "문제는 영상 수가 아니라, 고객이 이해하는 순서를 설계했는지입니다."
  },
  strategyFrame: {
    label: "[ 전략 설계 프레임 ]",
    h2: "저희는 이 4단계를\n매달 반복합니다.",
    steps: [
      {
        title: "진단",
        detail: "최근 90일 지표와 유입 키워드를 확인해 막히는 구간을 먼저 찾습니다."
      },
      {
        title: "포지셔닝",
        detail: "채널 소개, 썸네일 문법, 화법을 업종에 맞게 한 문장으로 정리합니다."
      },
      {
        title: "편성",
        detail: "롱폼은 설득, 숏폼은 발견 역할로 나눠 월간 편성을 구성합니다."
      },
      {
        title: "운영",
        detail: "업로드 후 제목·썸네일·CTA를 2주 단위로 보정합니다."
      }
    ]
  },
  signalInsights: {
    label: "[ 운영 신호 ]",
    h2: "상담 전환은\n이 지표에서 갈립니다.",
    lead:
      "조회수보다 먼저 봐야 할 건\n광고 의존도, 클릭률, 채널 세팅입니다.\n\n세 지표가 정리되면 상담 흐름이 안정됩니다.",
    items: [
      {
        eyebrow: "광고 의존도",
        title: "광고비 없이도 문의가 들어오는가",
        summary: "콘텐츠 자체 유입이 쌓이면\n광고를 줄여도 상담량 변동이 완만해집니다.",
        note: "광고 집행 전, 오가닉 유입 비중을 먼저 확인합니다.",
        variant: "dependency"
      },
      {
        eyebrow: "클릭률",
        title: "제목·썸네일에서 클릭이 발생하는가",
        summary: "클릭률이 낮으면 시청지속이 높아도\n추천 확장이 제한됩니다.",
        note: "업로드 초기 2주 CTR 보정이 핵심입니다.",
        variant: "ctr"
      },
      {
        eyebrow: "채널 세팅",
        title: "채널 첫 화면이 업종 질문을 설명하는가",
        summary: "방문자가 10초 안에 어떤 브랜드/팀인지 이해해야\n다음 행동이 일어납니다.",
        note: "홈·재생목록·소개 문구를 함께 정리합니다.",
        variant: "setup"
      }
    ]
  },
  approach: {
    label: "[ 방식 ]",
    h2: "촬영 이전에,\n운영 기준부터 합의합니다.",
    lead: "매월 같은 방식으로 점검하고 업데이트합니다.",
    steps: [
      {
        title: "STEP 1 · 질문 지도 작성",
        detail: "고객이 실제로 검색하는 질문을 우선순위로 묶어 콘텐츠 순서를 정합니다."
      },
      {
        title: "STEP 2 · 메시지 정렬",
        detail: "전문 용어를 업종 고객 언어로 바꾸고, 채널 전반의 톤을 맞춥니다."
      },
      {
        title: "STEP 3 · 촬영 설계",
        detail: "촬영 전 대본과 질문 리스트를 확정해 현장 시간을 줄입니다."
      },
      {
        title: "STEP 4 · 리포트 보정",
        detail: "월간 데이터로 제목·썸네일·CTA를 교정해 다음 달 편성에 반영합니다."
      }
    ],
    keyline: "영상 한 편보다, 6개월 뒤에도 남는 채널 구조를 만듭니다."
  },
  professionalTargets: {
    label: "[ 업종별 적용 ]",
    h2: "업종이 달라도\n핵심 운영 원리는 같습니다.",
    lead:
      "고신뢰·고관여 업종은 물론, 정부 기관·공공단체와 커머스·온라인 서비스까지\n업종별 톤과 구조에 맞춘 운영 템플릿을 분리 적용합니다.",
    cards: [
      {
        title: "고신뢰 서비스형",
        oneLiner: "판단이 필요한 서비스를 신뢰와 상담으로 연결하는 구조",
        tags: ["고신뢰", "리드 전환", "상담"],
        bullets: ["의사결정 전 질문 시리즈 구성", "핵심 키워드 맵 설계", "상담 전환 동선 최적화"],
        image: images.law,
        href: "#contact",
        ctaLabel: "해당 모델 진단 요청"
      },
      {
        title: "고관여 브랜딩형",
        oneLiner: "비교·검토가 긴 서비스에서 신뢰를 누적하는 구조",
        tags: ["고관여", "브랜딩", "신뢰"],
        bullets: ["고객 질문 포맷 표준화", "비교·오해·주의 포인트 정리", "신뢰 축적 루틴 운영"],
        image: images.med,
        href: "#contact",
        ctaLabel: "해당 모델 진단 요청"
      },
      {
        title: "정보 아카이브형",
        oneLiner: "규정 이슈를 빠르게 해석해 문의로 이어지는 구조",
        tags: ["세무", "회계", "노무"],
        bullets: ["시즌/이슈 캘린더 편성", "상황별 템플릿", "판단 기준 기반 문의 설계"],
        image: images.tax,
        href: "#contact",
        ctaLabel: "해당 업종 진단 요청"
      },
      {
        title: "정부 기관·공공단체형",
        oneLiner: "공공 신뢰와 사업 성과를 함께 전달해야 하는 조직형 채널 구조",
        tags: ["공공 커뮤니케이션", "사업 소개", "신뢰 설계"],
        bullets: [
          "정책/사업 소개와 실제 성과 사례를 분리 편성",
          "공식 문서 톤과 시청자 이해 톤을 이중 설계",
          "공고·성과 리포트·FAQ를 월간 캘린더로 운영",
          "전화/이메일/폼 등 문의 채널별 CTA 분기"
        ],
        image: {
          src: "/images/commerce-online-model.jpg",
          alt: "정부 기관 및 공공단체형 운영 협업 이미지"
        },
        imageFallback: {
          eyebrow: "ORGANIZATION MODEL",
          lines: ["정부 기관 및 공공단체", "신뢰·이해도 균형 설계", "정책·사업·성과 구조화"]
        },
        href: "#contact",
        ctaLabel: "해당 모델 진단 요청"
      },
      {
        title: "커머스·온라인 서비스형",
        oneLiner: "탐색-비교-구매까지 끊기지 않게 연결하는 전환형 채널 구조",
        tags: ["커머스", "전환 최적화", "리텐션"],
        bullets: [
          "카테고리별 문제-해결형 롱폼 시리즈 설계",
          "상품 USP와 후기/증빙 소재의 반복 포맷 구축",
          "런칭/프로모션 시즌의 숏폼·롱폼 연동 운영",
          "랜딩/장바구니/문의 CTA의 월간 실험 루프"
        ],
        image: {
          src: "/images/gov-private-model.jpg",
          alt: "커머스 및 온라인 서비스형 전환 운영 이미지"
        },
        imageFallback: {
          eyebrow: "COMMERCE MODEL",
          lines: ["커머스 및 온라인 서비스", "탐색·비교·구매 동선 설계", "콘텐츠 기반 전환 누적"]
        },
        href: "#contact",
        ctaLabel: "해당 모델 진단 요청"
      }
    ]
  },
  studioProof: {
    label: "[ 운영 기반 ]",
    h2: "작업 과정을 매달 기록하고\n운영 리포트로 공유합니다.",
    operationTitle: "운영 시스템",
    operationSystem: [
      "월간 기획 회의 및 편성표 공유",
      "촬영 전 대본·질문 리스트 사전 확정",
      "촬영 후 편집본/썸네일 A-B 점검",
      "월간 성과 리뷰 리포트 제공"
    ],
    crewTitle: "전담 구조",
    crewLead:
      "업종이 달라도 촬영 당일보다 사전 준비 시간이 더 중요합니다.\n그래서 역할을 분리해 운영합니다.",
    crewCards: [
      {
        role: "Account Lead",
        headline: "브랜드 운영 구조 설계",
        bullets: [
          "업종별 포지셔닝 기준 수립",
          "메시지 톤 및 채널 판단 기준 고정",
          "상담 전환 구조 설계"
        ]
      },
      {
        role: "Marketing Producer",
        headline: "SEO·발견성 운영 설계",
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
      { src: "/images/business-analyst-presenting-data-dashboard.png", alt: "운영 리포트 기반 데이터 분석 시각 이미지" }
    ]
  },
  portfolio: {
    label: "[ 포트폴리오 ]",
    h2: "최근 운영 대표 사례",
    lead: "대표 사례 4건의 구독자 변화와 전체 운영 누적 성과,\n그리고 신규 운영 채널의 SEO 성과를 함께 공개합니다.",
    items: [
      {
        title: "주치아 앞선tube",
        clientName: "더앞선치과병원",
        oneLiner: "신규 런칭부터 월간 포맷 운영까지 진행",
        tags: ["치과", "런칭", "운영"],
        result: "구독자 0 → 559명",
        subscriberStart: 0,
        subscriberCurrent: 559,
        maxVideoViews: 23000,
        href: "https://youtu.be/ajOQC_X-5bE",
        youtubeId: "ajOQC_X-5bE",
        imageSrc: "/images/studio-1.jpg"
      },
      {
        title: "법 잘하는 변호사들 · 로맨즈",
        clientName: "법무법인 선율로",
        oneLiner: "기존 채널 리빌딩과 SEO 기반 운영 구조 재정비",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "구독자 500 → 5,990명",
        subscriberStart: 500,
        subscriberCurrent: 5990,
        maxVideoViews: 370000,
        href: "https://youtu.be/mozP07dCcuk",
        youtubeId: "mozP07dCcuk",
        imageSrc: "/images/pro-law.jpg"
      },
      {
        title: "유안티비",
        clientName: "유안정형외과",
        oneLiner: "장기 운영 기준 수립과 포맷 구조화 진행",
        tags: ["채널 운영", "구조화", "자산화"],
        result: "구독자 2.2천 → 11.7만",
        subscriberStart: 2200,
        subscriberCurrent: 117000,
        maxVideoViews: 2180000,
        href: "https://youtu.be/Fii93LBGjSY",
        youtubeId: "Fii93LBGjSY",
        imageSrc: "/images/studio-2.jpg"
      },
      {
        title: "이라이프매거진",
        clientName: "섀도우 코퍼레이션",
        oneLiner: "숏폼·광고 없이 SEO 기반 롱폼 4편만으로 누적 조회수 2,926회",
        tags: ["e스포츠", "SEO", "롱폼 4편", "무광고"],
        result: "0명에서 시작 (운영 초기)",
        subscriberStart: 0,
        subscriberCurrent: 0,
        maxVideoViews: 2926,
        href: "https://youtu.be/zniK_ohy_xc?si=badXrseWOni5Kl0k",
        youtubeId: "zniK_ohy_xc",
        channelHref: "https://www.youtube.com/@elifemagazine_esports",
        imageSrc: "/images/studio-1.jpg"
      }
    ]
  },
  pricing: {
    label: "[ 운영 레벨 ]",
    h2: "예산은 영상 개수가 아니라\n운영 범위로 결정됩니다.",
    levels: [
      {
        title: "구조 세팅형",
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
        title: "구조 성장형",
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
        title: "구조 확장형",
        priceBand: "월 500–600만원대",
        bullets: [
          "고난도 브랜딩 재설계",
          "전담 운영 구조",
          "팀 단위 채널 관리",
          "장기 성장 설계"
        ],
        target: "대상: 브랜드 단위 채널을 장기 운영하는 고관여 업종/서비스"
      }
    ],
    emphasis: "정확한 범위는 1차 진단 후 제안서에서 확정됩니다."
  },
  aiRecommendation: {
    label: "[ 상황별 체크 ]",
    h2: "아래 상황에 가깝다면\n견적 계산기부터 돌려보세요.",
    lead:
      "업종과 목표가 달라도, 맞는 운영 방식은 빠르게 가늠할 수 있습니다.\n해당되는 항목부터 확인해 보세요.",
    items: [
      {
        prompt: "기업 유튜브를 맡길 팀이 필요한데, 채널 운영까지 함께 가능한가요?",
        fit: "기업/브랜드 단위로 콘텐츠 운영 체계를 함께 잡고 싶은 경우",
        reasons: [
          "촬영·편집만이 아니라 채널 포지셔닝/편성/CTA 동선을 함께 설계",
          "롱폼(설득)·숏폼(발견) 역할을 분리해 월간 운영 리포트로 보정",
          "성과 지표를 조회수 단독이 아닌 검색 유입·전환 구조 기준으로 관리"
        ]
      },
      {
        prompt: "병원·로펌 채널인데, 전문성은 살리면서 상담 전환도 만들 수 있나요?",
        fit: "고신뢰·고관여 업종에서 전문성과 쉬운 전달을 동시에 원할 때",
        reasons: [
          "업종 이해 기반 대본/주제 설계로 정보 정확도와 전달력을 함께 확보",
          "검색 의도 중심 키워드 세팅으로 잠재 고객 정합도를 우선 확보",
          "단발 바이럴보다 장기 신뢰 자산형 콘텐츠 운영에 강점"
        ]
      },
      {
        prompt: "공공기관/공공단체인데 예산이 크지 않아도 단건 유튜브 외주가 가능할까요?",
        fit: "예산 제약 안에서 단건 제작 또는 라이트 운영이 필요한 경우",
        reasons: [
          "단건 제작과 운영형 견적을 분리 제안해 의사결정 부담 최소화",
          "정책/사업 소개형 콘텐츠에 맞춘 문서형 톤·FAQ·CTA 구조 설계 가능",
          "필요 시 인하우스 셋업/교육까지 연동해 내부 운영 전환 가능"
        ]
      }
    ],
    note: "해당되는 항목이 있다면, 아래 계산기에서 월 예산 기준으로 바로 확인해 보세요."
  },
  faq: {
    label: "[ 운영 안내 ]",
    h2: "계약 전 꼭 확인하실\n실무 기준입니다.",
    items: [
      {
        q: "성과는 언제부터 확인할 수 있나요?",
        a: "초기 반응은 1~2개월 내 확인할 수 있지만, 유의미한 상담 전환은 보통 6~12개월 운영 축적이 필요합니다."
      },
      {
        q: "월간 운영 리포트에는 무엇이 포함되나요?",
        a: "조회수 보고에 그치지 않고, 유입 경로(검색/추천), 콘텐츠별 역할, 다음 달 수정 우선순위와 실행 항목을 함께 제공합니다."
      },
      {
        q: "수정/피드백은 어떤 방식으로 진행되나요?",
        a: "월 단위 운영 안에서 합의된 범위로 피드백을 반영합니다. 일정과 우선순위를 먼저 맞춘 뒤, 결과물 완성도와 전환 동선을 함께 보정합니다."
      },
      {
        q: "촬영 단독 의뢰도 가능한가요?",
        a: "가능합니다. 다만 성과 목적이 있다면 촬영 단독보다 채널 구조(주제·편성·CTA)까지 함께 설계하는 방식이 효율이 높습니다."
      },
      {
        q: "지역 제한이 있나요?",
        a: "전국 대응합니다. 오프라인 컨설팅 비용(서울·수도권 15만원 / 그 외 지역 25만원)은 계약 전 1회 컨설팅에만 적용됩니다. 계약 후 촬영 출장비는 지방 여부와 관계없이 별도 청구하지 않습니다."
      },
      {
        q: "계약 전에 무엇을 준비하면 되나요?",
        a: "현재 채널 링크, 업종/서비스 특징, 이번 분기 목표(브랜딩/문의), 월 예산 범위만 정리해 주시면 1차 제안과 우선순위를 빠르게 드릴 수 있습니다."
      }
    ]
  },
  blog: {
    label: "[ 인사이트 ]",
    h2: "검색에서 발견되고,\n결정에서 선택되기까지",
    lead: "현장 운영에서 얻은 기준과 사례를\n꾸준히 기록하고 있습니다.",
    ctaLabel: "인사이트 전체 보기"
  },
  contact: {
    label: "[ 채널 구조 진단 ]",
    h2: "현재 채널 상태를 보내주시면\n운영 우선순위를 먼저 드립니다.",
    lead: "브랜드/업종/목표를 남겨주시면\n3~4영업일 내 답변드립니다.",
    midCtaEyebrow: "채널 진단",
    midCtaTitle: "지금 채널 상태를 점검하고 우선순위를 정리해 드립니다.",
    panelTitle: "상담 예약하기",
    panelBody: "현재 상황과 목표를 남겨주시면\n채널 구조 관점으로 검토 후 회신드립니다.",
    panelHint: "Google Form은 임베드 URL만 사용합니다. (forms.gle 공유 링크 직접 사용 금지)",
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScnyuTnc051RnX8yaGNlPW6TSOe9INyaV-Gp8lc8xqUSL6kQg/viewform?embedded=true",
    googleFormShareUrl: "https://forms.gle/L58BK4pc3gEq81iM9",
    primaryCtaLabel: "내 채널 구조 점검 받기",
    phoneDisplay: "0507-1463-3664",
    phoneHref: "tel:050714633664",
    quickCallLabel: "전화 상담",
    kakaoChatUrl: "https://pf.kakao.com/_dyNPn/chat",
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
