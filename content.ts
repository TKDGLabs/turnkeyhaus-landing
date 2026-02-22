export type NavItem = {
  label: string;
  href: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type ProblemSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  items: string[];
  emphasis: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type ProcessSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
  emphasis: string;
};

export type ProfessionalTargetCard = {
  title: string;
  oneLiner: string;
  bullets: string[];
  href: string;
  hrefLabel: string;
  image: ImageAsset;
};

export type ProfessionalTargetsSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  cards: ProfessionalTargetCard[];
};

export type BrandStructureSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  emphasis: string;
  image: ImageAsset;
};

export type StudioProofItem = {
  image: ImageAsset;
  captionTop: string;
  captionBottom: string;
};

export type StudioProofSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  items: StudioProofItem[];
};

export type DifferentiationSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  headline: string;
  paragraphs: string[];
  emphasis: string;
  image: ImageAsset;
};

export type PortfolioItem = {
  title: string;
  oneLiner: string;
  href: string;
  image: ImageAsset;
  metric: string;
  linkLabel: string;
};

export type PortfolioSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  items: PortfolioItem[];
};

export type AboutRelation = {
  org: string;
  role: string;
  description: string;
};

export type AboutSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  relation: AboutRelation[];
};

export type ContactSection = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  body: string;
  buttonLabel: string;
  formUrl: string;
};

export type SiteImages = {
  studio: [ImageAsset, ImageAsset];
  professional: {
    law: ImageAsset;
    med: ImageAsset;
    tax: ImageAsset;
  };
  concept: {
    brand: ImageAsset;
    different: ImageAsset;
  };
};

export type SiteContent = {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    assets: {
      logoOnLight: string;
      logoOnDark: string;
    };
  };
  ui: {
    navigationAriaLabel: string;
    scrollToTopAriaLabel: string;
    heroVideoTitle: string;
    footerLabels: {
      ceo: string;
      businessNumber: string;
      corporateNumber: string;
      address: string;
      email: string;
      tel: string;
    };
  };
  navigation: NavItem[];
  hero: {
    label: string;
    headline: string;
    subheadline: string;
    description: string;
    ctas: HeroCta[];
  };
  heroVideo: {
    enabled: boolean;
    youtubeId: string;
    start: number;
  };
  images: SiteImages;
  sections: {
    problem: ProblemSection;
    process: ProcessSection;
    professionalTargets: ProfessionalTargetsSection;
    brandStructure: BrandStructureSection;
    studioProof: StudioProofSection;
    differentiation: DifferentiationSection;
    portfolio: PortfolioSection;
    about: AboutSection;
    contact: ContactSection;
  };
  footer: {
    company: string;
    ceo: string;
    businessNumber: string;
    corporateNumber: string;
    address: string;
    email: string;
    tel: string;
  };
};

const images: SiteImages = {
  studio: [
    {
      src: "/images/studio-1.jpg",
      alt: "회의실 촬영 셋업 전경"
    },
    {
      src: "/images/studio-2.jpg",
      alt: "화이트 배경 스튜디오 촬영 셋업"
    }
  ],
  professional: {
    law: {
      src: "/images/pro-law.jpg",
      alt: "변호사 전문 영역을 상징하는 저울과 악수 장면"
    },
    med: {
      src: "/images/pro-med.jpg",
      alt: "의사 전문 영역을 상징하는 청진기 이미지"
    },
    tax: {
      src: "/images/pro-tax.jpg",
      alt: "세무 전문 영역을 상징하는 저금통 이미지"
    }
  },
  concept: {
    brand: {
      src: "/images/concept-brand.jpg",
      alt: "브랜드 구조 설계 다이어그램"
    },
    different: {
      src: "/images/concept-different.jpg",
      alt: "차별화를 상징하는 빨간 인물 이미지"
    }
  }
};

