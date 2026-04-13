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
      "법률·의료·세무 전문직 채널의 기획, 촬영, 운영을 통합 지원합니다. 검색 유입과 상담 전환까지 함께 설계합니다.",
    keywords: [
      "전문직 유튜브 대행",
      "세무사 유튜브 제작",
      "변호사 유튜브 제작",
      "의사 유튜브 마케팅",
      "유튜브 브랜딩 대행"
    ],
    openGraphTitle: "전문직 유튜브 브랜딩 | Turnkeyhaus",
    openGraphDescription: "전문직 채널을 위한 기획·촬영·운영 통합 서비스",
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
    headline: "전문직 채널,\n촬영보다 운영 구조부터 만듭니다.",
    body: "누가 어떤 질문으로 들어와 어떤 이유로 상담을 남기는지,\n채널 동선을 먼저 설계한 뒤 제작합니다.",
    scrollGuide:
      "필요한 정보만 빠르게 보셔도 됩니다.\n아래에 실제 운영 방식과 사례를 공개했습니다.",
    primaryCta: { label: "내 채널 구조 진단 요청", href: "#contact" },
    secondaryCta: { label: "운영 사례 확인", href: "#portfolio" }
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
        summary: "방문자가 10초 안에 어떤 전문가인지 이해해야\n다음 행동이 일어납니다.",
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
    label: "[ 전문직 적용 ]",
    h2: "업종마다 필요한 톤과 구조가 다릅니다.",
    lead: "세 분야에 맞는 운영 템플릿을 분리해 적용합니다.",
    cards: [
      {
        title: "변호사 · 로펌",
        oneLiner: "사건 검색 유입을 상담 문의로 연결하는 구조",
        tags: ["법률", "로펌", "상담"],
        bullets: ["의뢰 전 질문 시리즈 구조", "사건/유형 키워드 맵", "상담 전환 동선"],
        image: images.law,
        href: "#contact",
        ctaLabel: "해당 업종 진단 요청"
      },
      {
        title: "병원 · 의료",
        oneLiner: "내원 전 불안을 줄이고 신뢰를 쌓는 구조",
        tags: ["병원", "의료", "브랜딩"],
        bullets: ["환자 질문 포맷 표준화", "비교·오해·주의 구조", "신뢰 축적 루틴"],
        image: images.med,
        href: "#contact",
        ctaLabel: "해당 업종 진단 요청"
      },
      {
        title: "세무 · 회계 · 노무",
        oneLiner: "규정 이슈를 빠르게 해석해 문의로 이어지는 구조",
        tags: ["세무", "회계", "노무"],
        bullets: ["시즌/이슈 캘린더 편성", "상황별 템플릿", "판단 기준 기반 문의 설계"],
        image: images.tax,
        href: "#contact",
        ctaLabel: "해당 업종 진단 요청"
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
      "전문직 채널은 촬영 당일보다 사전 준비 시간이 더 중요합니다.\n그래서 역할을 분리해 운영합니다.",
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
    h2: "최근 운영 채널 성과",
    lead: "대표 사례 3건의 구독자 변화와 최고 조회수를 공개합니다.",
    items: [
      {
        title: "주치아 앞선tube",
        oneLiner: "신규 런칭부터 월간 포맷 운영까지 진행",
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
        oneLiner: "기존 채널 리빌딩과 SEO 기반 운영 구조 재정비",
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
        oneLiner: "장기 운영 기준 수립과 포맷 구조화 진행",
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
    h2: "예산은 영상 개수가 아니라\n운영 범위로 결정됩니다.",
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
    emphasis: "정확한 범위는 1차 진단 후 제안서에서 확정됩니다."
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
    lead: "현장 운영에서 얻은 기준과 사례를\n꾸준히 기록하고 있습니다.",
    ctaLabel: "인사이트 전체 보기"
  },
  contact: {
    label: "[ 채널 구조 진단 ]",
    h2: "현재 채널 상태를 보내주시면\n운영 우선순위를 먼저 드립니다.",
    lead: "브랜드/업종/목표를 남겨주시면\n1영업일 내 답변드립니다.",
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
