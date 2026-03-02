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

export type CtaLink = {
  label: string;
  href: string;
};

export type StrategyStep = {
  title: string;
  detail: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  sections: BlogSection[];
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
    posts: BlogPost[];
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
    siteUrl: "https://www.turnkey.haus",
    canonical: "https://www.turnkey.haus",
    ogImagePath: "/og.png",
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
    openGraphTitle: "전문직 유튜브 브랜딩 시스템",
    openGraphDescription: "전문직만을 위한 유튜브 전략 설계 및 운영",
    locale: "ko_KR"
  },
  nav: [
    { label: "문제", href: "#problem" },
    { label: "방식", href: "#approach" },
    { label: "전문직 적용", href: "#professional" },
    { label: "실행 증거", href: "#proof" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "인사이트", href: "/blog" },
    { label: "운영 레벨", href: "#pricing" },
    { label: "채널 진단", href: "#contact" }
  ],
  heroValue: {
    headline: "전문직을 위한 유튜브 브랜딩 대행 시스템",
    body: "문제 정의 → 구조 설계 → 실행 → 측정을\n한 흐름으로 운영합니다.",
    primaryCta: { label: "채널 구조 진단 요청", href: "#contact" },
    secondaryCta: { label: "포트폴리오 보기", href: "#portfolio" }
  },
  problem: {
    label: "[ 문제 · 현실 점검 ]",
    h2: "대부분의 채널은\n성장이 쉽지 않습니다.",
    lead:
      "콘텐츠를 꾸준히 올려도\n채널의 방향이 선명해지지 않는 경우가 많습니다.\n\n유튜브는 단기 제작이 아니라 운영 설계입니다.\n조회수보다 중요한 것은\n일관된 기준과 구조입니다.",
    items: [],
    emphasis: "문제는 양이 아니라 구조입니다."
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
      { src: "/images/showreel-cover.jpg", alt: "Turnkeyhaus 실행 기반 대표 이미지" }
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
  faq: {
    label: "[ FAQ ]",
    h2: "도입 전에 가장 많이 묻는 질문입니다.",
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
    h2: "유입을 만드는 검색형 콘텐츠 아카이브",
    lead: "홈페이지는 전환을 담당하고, 블로그는 검색 유입을 담당합니다.",
    ctaLabel: "인사이트 전체 보기",
    posts: [
      {
        slug: "why-tax-accountant-youtube",
        title: "세무사 유튜브를 해야 하는 이유",
        excerpt:
          "세무 서비스는 신뢰가 선행되어야 상담으로 이어집니다. 검색형 영상 아카이브를 구축하면 잠재 고객의 질문을 먼저 선점할 수 있습니다.",
        category: "세무사 유튜브",
        publishedAt: "2026-03-03",
        readTime: "5분",
        seoTitle: "세무사 유튜브를 해야 하는 이유 | Turnkeyhaus",
        seoDescription:
          "세무사 유튜브 제작이 필요한 이유와 검색 기반 콘텐츠 구조, 상담 전환 동선 설계 방법을 정리합니다.",
        keywords: ["세무사 유튜브 제작", "세무사 유튜브", "전문직 유튜브 대행"],
        sections: [
          {
            heading: "세무사는 왜 유튜브가 필요한가",
            paragraphs: [
              "세무 상담은 서비스 구매 전 정보 탐색 구간이 길고, 고객은 반복적으로 같은 질문을 검색합니다.",
              "이때 텍스트만으로는 전달되지 않는 판단 기준을 영상으로 정리하면 신뢰 형성 속도가 달라집니다."
            ]
          },
          {
            heading: "조회수보다 중요한 설계 기준",
            paragraphs: [
              "세무 채널은 바이럴보다 검색형 누적 구조가 유리합니다. 시즌성 이슈를 기준으로 아카이브를 설계해야 합니다."
            ],
            bullets: [
              "신고 시즌/이슈 캘린더 기반 편성",
              "상황별 질문 템플릿 표준화",
              "영상 말미 상담 전환 CTA 일관화"
            ]
          },
          {
            heading: "운영 관점 결론",
            paragraphs: [
              "세무사 유튜브는 채널 성장 자체보다 상담 품질과 리드 신뢰도를 높이는 운영 시스템으로 봐야 성과가 안정됩니다."
            ]
          }
        ]
      },
      {
        slug: "lawyer-youtube-success-case",
        title: "변호사 유튜브 성공 사례 분석",
        excerpt:
          "법률 채널은 사건 홍보보다 판단 프레임을 반복적으로 보여주는 구조가 핵심입니다. 성공 사례의 공통 패턴을 구조 관점에서 분석합니다.",
        category: "변호사 유튜브",
        publishedAt: "2026-03-03",
        readTime: "6분",
        seoTitle: "변호사 유튜브 성공 사례 분석 | Turnkeyhaus",
        seoDescription:
          "변호사 유튜브 제작과 운영에서 성공한 채널의 공통 전략을 포지셔닝, 포맷, CTA 구조로 분석합니다.",
        keywords: ["변호사 유튜브 제작", "변호사 유튜브", "유튜브 브랜딩 대행"],
        sections: [
          {
            heading: "성공 채널의 공통점",
            paragraphs: [
              "성공한 법률 채널은 개별 사건보다 의뢰 전 판단 기준을 체계적으로 설명합니다.",
              "시청자는 사건 자체보다 '내 상황에도 적용 가능한 기준'을 얻을 때 상담으로 이동합니다."
            ]
          },
          {
            heading: "운영 구조로 보면",
            paragraphs: [
              "단발성 이슈 대응이 아니라, 핵심 질문군을 포맷으로 고정해 누적하는 설계가 필요합니다."
            ],
            bullets: [
              "의뢰 전 질문 시리즈 고정 편성",
              "사건 유형 키워드 맵 구축",
              "상담 유도 CTA 문구 통일"
            ]
          },
          {
            heading: "실행 팁",
            paragraphs: [
              "변호사 유튜브는 전문성을 과시하는 채널이 아니라, 고객의 의사결정을 돕는 채널일 때 전환 효율이 올라갑니다."
            ]
          }
        ]
      },
      {
        slug: "why-youtube-matters-for-professional-marketing",
        title: "전문직 마케팅에서 유튜브가 중요한 이유",
        excerpt:
          "전문직 마케팅은 신뢰를 축적하는 채널이 필요합니다. 유튜브는 검색, 설득, 전환을 하나의 흐름으로 연결할 수 있는 매체입니다.",
        category: "전문직 유튜브",
        publishedAt: "2026-03-03",
        readTime: "5분",
        seoTitle: "전문직 마케팅에서 유튜브가 중요한 이유 | Turnkeyhaus",
        seoDescription:
          "전문직 유튜브 대행 관점에서 검색 유입과 상담 전환을 동시에 설계해야 하는 이유를 설명합니다.",
        keywords: ["전문직 유튜브 대행", "전문직 유튜브", "유튜브 컨설팅"],
        sections: [
          {
            heading: "전문직 마케팅의 본질",
            paragraphs: [
              "전문직 서비스는 가격보다 판단 신뢰가 먼저 작동합니다.",
              "따라서 단기 노출형 광고보다 기준을 반복적으로 설명하는 채널이 필요합니다."
            ]
          },
          {
            heading: "유튜브가 갖는 구조적 장점",
            paragraphs: [
              "유튜브는 검색 유입을 받으면서 동시에 영상으로 설명 밀도를 높일 수 있어 전문직에 적합합니다."
            ],
            bullets: [
              "검색형 유입: 문제 인지 단계 선점",
              "영상 설명: 신뢰 형성 가속",
              "전환 동선: 상담 요청 연결"
            ]
          },
          {
            heading: "홈페이지와의 역할 분리",
            paragraphs: [
              "홈페이지는 전환, 블로그/유튜브는 유입에 집중해야 운영 효율이 올라갑니다. 채널 간 역할 충돌을 줄이는 것이 핵심입니다."
            ]
          }
        ]
      },
      {
        slug: "hospital-youtube-branding-strategy",
        title: "병원 유튜브 브랜딩 전략",
        excerpt:
          "병원 채널은 정보 전달만으로 차별화되지 않습니다. 환자 불안을 줄이는 설명 구조와 내원 전환 동선을 함께 설계해야 합니다.",
        category: "병원 유튜브",
        publishedAt: "2026-03-03",
        readTime: "6분",
        seoTitle: "병원 유튜브 브랜딩 전략 | Turnkeyhaus",
        seoDescription:
          "병원 유튜브 브랜딩 전략과 환자 질문 포맷, 내원 전환 구조를 운영 관점에서 정리합니다.",
        keywords: ["병원 유튜브 브랜딩", "의사 유튜브 마케팅", "유튜브 브랜딩 대행"],
        sections: [
          {
            heading: "병원 채널이 어려운 이유",
            paragraphs: [
              "의학 정보 채널은 유사 콘텐츠가 많아 전달 방식만으로는 구분되지 않습니다.",
              "환자 입장에서 이해하기 쉬운 설명 순서와 톤을 고정해야 신뢰가 쌓입니다."
            ]
          },
          {
            heading: "내원 전환까지 고려한 구조",
            paragraphs: [
              "의료 콘텐츠는 정확성뿐 아니라 오해 가능성 관리가 중요합니다."
            ],
            bullets: [
              "환자 질문 포맷 표준화",
              "비교·오해·주의 구조 분리",
              "내원 전 행동 유도 CTA 설계"
            ]
          },
          {
            heading: "운영 기준",
            paragraphs: [
              "병원 유튜브는 단기 조회수보다 장기 신뢰 자산 구축을 목표로 두어야 광고 효율과 채널 효율을 동시에 높일 수 있습니다."
            ]
          }
        ]
      }
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