export const content: SiteContent = {
  site: {
    name: "Turnkeyhaus",
    title: "Turnkeyhaus | 통합 전문직 유튜브 구조 설계",
    description:
      "Turnkeyhaus는 TKDG Labs의 미디어 실행 조직으로, 촬영 이전에 채널 구조와 운영 체계를 설계해 전문직 채널의 신뢰 자산을 구축합니다.",
    url: "https://turnkey.haus",
    assets: {
      logoOnLight: "/images/turnkeyhaus-logo-dark.png",
      logoOnDark: "/images/turnkeyhaus-logo-white.png"
    }
  },
  ui: {
    navigationAriaLabel: "섹션 바로가기",
    scrollToTopAriaLabel: "상단으로 이동",
    heroVideoTitle: "Turnkeyhaus hero background video",
    footerLabels: {
      ceo: "대표자",
      businessNumber: "사업자등록번호",
      corporateNumber: "법인등록번호",
      address: "주소",
      email: "Email",
      tel: "Tel"
    }
  },
  navigation: [
    { label: "문제", href: "#problem" },
    { label: "프로세스", href: "#process" },
    { label: "브랜드 구조", href: "#brand-structure" },
    { label: "전문직별 적용", href: "#professional-targets" },
    { label: "스튜디오", href: "#studio-proof" },
    { label: "차별화", href: "#differentiation" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "상담", href: "#contact" }
  ],
  hero: {
    label: "STRUCTURE FIRST MEDIA OPERATION",
    headline: "브랜드는 찍는다고 만들어지지 않습니다.",
    subheadline: "유튜브는 홍보물이 아니라 신뢰를 남기는 구조입니다.",
    description:
      "Turnkeyhaus는 브랜드 설계 그룹 TKDG Labs의 미디어 실행 조직입니다. 우리는 촬영부터 시작하지 않습니다. 구조부터 설계합니다.",
    ctas: [
      { label: "채널 구조 진단 요청", href: "#contact", variant: "primary" },
      { label: "우리가 하는 일", href: "#about", variant: "secondary" }
    ]
  },
  heroVideo: {
    enabled: true,
    youtubeId: "TIOJf08c88c",
    start: 0
  },
  images,
  sections: {
    problem: {
      id: "problem",
      index: "01",
      title: "[ 문제 인식 ]",
      subtitle: "콘텐츠 이전에 구조를 점검해야 하는 이유",
      items: [
        "업로드는 이어지지만 채널의 정체성이 보이지 않습니다.",
        "숏폼은 많지만 신뢰를 축적하는 흐름이 없습니다.",
        "조회수와 실제 문의 전환 사이가 끊겨 있습니다.",
        "운영 기준이 없어 담당자와 톤이 매번 바뀝니다."
      ],
      emphasis: "문제는 콘텐츠 수가 아니라 구조의 부재입니다."
    },
    process: {
      id: "process",
      index: "02",
      title: "[ 운영 프로세스 ]",
      subtitle: "촬영 전 설계부터 운영 관리까지",
      steps: [
        {
          step: "STEP 1",
          title: "구조 설계",
          description: "채널 이름 정의, 포지셔닝, 말의 톤, 콘텐츠 역할을 먼저 나눕니다."
        },
        {
          step: "STEP 2",
          title: "촬영",
          description: "매월 1회 또는 2회, PD 2인과 3CAM 체계로 운영 재료를 확보합니다."
        },
        {
          step: "STEP 3",
          title: "운영",
          description: "롱폼·숏폼 구조화, 썸네일 전략, 게시 리듬 관리까지 실행합니다."
        }
      ],
      emphasis: "촬영은 재료 생산 단계입니다. 브랜드는 운영 과정에서 만들어집니다."
    },
    professionalTargets: {
      id: "professional-targets",
      index: "04",
      title: "[ 전문직별 적용 ]",
      subtitle: "직역별 언어와 신뢰 기준에 맞춘 채널 구조",
      cards: [
        {
          title: "변호사 · 로펌",
          oneLiner: "사건 홍보가 아닌 전문성 신뢰를 축적하는 정보 구조를 설계합니다.",
          bullets: [
            "분야별 핵심 이슈를 축으로 한 시리즈 구조",
            "권위적이지 않으면서 명확한 법률 설명 톤",
            "상담 문의로 이어지는 채널 동선 설계"
          ],
          href: "#portfolio",
          hrefLabel: "포트폴리오 보기",
          image: images.professional.law
        },
        {
          title: "병원 · 의료",
          oneLiner: "의학 정보의 정확성과 환자 관점의 이해 가능성을 동시에 맞춥니다.",
          bullets: [
            "진료 분야별 신뢰 주제 클러스터 설계",
            "의료진 개인 브랜딩과 병원 채널의 역할 분리",
            "정보형 콘텐츠 중심의 월간 운영 캘린더"
          ],
          href: "#contact",
          hrefLabel: "상담 연결",
          image: images.professional.med
        },
        {
          title: "세무사",
          oneLiner: "세법 이슈를 고객 언어로 번역해 반복 조회되는 채널 구조를 만듭니다.",
          bullets: [
            "시기별 세무 이슈를 반영한 콘텐츠 체계",
            "난이도별 설명 톤과 포맷 분리",
            "상담 전환을 고려한 CTA와 랜딩 연계"
          ],
          href: "#contact",
          hrefLabel: "진단 요청",
          image: images.professional.tax
        }
      ]
    },
    brandStructure: {
      id: "brand-structure",
      index: "03",
      title: "[ Brand As Structure ]",
      subtitle: "브랜드는 이미지가 아니라 운영 설계입니다",
      paragraphs: [
        "브랜드는 한 번의 영상으로 고정되지 않습니다. 채널에서 어떤 순서로 무엇을 말하는지의 반복에서 형성됩니다.",
        "우리는 메시지의 순서, 콘텐츠의 역할, 시청자 기대 경로를 설계해 신뢰가 누적되는 구조를 만듭니다."
      ],
      emphasis: "구조가 선명하면 운영은 일관되고, 일관성은 결국 신뢰 자산이 됩니다.",
      image: images.concept.brand
    },
    studioProof: {
      id: "studio-proof",
      index: "05",
      title: "[ Studio Proof ]",
      subtitle: "운영 가능한 촬영 인프라를 갖춘 실행 체계",
      description:
        "촬영은 결과물이 아니라 운영 리듬을 지키기 위한 생산 공정입니다. 장비와 인력이 안정적이어야 월 단위 운영이 가능합니다.",
      items: [
        {
          image: images.studio[0],
          captionTop: "PD 2인 · 3CAM · 월 1~2회 촬영 기반 운영",
          captionBottom: "회의형 대담 촬영부터 실무형 인터뷰까지 동일한 품질 기준 유지"
        },
        {
          image: images.studio[1],
          captionTop: "전문직 톤에 맞춘 화이트 배경 스튜디오 셋업",
          captionBottom: "촬영은 재료 생산, 본질은 채널 운영 관리"
        }
      ]
    },
    differentiation: {
      id: "differentiation",
      index: "06",
      title: "[ Differentiation ]",
      subtitle: "제작 중심 접근과 운영 설계 접근의 차이",
      headline: "우리는 단순 유튜브 제작사가 아닙니다.",
      paragraphs: [
        "영상 납품만으로는 채널이 자산이 되지 않습니다. 채널은 기획, 촬영, 편집, 게시, 피드백이 한 구조로 연결될 때 성장합니다.",
        "Turnkeyhaus는 유튜브 컨설팅 관점에서 채널의 말투, 콘텐츠 우선순위, 운영 리듬을 설계하고 실행까지 책임집니다."
      ],
      emphasis: "단기 조회수보다 장기 신뢰가 중요한 팀에게 맞는 방식입니다.",
      image: images.concept.different
    },
    portfolio: {
      id: "portfolio",
      index: "07",
      title: "[ Portfolio ]",
      subtitle: "유튜브 링크와 운영 성과",
      items: [
        {
          title: "채널 구조 진단 샘플",
          oneLiner: "브랜드 메시지와 콘텐츠 역할을 재정의한 구조 진단 케이스",
          href: "https://www.youtube.com/watch?v=TIOJf08c88c",
          image: images.concept.brand,
          metric: "진단 이후 콘텐츠 분류 체계 재편",
          linkLabel: "유튜브 링크 열기"
        },
        {
          title: "전문직 인터뷰 운영",
          oneLiner: "정보형 롱폼과 숏폼 클립을 연결한 월간 운영 사례",
          href: "https://www.youtube.com/@turnkeyhaus",
          image: images.studio[0],
          metric: "촬영-편집-게시 리드타임 단축",
          linkLabel: "채널 보기"
        },
        {
          title: "신뢰 중심 브랜딩 실행",
          oneLiner: "초기 채널의 말투와 썸네일 규칙을 정리한 온보딩 프로젝트",
          href: "https://www.youtube.com/@turnkeyhaus",
          image: images.professional.law,
          metric: "문의 대응 기준과 랜딩 동선 일관화",
          linkLabel: "사례 확인"
        }
      ]
    },
    about: {
      id: "about",
      index: "08",
      title: "[ About ]",
      subtitle: "TKDG Labs와 Turnkeyhaus의 역할",
      relation: [
        {
          org: "TKDG Labs",
          role: "전략 · 설계",
          description:
            "TKDG Labs는 티케이디지랩스 주식회사 법인으로, 마케팅 대행사/영상 제작사/광고 집행사가 아닌 브랜드 구조 설계에 집중합니다."
        },
        {
          org: "Turnkeyhaus",
          role: "실행 · 운영",
          description:
            "Turnkeyhaus는 TKDG Labs의 전략을 바탕으로 채널 촬영·편집·운영을 실제 실행하는 미디어 운영 조직입니다."
        }
      ]
    },
    contact: {
      id: "contact",
      index: "09",
      title: "[ Contact ]",
      subtitle: "상담/진단",
      body: "현재 채널 상태와 목표를 공유해주시면 구조 진단 후 운영 방향을 제안드립니다.",
      buttonLabel: "상담 예약하기",
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd8zYwfvExample/viewform"
    }
  },
  footer: {
    company: "티케이디지랩스 주식회사",
    ceo: "채동우",
    businessNumber: "763-87-03415",
    corporateNumber: "120111-0144223",
    address: "인천광역시 서구 파랑로 451, 10층 1010호",
    email: "contact@tkdglabs.com",
    tel: "0507-1463-3664"
  }
};
