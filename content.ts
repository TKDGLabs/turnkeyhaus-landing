export type NavItem = {
  label: string;
  href: string;
};

export const content = {
  site: {
    name: "Turnkeyhaus",
    title: "Turnkeyhaus | 브랜드 구조를 설계하는 미디어 실행 조직",
    description:
      "Turnkeyhaus는 TKDG Labs의 미디어 실행 조직으로, 촬영 이전에 채널 구조와 운영 체계를 먼저 설계합니다.",
    url: "https://turnkeyhaus-landing.vercel.app",
    assets: {
      logoOnLight: "/images/turnkeyhaus-logo-dark.png",
      logoOnDark: "/images/turnkeyhaus-logo-white.png"
    }
  },
  navigation: [
    { label: "문제", href: "#problem" },
    { label: "프로세스", href: "#process" },
    { label: "조직", href: "#about" },
    { label: "적합 대상", href: "#fit" },
    { label: "상담", href: "#contact" }
  ] satisfies NavItem[],
  hero: {
    label: "STRUCTURE FIRST MEDIA OPERATION",
    headline: "브랜드는 찍는다고 만들어지지 않습니다.",
    subheadline: "유튜브는 홍보물이 아니라 신뢰를 남기는 구조입니다.",
    description:
      "Turnkeyhaus는 브랜드 설계 그룹 TKDG Labs의 미디어 실행 조직입니다. 우리는 촬영부터 시작하지 않습니다. 구조부터 설계합니다.",
    ctas: [
      { label: "채널 구조 진단 요청", href: "#contact", variant: "primary" as const },
      { label: "우리가 하는 일", href: "#about", variant: "secondary" as const }
    ]
  },
  heroVideo: {
    enabled: true,
    youtubeId: "TIOJf08c88c",
    start: 0
  },
  problem: {
    title: "Problem",
    items: [
      "선거 직전 급하게 만든 홍보 영상",
      "병원 채널인데 정체성 없음",
      "숏폼은 많은데 신뢰는 없음",
      "조회수는 나오지만 전환은 없음"
    ],
    emphasis: "문제는 콘텐츠가 아니라 구조의 부재입니다."
  },
  process: {
    title: "Process",
    steps: [
      {
        step: "STEP 1",
        title: "구조 설계",
        description: "채널 이름 정의, 포지셔닝, 말의 톤, 콘텐츠 역할 분리를 설계합니다."
      },
      {
        step: "STEP 2",
        title: "촬영",
        description: "매월 1회 혹은 2회, PD 2인, 3CAM 체계로 재료를 생산합니다."
      },
      {
        step: "STEP 3",
        title: "운영",
        description: "롱폼·숏폼 구조화, 썸네일 전략, 채널 운영 관리를 실행합니다."
      }
    ],
    emphasis: "촬영은 재료 생산 단계입니다. 브랜드는 운영 과정에서 만들어집니다."
  },
  about: {
    title: "About",
    relation: [
      {
        org: "TKDG Labs",
        role: "전략·설계",
        description:
          "TKDG Labs는 티케이디지랩스 주식회사 법인으로, 마케팅 대행사/영상 제작사/광고 집행사가 아니라 브랜드 구조 설계에 집중합니다."
      },
      {
        org: "Turnkeyhaus",
        role: "실행·운영",
        description:
          "Turnkeyhaus는 TKDG Labs가 설계한 구조를 미디어 실행으로 옮기는 운영 조직입니다."
      }
    ]
  },
  fit: {
    title: "Fit",
    items: [
      "병원 원장 브랜딩",
      "전문직(의사/변호사/세무사)",
      "지방선거 출마 예정자",
      "단기 조회수보다 장기 신뢰가 중요한 팀"
    ]
  },
  pricing: {
    title: "Pricing",
    subtitle: "가격 대신 구조",
    items: [
      "운영은 월 단위 계약",
      "촬영은 매월 1~2회",
      "상세 견적은 상담 후 안내"
    ]
  },
  contact: {
    title: "Contact",
    subtitle: "상담/진단",
    buttonLabel: "상담 예약하기",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd8zYwfvExample/viewform"
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
} as const;
