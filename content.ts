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
  caseSlug: string;
  oneLiner: string;
  tags: string[];
  result: string;
  scope?: string;
  before?: string;
  action?: string;
  after?: string;
  proof?: string;
  operatingPeriod?: string;
  monthlyVolume?: string;
  contentFormats?: string;
  distributionStrategy?: string;
  qualitativeSignal?: string;
  operatingPrinciple?: string;
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

export type ServicePillarCard = {
  title: string;
  headline: string;
  body: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
};

export type ExclusionItem = {
  title: string;
  body: string;
};

export type ProductionCrewCard = {
  role: string;
  headline: string;
  bullets: string[];
};

export type VideoQualityProof = {
  label: string;
  h2: string;
  lead: string;
  points: string[];
  note: string;
};

export type LeadershipProfile = {
  name: string;
  role: string;
  body: string;
};

export type ReportSample = {
  label: string;
  h2: string;
  lead: string;
  rows: {
    label: string;
    value: string;
  }[];
  note: string;
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
  exclusions: {
    label: string;
    h2: string;
    lead: string;
    items: ExclusionItem[];
  };
  videoQuality: VideoQualityProof;
  servicePillars: {
    label: string;
    h2: string;
    lead: string;
    cards: ServicePillarCard[];
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
  reportSample: ReportSample;
  leadership: {
    label: string;
    h2: string;
    lead: string;
    people: LeadershipProfile[];
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
  riskManagement: {
    label: string;
    h2: string;
    lead: string;
    items: string[];
    note: string;
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
    title: "전문직·고관여 브랜드 유튜브 운영팀 | Turnkeyhaus",
    description:
      "전문직·고관여 브랜드의 외부 유튜브 운영팀입니다. 월간 채널 운영으로 시작해 사내 영상 제작 시스템과 영상 인재 실무평가까지 구축합니다.",
    keywords: [
      "유튜브 채널 운영대행",
      "전문직 유튜브 운영대행",
      "인천 유튜브 대행",
      "수도권 유튜브 대행",
      "병원 유튜브 마케팅",
      "로펌 유튜브 마케팅",
      "세무사 유튜브 마케팅",
      "노무사 유튜브 마케팅",
      "기업 유튜브 운영대행",
      "공공기관 유튜브 운영대행",
      "B2B 유튜브 운영대행",
      "전문직 유튜브 진단",
      "3개월 검증 운영",
      "인하우스 영상팀 구축",
      "영상 PD 채용 실무평가",
      "유튜브 SEO GEO"
    ],
    openGraphTitle: "전문직·고관여 브랜드 유튜브 운영팀 | Turnkeyhaus",
    openGraphDescription:
      "외주 운영으로 시작해 내부팀이 스스로 운영할 수 있는 기준까지 만듭니다. 월간 운영, 인하우스 구축, 영상 인재 실무평가를 함께 제공합니다.",
    locale: "ko_KR"
  },
  nav: [
    { label: "월간 운영", href: "/#services" },
    { label: "내부팀 구축", href: "/inhouse-video-system" },
    { label: "채용 평가", href: "/video-hiring-evaluation" },
    { label: "사례", href: "/#portfolio" },
    { label: "요금제", href: "/#pilot" },
    { label: "인사이트", href: "/insights" },
    { label: "상담", href: "/#contact" }
  ],
  heroValue: {
    headline: "전문직·고관여 브랜드의\n유튜브 운영팀을\n통째로 맡습니다.",
    body: "턴키하우스는 전문직·고관여 브랜드를 위한 외부 유튜브 운영팀입니다.\n채널 기획·대본·촬영·편집·썸네일·업로드·성과 리포트까지 월간 운영 단위로 맡고, 필요하면 사내 영상 제작 시스템과 영상 인재 실무평가까지 함께 구축합니다.",
    primaryCta: { label: "운영 플랜 확인하기", href: "#pilot" },
    secondaryCta: { label: "채널 구조 진단 받기", href: "#contact" }
  },
  heroStats: {
    totalVideoViews: 20200000
  },
  problem: {
    label: "[ 문제 · 현실 점검 ]",
    h2: "영상 한 편보다\n운영팀이 필요한 이유",
    lead:
      "고신뢰·고관여 채널은 영상미보다 먼저\n고객이 안심하고 문의할 이유가 보여야 합니다.\n\n타깃 질문이 분산되어 있고,\n롱폼·숏폼 역할이 섞여 있으며,\n상담/내원 CTA가 일관되지 않으면\n좋은 콘텐츠도 구매 결정까지 이어지지 않습니다.",
    items: [
      "고객이 돈을 내기 전 느끼는 불안을 먼저 제거해야 합니다.",
      "좋은 영상보다 중요한 것은 검색-비교-문의로 이어지는 순서입니다.",
      "처음부터 장기계약을 강요하기보다 진단과 3개월 검증 운영으로 불안을 낮춰야 합니다."
    ],
    emphasis: "문제는 영상 제작 능력만이 아니라, 매달 같은 기준으로 운영하고 개선할 팀이 있느냐입니다."
  },
  exclusions: {
    label: "[ 운영 원칙 ]",
    h2: "턴키하우스가\n하지 않는 일",
    lead:
      "처음부터 맞지 않는 의뢰를 받으면 서로 손해입니다.\n그래서 턴키하우스는 운영 성과와 무관한 단발 제작을 기준 상품으로 두지 않습니다.",
    items: [
      {
        title: "단건 촬영·편집만 별도로 진행하지 않습니다.",
        body: "채널 성과는 주제 설계, 대본, 촬영, 편집, 썸네일, 업로드, 리포트가 함께 맞물릴 때 만들어집니다."
      },
      {
        title: "조회수만 노리는 바이럴 영상을 목표로 삼지 않습니다.",
        body: "브랜딩 채널의 목적은 순간 노출보다 검색·비교·문의로 이어지는 누적 자산을 만드는 것입니다."
      },
      {
        title: "월간 운영 기준이 맞는 프로젝트만 맡습니다.",
        body: "업종, 승인 구조, 촬영 환경, 내부 리소스를 확인한 뒤 운영 가능 범위와 계약 방식을 제안합니다."
      }
    ]
  },
  videoQuality: {
    label: "[ 제작 품질 ]",
    h2: "영상미는 기본,\n운영 구조가 차이를 만듭니다.",
    lead:
      "턴키하우스는 운영형 콘텐츠라도 영상 퀄리티를 포기하지 않습니다.\nSony FX 시네마 라인 기반 멀티캠 촬영, 자연스러운 피부 보정, 색보정, 인물 조명으로 기본 완성도를 확보하고, 콘텐츠 기획·대본·촬영·편집·썸네일·업로드·성과 리포트까지 월간 운영합니다.",
    points: [
      "Sony FX 시네마 라인 기반 촬영",
      "2~3카메라 멀티캠 구성",
      "인터뷰/토크형 콘텐츠 4앵글 이상 편집",
      "자연스러운 피부 보정·색보정",
      "출연자별 조명·프레이밍 세팅",
      "월간 운영 리포트 포함"
    ],
    note: "화면 퀄리티는 출발점입니다. 턴키하우스는 그 위에 주제·대본·업로드·리포트까지 묶어 채널이 매달 같은 기준으로 움직이게 만듭니다."
  },
  servicePillars: {
    label: "[ 운영 서비스 ]",
    h2: "외부 운영팀부터\n내부팀 구축까지",
    lead:
      "턴키하우스는 유튜브를 대신 운영하는 데서 끝나지 않습니다.\n조직이 스스로 운영할 수 있는 기준까지 만들 수 있도록 3가지 방식으로 지원합니다.",
    cards: [
      {
        title: "Turnkey Channel Ops",
        headline: "월간 유튜브 운영대행",
        body: "채널 전략, 콘텐츠 기획, 대본/질문지, 촬영, 편집, 썸네일, 업로드, SEO, 성과 리포트까지 한 팀으로 운영합니다.",
        bullets: ["월간 콘텐츠 캘린더", "촬영 전 대본·질문지", "업로드/SEO/CTA 세팅", "월간 리포트와 다음 달 개선"],
        href: "#pilot",
        ctaLabel: "월간 운영 플랜 보기"
      },
      {
        title: "In-house Video System Build",
        headline: "사내 영상 제작 시스템 구축",
        body: "장비 구성, 촬영 공간, 편집 워크플로우, 파일 관리, 템플릿, 리포트 양식까지 내부팀이 반복 운영할 기준을 만듭니다.",
        bullets: ["장비·공간 구성", "제작 SOP와 템플릿", "파일/업로드 관리 기준", "내부 담당자 교육"],
        href: "/inhouse-video-system",
        ctaLabel: "내부팀 구축 방식 보기"
      },
      {
        title: "Video Talent Evaluation",
        headline: "영상 인재 실무평가 지원",
        body: "PD·편집자·콘텐츠 마케터 채용 시 직무기술서, 포트폴리오 검토 기준, 실무 과제, 면접 질문지를 설계합니다.",
        bullets: ["직무기술서 정리", "포트폴리오 평가표", "실무 과제 설계", "면접 동석/평가 의견"],
        href: "/video-hiring-evaluation",
        ctaLabel: "채용 평가 지원 보기"
      }
    ]
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
    h2: "촬영 이전에,\n전환 기준부터 합의합니다.",
    lead: "전문직 채널은 예쁘게 찍는 것보다, 고객이 안심하고 문의할 이유를 먼저 설계해야 합니다.",
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
    keyline: "영상 한 편보다, 3개월 뒤 의사결정에 쓸 수 있는 채널 구조와 증거를 남깁니다."
  },
  professionalTargets: {
    label: "[ 업종별 적용 ]",
    h2: "전문직을 중심으로\n고관여 업종까지 확장합니다.",
    lead:
      "첫 번째 축은 병원·로펌·세무/노무/회계입니다.\n여기에 기업·공공기관처럼 의사결정 과정이 긴 업종을 더해, 검색·비교·문의·내부 결재까지 이어지는 채널 구조를 설계합니다.",
    cards: [
      {
        title: "병원·의원 유튜브",
        oneLiner: "진료 전문성을 내원 전 질문과 안심 근거로 바꾸는 구조",
        tags: ["병원", "내원 전환", "의료 신뢰"],
        bullets: ["진료과목별 검색 질문 맵 설계", "원장 브랜딩과 의료법 표현 리스크 점검", "내원 전 FAQ·CTA 동선 정리"],
        image: images.med,
        href: "/medical-youtube",
        ctaLabel: "병원 운영 방식 보기"
      },
      {
        title: "변호사·로펌 유튜브",
        oneLiner: "사건 분야별 검색 유입을 상담 전환 동선으로 연결하는 구조",
        tags: ["로펌", "수임 전환", "법률 브랜딩"],
        bullets: ["사건 분야별 주제 클러스터 설계", "변호사 광고규정 관점의 표현 점검", "상담 전 비교·오해·주의 포인트 정리"],
        image: images.law,
        href: "/lawfirm-youtube",
        ctaLabel: "로펌 운영 방식 보기"
      },
      {
        title: "세무·노무·회계 유튜브",
        oneLiner: "시즌성 이슈를 상담으로 이어지는 정보 자산으로 쌓는 구조",
        tags: ["세무", "회계", "노무"],
        bullets: ["부가세·종소세·법인세 시즌 캘린더 편성", "상황별 판단 기준 템플릿화", "신고/분쟁 전 문의 CTA 설계"],
        image: images.tax,
        href: "/tax-youtube",
        ctaLabel: "세무·노무 운영 방식 보기"
      },
      {
        title: "기업·공공기관 유튜브",
        oneLiner: "복잡한 사업과 정책을 신뢰 가능한 월간 커뮤니케이션 자산으로 바꾸는 구조",
        tags: ["기업", "공공기관", "B2B"],
        bullets: ["사업/정책/성과를 월간 콘텐츠 캘린더로 정리", "내부 승인 구조와 공식 문서 톤을 고려한 대본 설계", "필요 시 내부 영상팀 구축·이관까지 연동"],
        image: images.structure,
        href: "/business-public-youtube",
        ctaLabel: "기업·공공 운영 방식 보기"
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
  reportSample: {
    label: "[ 리포트 샘플 ]",
    h2: "조회수 보고가 아니라\n다음 달 운영 기준을 남깁니다.",
    lead:
      "월간 리포트는 잘 나온 숫자를 나열하는 문서가 아닙니다.\n이번 달 콘텐츠가 어떤 역할을 했고, 다음 달에는 무엇을 고쳐야 하는지 내부 의사결정에 쓸 수 있게 정리합니다.",
    rows: [
      { label: "업로드 기록", value: "지난달 업로드 콘텐츠와 포맷별 역할 정리" },
      { label: "콘텐츠 역할", value: "검색형 / 설득형 / 전환형 / 브랜딩형으로 분류" },
      { label: "성과 지표", value: "조회수, CTR, 유입 경로, 검색 유입 키워드 확인" },
      { label: "전환 신호", value: "상담 가능성이 높은 콘텐츠와 CTA 반응 점검" },
      { label: "다음 액션", value: "다음 달 개선 우선순위와 콘텐츠 캘린더 제안" }
    ],
    note: "리포트는 담당자가 바뀌어도 채널 운영 히스토리가 끊기지 않도록 남기는 운영 자산입니다."
  },
  leadership: {
    label: "[ 전담 리드 ]",
    h2: "누가 무엇을 책임지는지\n먼저 공개합니다.",
    lead:
      "작은 팀의 장점은 담당자가 자주 바뀌지 않는다는 점입니다.\n턴키하우스는 역할별 책임자를 고정해 채널 톤과 운영 히스토리를 이어갑니다.",
    people: [
      {
        name: "채동우",
        role: "Strategy & Account Lead / TKDG Labs 대표",
        body:
          "2016년부터 유튜브 콘텐츠 기획·제작·운영 현장에서 일해온 유튜브 네이티브 PD입니다. 방송인 매니지먼트와 브랜드 콘텐츠 제작 경험을 바탕으로 전문직·고관여 브랜드의 채널 전략, 촬영 운영, 성과 리포트, 고객 커뮤니케이션을 총괄합니다."
      },
      {
        name: "양현",
        role: "Channel Producer / Turnkeyhaus Lead",
        body:
          "콘텐츠 캘린더, 대본·질문지, 촬영 구성, 업로드 구조를 설계합니다. 출연자의 전문지식이 시청자가 이해할 수 있는 콘텐츠로 바뀌도록 주제와 흐름을 정리합니다."
      },
      {
        name: "손현우",
        role: "Visual Production Lead / Pic_sta Lead",
        body:
          "촬영, 조명, 인물 연출, 멀티캠 구성, 사진·영상 후반 품질을 관리합니다. 시네마캠 기반 촬영과 자연스러운 피부 보정으로 전문직 출연자의 신뢰감 있는 화면을 만듭니다."
      }
    ]
  },
  portfolio: {
    label: "[ 포트폴리오 ]",
    h2: "숫자보다 먼저,\n어디까지 맡았는지 공개합니다.",
    lead: "고객이 궁금한 건 단순 조회수가 아니라 실제 역할 범위입니다.\n각 사례마다 시작 상태, 맡은 범위, 운영 결과를 함께 보여드립니다.",
    items: [
      {
        title: "주치아 앞선tube",
        clientName: "더앞선치과병원",
        caseSlug: "the-apseon-dental-youtube",
        oneLiner: "신규 런칭부터 월간 포맷 운영까지 진행",
        tags: ["치과", "런칭", "운영"],
        result: "구독자 0 → 559명",
        scope: "신규 채널 런칭 / 월간 포맷 운영 / 촬영·편집·업로드 세팅",
        before: "채널 자산이 거의 없는 상태에서 시작",
        action: "진료 질문 기반 주제 선정, 원장님 화법 정리, 롱폼·숏폼 역할 분리",
        after: "신규 채널 기준 구독자 559명까지 성장",
        proof: "치과 검색 질문형 대표 영상과 채널 포맷 운영",
        operatingPeriod: "신규 런칭~초기 월간 운영 구간",
        monthlyVolume: "월간 촬영 기반 롱폼·숏폼 병행",
        contentFormats: "원장 설명형 롱폼, 진료 질문형 숏폼, 채널 홈 세팅",
        distributionStrategy: "진료과목별 질문을 제목·썸네일에 먼저 노출하고 설명란과 고정 댓글 CTA를 정리",
        qualitativeSignal: "신규 채널임에도 치과 검색 질문형 콘텐츠로 초기 구독과 조회 신호 확보",
        operatingPrinciple: "신규 채널은 화려한 포맷보다 반복 가능한 질문 구조가 먼저입니다.",
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
        caseSlug: "sunnyullo-lawfirm-youtube",
        oneLiner: "기존 채널 리빌딩과 SEO 기반 운영 구조 재정비",
        tags: ["로펌", "리빌딩", "브랜딩"],
        result: "구독자 500 → 5,990명",
        scope: "기존 채널 리빌딩 / 법률 주제 SEO 설계 / 제목·썸네일·운영 구조 개선",
        before: "정보 전달은 있었지만 사건 분야별 검색 유입과 상담 동선이 약한 상태",
        action: "사건 분야별 콘텐츠 클러스터를 만들고, 수임 전 질문 중심으로 제목/구조 재정비",
        after: "구독자 500명에서 5,990명까지 성장, 최고 조회수 37만회 기록",
        proof: "대표 영상, 주제 클러스터, 검색형 제목 운영",
        operatingPeriod: "기존 채널 리빌딩 이후 월간 운영 구간",
        monthlyVolume: "법률 주제별 롱폼과 재편집 숏폼 병행",
        contentFormats: "사건 분야 설명형 콘텐츠, 이슈 해설형 콘텐츠, 상담 전 FAQ형 콘텐츠",
        distributionStrategy: "사건 분야별 검색 의도에 맞춰 제목·썸네일·재생목록을 재정렬",
        qualitativeSignal: "정보 전달형 채널에서 사건 분야별 상담 전 비교 채널로 인지가 바뀌는 흐름 확보",
        operatingPrinciple: "법률 채널은 조회수보다 사건 분야별 신뢰와 상담 전 질문 해소가 먼저입니다.",
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
        caseSlug: "yooan-orthopedics-youtube",
        oneLiner: "장기 운영 기준 수립과 포맷 구조화 진행",
        tags: ["채널 운영", "구조화", "자산화"],
        result: "구독자 2.2천 → 11.7만",
        scope: "장기 운영 구조 수립 / 질환별 포맷화 / 검색·추천 유입 관리",
        before: "업로드 자산은 있었지만 장기 운영 기준과 포맷 구조화가 필요한 상태",
        action: "질환별 검색 질문, 원장 전문성, 시청 후 내원 인지를 연결하는 포맷 운영",
        after: "구독자 2.2천명에서 11.7만명까지 성장, 단일 영상 최고 218만회 기록",
        proof: "정형외과 질환 검색형 영상과 장기 구독자 성장 흐름",
        operatingPeriod: "장기 운영 기준 수립 및 반복 포맷 운영 구간",
        monthlyVolume: "질환 검색형 롱폼과 숏폼 재가공 병행",
        contentFormats: "질환 설명형 롱폼, 원장 신뢰형 콘텐츠, 검색 질문형 숏폼",
        distributionStrategy: "질환명·증상·치료 질문을 중심으로 검색 유입과 추천 확장을 함께 설계",
        qualitativeSignal: "시간이 지나도 검색과 추천으로 다시 발견되는 장기 콘텐츠 자산 형성",
        operatingPrinciple: "의료 채널은 단기 반응보다 오래 남는 질환별 아카이브가 힘을 만듭니다.",
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
        caseSlug: "elife-magazine-esports-youtube",
        oneLiner: "숏폼·광고 없이 SEO 기반 롱폼 4편만으로 누적 조회수 2,926회",
        tags: ["e스포츠", "SEO", "롱폼 4편", "무광고"],
        result: "0명에서 시작 (운영 초기)",
        scope: "신규 채널 초기 세팅 / SEO 기반 롱폼 기획 / 무광고 운영",
        before: "구독자 0명, 채널 자산 없이 시작",
        action: "숏폼 없이 롱폼 4편만으로 검색 의도와 이슈 키워드 중심 편성",
        after: "광고 없이 누적 조회수 2,926회 기록",
        proof: "롱폼 4편만으로 발생한 초기 검색 유입 성과",
        operatingPeriod: "채널 신규 세팅 및 초기 롱폼 4편 운영 구간",
        monthlyVolume: "SEO 기반 롱폼 4편 집중 운영",
        contentFormats: "e스포츠 이슈 해설형 롱폼, 검색 의도 기반 제목·설명 세팅",
        distributionStrategy: "쇼츠·광고 없이 검색 의도와 이슈 키워드가 만나는 제목/설명 구조로 운영",
        qualitativeSignal: "구독자 0명에서 시작해 롱폼 4편만으로 누적 조회수 2,926회 확보",
        operatingPrinciple: "신규 채널도 주제와 검색 의도가 맞으면 광고 없이 초기 발견성을 만들 수 있습니다.",
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
    label: "[ 운영 플랜 ]",
    h2: "처음부터 1년 계약하지 말고\n운영 적합성부터 확인하세요.",
    levels: [
      {
        title: "24시간 3포인트 진단",
        priceBand: "무료",
        bullets: [
          "채널 링크 기준 24시간 내 1차 연락",
          "제목/썸네일 문제 1개",
          "주제 구조 문제 1개",
          "문의 CTA 문제 1개"
        ],
        target: "대상: 지금 외주를 맡겨도 되는지 빠르게 판단하고 싶은 경우"
      },
      {
        title: "운영 진단 리포트",
        priceBand: "49만원",
        bullets: [
          "현재 채널·경쟁 채널 3개 분석",
          "주제 20개와 3개월 검증 운영표 제안",
          "썸네일/제목 개선안",
          "상담 전환 동선 점검"
        ],
        target: "대상: 내부 결재용 근거와 실행안을 먼저 확보해야 하는 경우"
      },
      {
        title: "Managed Starter",
        priceBand: "3개월부터",
        bullets: [
          "월간 기획과 촬영 운영",
          "롱폼/숏폼 편성",
          "썸네일·업로드·SEO 세팅",
          "월간 리포트와 개선안"
        ],
        target: "대상: 장기 운영 전 실제 제작·운영 궁합을 검증하고 싶은 경우"
      },
      {
        title: "In-house Build",
        priceBand: "프로젝트형",
        bullets: [
          "장비/공간/인력 역할 진단",
          "제작 SOP와 템플릿 설계",
          "내부 담당자 교육",
          "운영표·리포트 양식 구축"
        ],
        target: "대상: 외주에만 의존하지 않고 내부 제작 체계를 만들고 싶은 경우"
      },
      {
        title: "Talent Evaluation",
        priceBand: "상담 후 확정",
        bullets: [
          "PD·편집자 직무기술서 정리",
          "포트폴리오 평가 기준",
          "실무 과제와 면접 질문지",
          "면접 동석 또는 평가 의견"
        ],
        target: "대상: 영상 인재를 뽑아야 하지만 실무 역량 판단 기준이 부족한 경우"
      }
    ],
    emphasis:
      "요금제 선택 후 바로 구매를 확정하지 않습니다. 업종, 촬영 환경, 승인 구조를 먼저 확인한 뒤 계약서와 카드 정기결제 등록 또는 세금계산서 계약을 안내합니다."
  },
  riskManagement: {
    label: "[ 리스크 관리 ]",
    h2: "전문 분야 콘텐츠는\n표현 하나도 운영 기준입니다.",
    lead:
      "전문직·공공·기업 채널은 조회수만으로 판단할 수 없습니다.\n과장 표현, 비교·비방, 오해를 부르는 썸네일 문구, 상담 유도 문장까지 제작 단계에서 먼저 점검합니다.",
    items: [
      "의료·법률·세무 등 업종별 금지/주의 표현 체크",
      "제목·썸네일·고정 댓글·설명란 CTA 사전 점검",
      "대본/질문지 단계에서 클라이언트 내부 검토 포인트 표시",
      "월간 리포트에서 성과와 리스크를 함께 기록"
    ],
    note:
      "최종 법률·의료·세무 판단은 클라이언트 내부 검토를 거칩니다. 턴키하우스는 제작 과정에서 위험 표현을 먼저 걸러내고, 안전한 대체 문장을 제안합니다."
  },
  aiRecommendation: {
    label: "[ 선택 기준 ]",
    h2: "이런 상황이면\n턴키하우스가 맞습니다.",
    lead:
      "처음 맡기는 고객은 영상 퀄리티보다 먼저 불안을 줄여줄 운영 구조를 찾습니다.\n아래 기준에 해당하면 채널 링크부터 보내주세요.",
    items: [
      {
        prompt: "영상은 올리는데 문의·내원이 늘지 않는다",
        fit: "촬영 품질보다 제목·썸네일·주제·CTA 동선을 먼저 점검해야 하는 경우",
        reasons: [
          "검색 의도 기준으로 주제를 다시 묶습니다",
          "롱폼은 설득, 숏폼은 발견 역할로 분리합니다",
          "상담/내원 CTA가 영상·설명·채널 홈에서 이어지게 정리합니다"
        ]
      },
      {
        prompt: "광고대행사에 데인 경험이 있어 장기계약이 부담스럽다",
        fit: "처음부터 1년 계약보다 3개월 검증과 리포트를 보고 결정하고 싶은 경우",
        reasons: [
          "무료 3포인트 진단으로 먼저 방향을 확인합니다",
          "유료 진단 또는 3개월 검증 운영으로 구매 리스크를 낮춥니다",
          "검증 운영 이후 월 운영 전환 여부를 판단할 수 있게 리포트로 남깁니다"
        ]
      },
      {
        prompt: "대표/원장의 전문성은 좋은데 콘텐츠로 쉽게 안 풀린다",
        fit: "전문 용어를 고객 언어로 바꾸고, 신뢰를 잃지 않는 표현 기준이 필요한 경우",
        reasons: [
          "대본·질문 리스트를 촬영 전에 확정합니다",
          "의료/법률/세무 표현 리스크를 체크리스트로 관리합니다",
          "잘난 척이 아니라 고객이 안심하는 설명 흐름으로 바꿉니다"
        ]
      }
    ],
    note: "해당되는 항목이 있다면, 아래 운영 플랜 추천기에서 우리 조직에 맞는 운영 방식부터 먼저 확인해 보세요."
  },
  faq: {
    label: "[ 운영 안내 ]",
    h2: "계약 전 꼭 확인하실\n실무 기준입니다.",
    items: [
      {
        q: "성과는 언제부터 확인할 수 있나요?",
        a: "첫 연락과 1차 방향성은 빠르게 잡습니다. 초기 반응은 1~2개월 내 확인할 수 있고, 유의미한 상담/내원 전환은 보통 3개월 검증 운영 이후 장기 운영에서 더 정확히 판단합니다."
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
        q: "단건 촬영이나 편집만 의뢰할 수 있나요?",
        a: "턴키하우스는 단건 촬영·편집만 별도로 진행하지 않습니다. 채널 성과는 주제 설계, 대본, 촬영, 편집, 썸네일, 업로드, 리포트가 함께 맞물릴 때 만들어지기 때문에 최소 월간 운영 단위로만 진행합니다."
      },
      {
        q: "지역 제한이 있나요?",
        a: "전국 대응합니다. 오프라인 컨설팅 비용(서울·수도권 15만원 / 그 외 지역 25만원)은 계약 전 1회 컨설팅에만 적용됩니다. 계약 후 촬영 출장비는 지방 여부와 관계없이 별도 청구하지 않습니다."
      },
      {
        q: "계약 전에 무엇을 준비하면 되나요?",
        a: "현재 채널 링크, 업종/서비스 특징, 이번 분기 목표, 내부 리소스(출연자·담당자·촬영 공간 유무)만 정리해 주시면 1차 제안과 우선순위를 빠르게 드릴 수 있습니다."
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
    h2: "채널 링크를 보내주시면\n24시간 내 3가지만 먼저 짚어드립니다.",
    lead: "제목/썸네일 문제 1개, 주제 구조 문제 1개, 문의 CTA 문제 1개를 먼저 보내드립니다.\n정밀 진단 리포트가 필요한 경우 이후 유료 진단 또는 3개월 검증 운영으로 이어갑니다.",
    midCtaEyebrow: "채널 진단",
    midCtaTitle: "24시간 안에 먼저 볼 3가지 문제를 정리해 드립니다.",
    panelTitle: "상담 예약하기",
    panelBody: "현재 채널 링크와 목표를 남겨주시면\n전문직 전환 구조 관점으로 먼저 확인합니다.",
    panelHint: "Google Form은 임베드 URL만 사용합니다. (forms.gle 공유 링크 직접 사용 금지)",
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScnyuTnc051RnX8yaGNlPW6TSOe9INyaV-Gp8lc8xqUSL6kQg/viewform?embedded=true",
    googleFormShareUrl: "https://forms.gle/L58BK4pc3gEq81iM9",
    primaryCtaLabel: "24시간 3포인트 진단 받기",
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
