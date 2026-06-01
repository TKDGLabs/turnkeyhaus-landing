'use client';

import { useMemo, useState } from 'react';

type IndustryId =
  | 'medical'
  | 'lawfirm'
  | 'tax'
  | 'b2b'
  | 'public'
  | 'commerce'
  | 'other';
type StatusId = 'new' | 'improve' | 'rebuild' | 'internalNoSystem' | 'outsourcedLowResult';
type GoalId =
  | 'conversion'
  | 'authority'
  | 'searchAsset'
  | 'lessAds'
  | 'internalBuild'
  | 'hiringSupport'
  | 'publicTrust';
type ResourceId =
  | 'speaker'
  | 'space'
  | 'editor'
  | 'marketer'
  | 'noScript'
  | 'manyApprovers'
  | 'hiringSoon'
  | 'none';
type ModelId = 'turnkey' | 'hybrid' | 'transfer' | 'inhouse' | 'talent';
type VolumeId = 'light' | 'standard' | 'focused' | 'enablement';
type InvestmentId = 'undecided' | 'starter' | 'growth' | 'authority' | 'project';
type PaymentId = 'undecided' | 'card' | 'invoice';
type PlanId = 'managedStarter' | 'managedGrowth' | 'managedAuthority' | 'inhouseBuild' | 'hybridTransfer' | 'talentEvaluation';

type Option<T extends string> = {
  id: T;
  title: string;
  description: string;
  meta?: string;
};

type PlanDefinition = {
  id: PlanId;
  title: string;
  subtitle: string;
  investmentRange: string;
  paymentGuide: string;
  scope: string[];
  nextStep: string;
};

type FormState = {
  industry?: IndustryId;
  status?: StatusId;
  goals: GoalId[];
  resources: ResourceId[];
  model?: ModelId;
  volume?: VolumeId;
  investment: InvestmentId;
  payment: PaymentId;
};

const steps = [
  { label: '업종', title: '어떤 조직의 채널인가요?', subtitle: '업종에 따라 검색 의도, 표현 리스크, 전환 CTA가 달라집니다.' },
  { label: '현재 상태', title: '현재 채널 상태를 알려주세요', subtitle: '신규 개설인지, 리빌딩인지, 기존 외주 문제인지에 따라 운영 설계가 달라집니다.' },
  { label: '운영 목표', title: '이번 운영에서 가장 중요한 목표는 무엇인가요?', subtitle: '해당되는 목표를 모두 선택해 주세요. 편수보다 먼저 목표를 맞춥니다.' },
  { label: '내부 리소스', title: '현재 내부에 어떤 리소스가 있나요?', subtitle: '보유 리소스에 따라 전체 턴키, 하이브리드, 내부화 구축을 나눕니다.' },
  { label: '운영 방식', title: '원하는 운영 방식을 선택해 주세요', subtitle: '턴키하우스가 맡을 범위와 내부팀 참여 수준을 정합니다.' },
  { label: '월간 볼륨', title: '월간 제작 볼륨은 어느 정도가 적합할까요?', subtitle: '편수만 계산하지 않고 기획·제작·업로드·리포트까지 포함한 운영 단위로 봅니다.' },
  { label: '추천 결과', title: '추천 운영 플랜을 확인해 주세요', subtitle: '이 결과는 확정 견적이 아니라 상담 전 운영 범위를 빠르게 맞추기 위한 기준입니다.' }
] as const;

const industries: Option<IndustryId>[] = [
  { id: 'medical', title: '병원·의료기관', description: '내원 전환, 의료광고 리스크, 원장 브랜딩을 함께 봅니다.', meta: '#내원 #의료광고 #진료과목' },
  { id: 'lawfirm', title: '로펌·변호사', description: '사건 분야별 검색 유입과 상담 CTA를 중심으로 설계합니다.', meta: '#수임 #상담 #사건분야' },
  { id: 'tax', title: '세무·노무·회계', description: '시즌성 이슈와 판단 기준을 검색 자산으로 누적합니다.', meta: '#신고시즌 #이슈캘린더' },
  { id: 'b2b', title: '기업·B2B 브랜드', description: '복잡한 제품/서비스를 신뢰와 세일즈 지원 콘텐츠로 바꿉니다.', meta: '#세일즈지원 #브랜드신뢰' },
  { id: 'public', title: '정부기관·공공단체', description: '정책, 사업, 성과, FAQ를 월간 커뮤니케이션 구조로 정리합니다.', meta: '#정책홍보 #공공신뢰' },
  { id: 'commerce', title: '커머스·온라인 서비스', description: '탐색, 비교, 구매, 재방문까지 이어지는 콘텐츠 동선을 봅니다.', meta: '#전환 #리텐션' },
  { id: 'other', title: '기타 고관여 브랜드', description: '업종 특성을 먼저 진단한 뒤 운영 가능성을 확인합니다.', meta: '#맞춤진단' }
];

const statuses: Option<StatusId>[] = [
  { id: 'new', title: '신규 채널을 시작해야 합니다', description: '채널명, 설명, 주제 구조, 첫 촬영 기준부터 잡아야 하는 상태입니다.' },
  { id: 'improve', title: '운영 중인데 성과가 애매합니다', description: '조회수, 검색 유입, CTA, 재생목록, 썸네일 기준을 다시 봐야 합니다.' },
  { id: 'rebuild', title: '기존 채널을 리빌딩해야 합니다', description: '이미 올라간 영상과 채널 자산을 살리면서 방향을 다시 세웁니다.' },
  { id: 'internalNoSystem', title: '내부팀은 있지만 운영 기준이 없습니다', description: '촬영, 편집, 업로드, 리포트 기준이 사람마다 달라지는 상태입니다.' },
  { id: 'outsourcedLowResult', title: '외주를 맡겼지만 유입이 없습니다', description: '제작물보다 채널 세팅, 주제 구조, 운영 리포트부터 검토해야 합니다.' }
];

const goals: Option<GoalId>[] = [
  { id: 'conversion', title: '상담·내원·수임 문의 증가', description: '검색과 추천으로 들어온 사람이 문의까지 이동하는 구조가 필요합니다.' },
  { id: 'authority', title: '대표/전문가 브랜딩', description: '출연자의 전문성과 신뢰감을 오래 남는 콘텐츠 자산으로 만듭니다.' },
  { id: 'searchAsset', title: '검색 유입 누적', description: '한 번 올리고 끝나는 영상보다 계속 발견되는 주제 구조가 필요합니다.' },
  { id: 'lessAds', title: '광고 의존도 감소', description: '광고를 멈춰도 비교·검토 단계에서 남아 있는 채널 자산을 만듭니다.' },
  { id: 'internalBuild', title: '내부 영상팀 구축', description: '장비, 역할, SOP, 템플릿까지 내부에서 반복할 기준이 필요합니다.' },
  { id: 'hiringSupport', title: 'PD/편집자 실무평가 지원', description: '포트폴리오, 실무 과제, 면접 질문으로 채용 판단을 돕습니다.' },
  { id: 'publicTrust', title: '공공사업·기관 신뢰 커뮤니케이션', description: '성과와 안내를 공식 채널에 맞는 언어로 꾸준히 정리해야 합니다.' }
];

const resources: Option<ResourceId>[] = [
  { id: 'speaker', title: '출연 가능한 대표/전문가가 있습니다', description: '원장, 변호사, 대표, 실무 책임자가 직접 설명할 수 있습니다.' },
  { id: 'space', title: '내부 촬영 공간이 있습니다', description: '병원, 사무실, 회의실 등 반복 촬영이 가능한 공간이 있습니다.' },
  { id: 'editor', title: '내부 편집자가 있습니다', description: '제작 일부를 내부화하거나 검수 기준을 세울 여지가 있습니다.' },
  { id: 'marketer', title: '마케팅 담당자가 있습니다', description: '업로드, 승인, 블로그/SNS 연동을 함께 맞출 담당자가 있습니다.' },
  { id: 'noScript', title: '대본/기획 담당자가 없습니다', description: '촬영 전 질문지와 메시지 구조를 외부에서 잡아줘야 합니다.' },
  { id: 'manyApprovers', title: '검수/승인자가 많습니다', description: '법무, 홍보, 의료진, 기관 담당자 등 승인 구조를 고려해야 합니다.' },
  { id: 'hiringSoon', title: '영상 인력 채용을 준비 중입니다', description: '직무기술서, 실무 과제, 면접 기준을 함께 세워야 합니다.' },
  { id: 'none', title: '아직 확보된 내부 리소스가 없습니다', description: '초기에는 외부 운영팀이 전체 구조를 잡는 편이 안전합니다.' }
];

const models: Option<ModelId>[] = [
  { id: 'turnkey', title: '턴키하우스가 전체 운영', description: '기획, 대본, 촬영, 편집, 썸네일, 업로드, 월간 리포트까지 맡깁니다.' },
  { id: 'hybrid', title: '내부 담당자와 하이브리드 운영', description: '내부 리소스를 살리되 전략/기획/검수 기준은 함께 잡습니다.' },
  { id: 'transfer', title: '외주 운영 후 내부팀으로 이관', description: '처음에는 턴키로 운영하고, SOP와 템플릿을 만들어 내부화합니다.' },
  { id: 'inhouse', title: '사내 영상 시스템 구축 우선', description: '장비, 공간, 역할표, 파일 관리, 업로드·리포트 기준부터 만듭니다.' },
  { id: 'talent', title: 'PD/편집자 실무평가까지 포함', description: '채용 판단에 필요한 포트폴리오 평가, 과제, 면접 질문을 설계합니다.' }
];

const volumes: Option<VolumeId>[] = [
  { id: 'light', title: '검증 운영', description: '롱폼 2편 + 쇼츠 4편 기준. 신규/검증 단계에 적합합니다.', meta: '월 1회 촬영 기준' },
  { id: 'standard', title: '표준 운영', description: '롱폼 4편 + 쇼츠 8편 기준. 검색 자산과 발견 채널을 함께 키웁니다.', meta: '가장 일반적인 운영 단위' },
  { id: 'focused', title: '집중 운영', description: '롱폼 6~8편 + 쇼츠 12~16편 기준. 대표 브랜딩과 확장 운영에 적합합니다.', meta: '월 2회 촬영 가능성 검토' },
  { id: 'enablement', title: '내부화 병행', description: '제작 일부 + 교육 + 템플릿 + SOP를 함께 구성합니다.', meta: '운영 이관/내부팀 구축형' }
];

const investments: Option<InvestmentId>[] = [
  { id: 'undecided', title: '상담 후 확정', description: '운영 범위와 내부 리소스를 먼저 보고 결정합니다.' },
  { id: 'starter', title: '월 150~250만원대', description: '검증 운영 또는 최소 운영 기준을 먼저 확인합니다.' },
  { id: 'growth', title: '월 300~500만원대', description: '월간 운영팀을 붙여 성과 구조를 만들고 싶습니다.' },
  { id: 'authority', title: '월 700만원대 이상', description: '대표 브랜딩, 다채널 연동, 집중 운영까지 고려합니다.' },
  { id: 'project', title: '프로젝트형', description: '인하우스 구축, 교육, 실무평가처럼 범위를 따로 확정합니다.' }
];

const payments: Option<PaymentId>[] = [
  { id: 'undecided', title: '상담 후 결정', description: '계약 방식과 결제 방식을 함께 확인합니다.' },
  { id: 'card', title: '카드 정기결제 희망', description: '월간 운영 확정 후 카드 자동결제 등록을 원합니다.' },
  { id: 'invoice', title: '세금계산서/계좌이체 희망', description: '기업/기관 내부 정산 절차에 맞춰 진행합니다.' }
];

const planDefinitions: Record<PlanId, PlanDefinition> = {
  managedStarter: {
    id: 'managedStarter',
    title: 'Managed Starter',
    subtitle: '작게 검증하되 운영 기준은 제대로 잡는 월간 시작 플랜',
    investmentRange: '월 150~250만원대부터',
    paymentGuide: '최소 운영 범위 확정 후 카드 정기결제 또는 세금계산서로 진행',
    scope: ['월간 콘텐츠 캘린더', '대본/질문지 설계', '월 1회 촬영 기준', '롱폼 2편 + 쇼츠 4편', '썸네일/제목/설명 업로드 세팅', '30일 반응 리포트'],
    nextStep: '3개월 검증 운영으로 시작해 채널 구조와 반응을 먼저 확인하는 방식이 적합합니다.'
  },
  managedGrowth: {
    id: 'managedGrowth',
    title: 'Managed Growth',
    subtitle: '검색 유입과 문의 전환을 함께 만드는 표준 월간 운영 플랜',
    investmentRange: '월 300~500만원대부터',
    paymentGuide: '월간 운영 범위 확정 후 카드 정기결제 또는 세금계산서로 진행',
    scope: ['월간 전략 회의', '주제/검색 의도 설계', '대본/질문지 사전 확정', '롱폼 4편 + 쇼츠 8편', 'SEO/CTA 업로드 세팅', '월간 리포트와 다음 달 개선안'],
    nextStep: '현재 채널을 리빌딩하거나 본격 운영을 시작할 때 가장 현실적인 기준입니다.'
  },
  managedAuthority: {
    id: 'managedAuthority',
    title: 'Managed Authority',
    subtitle: '대표 브랜딩과 채널 자산 확장을 동시에 가져가는 집중 운영 플랜',
    investmentRange: '월 700만원대부터',
    paymentGuide: '촬영 회차, 승인 구조, 연동 채널을 확인한 뒤 월간 운영 계약으로 진행',
    scope: ['월 2회 촬영 가능성 검토', '롱폼 6~8편 + 쇼츠 12~16편', '대표/전문가 브랜딩 시리즈', '썸네일/제목 A-B 점검', '블로그/SNS/뉴스레터 연동 설계', '월간 전략 리포트'],
    nextStep: '단순 운영보다 브랜드 권위와 세일즈/상담 자산을 강하게 쌓아야 할 때 적합합니다.'
  },
  inhouseBuild: {
    id: 'inhouseBuild',
    title: 'In-house Video System Build',
    subtitle: '외주 의존도를 낮추기 위한 사내 영상 제작 시스템 구축 플랜',
    investmentRange: '프로젝트 범위 산정',
    paymentGuide: '착수 범위 확정 후 카드 결제 또는 세금계산서로 진행',
    scope: ['장비/촬영 공간 진단', '역할표와 제작 워크플로우', '대본/썸네일/업로드 템플릿', '파일 관리와 검수 기준', '월간 콘텐츠 캘린더', '실무 교육 및 운영 이관'],
    nextStep: '내부팀이 반복 운영할 수 있는 기준부터 만들고, 필요한 부분만 외부 운영팀이 보완합니다.'
  },
  hybridTransfer: {
    id: 'hybridTransfer',
    title: 'Hybrid Transfer',
    subtitle: '초기에는 턴키로 운영하고 점차 내부팀으로 이관하는 혼합 플랜',
    investmentRange: '월 운영 + 구축 컨설팅 혼합 산정',
    paymentGuide: '운영 기간과 이관 범위를 나눠 계약 후 결제 방식 확정',
    scope: ['초기 채널 리빌딩', '월간 턴키 운영', 'SOP/템플릿 제작', '내부 담당자 교육', '업로드/리포트 기준 이관', '전환 시점별 운영 점검'],
    nextStep: '당장 성과를 멈추지 않으면서 장기적으로 내부 운영 역량을 만들 때 적합합니다.'
  },
  talentEvaluation: {
    id: 'talentEvaluation',
    title: 'Video Talent Evaluation',
    subtitle: '영상/콘텐츠 인재 채용 판단을 돕는 실무평가 컨설팅',
    investmentRange: '실무평가 범위 산정',
    paymentGuide: '직무 범위와 면접 참여 수준을 확정한 뒤 프로젝트형으로 진행',
    scope: ['직무기술서 검토', '포트폴리오 평가 기준', '실무 과제 설계', '면접 질문지 구성', '실무 면접 동석/평가 지원', '입사 후 운영 기준 제안'],
    nextStep: '채용 알선이 아니라 좋은 PD/편집자를 판단할 수 있는 실무 기준을 제공하는 방식입니다.'
  }
};

const initialState: FormState = {
  goals: [],
  resources: [],
  investment: 'undecided',
  payment: 'undecided'
};

function getTitle<T extends string>(options: Option<T>[], id?: T) {
  return options.find((option) => option.id === id)?.title ?? '미선택';
}

function joinTitles<T extends string>(options: Option<T>[], ids: T[]) {
  if (ids.length === 0) return '미선택';
  return ids.map((id) => getTitle(options, id)).join(', ');
}

function buildPlanId(state: FormState): PlanId {
  if (state.model === 'talent' || state.goals.includes('hiringSupport') || state.resources.includes('hiringSoon')) {
    return 'talentEvaluation';
  }

  if (state.model === 'inhouse' || state.goals.includes('internalBuild')) {
    return 'inhouseBuild';
  }

  if (state.model === 'transfer' || state.volume === 'enablement' || state.status === 'internalNoSystem') {
    return 'hybridTransfer';
  }

  if (state.volume === 'focused' || state.goals.includes('authority')) {
    return 'managedAuthority';
  }

  if (state.volume === 'standard' || state.status === 'rebuild' || state.status === 'outsourcedLowResult' || state.goals.length >= 2) {
    return 'managedGrowth';
  }

  return 'managedStarter';
}

function buildReason(state: FormState, plan: PlanDefinition) {
  const industryTitle = getTitle(industries, state.industry);
  const statusTitle = getTitle(statuses, state.status);
  const modelTitle = getTitle(models, state.model);
  const volumeTitle = getTitle(volumes, state.volume);
  const selectedGoals = joinTitles(goals, state.goals);

  if (plan.id === 'talentEvaluation') {
    return `${industryTitle}에서 영상 인력 채용 또는 실무 판단이 중요한 상태입니다. 지금은 제작 편수를 늘리기보다 직무기술서, 포트폴리오 평가, 실무 과제와 면접 기준을 먼저 잡는 편이 안전합니다.`;
  }

  if (plan.id === 'inhouseBuild') {
    return `${industryTitle} 내부에서 반복 운영할 구조가 필요한 상태입니다. ${statusTitle} 조건에서는 장비, 촬영 공간, 역할표, 템플릿, 리포트 기준을 먼저 만들어야 외주 의존도를 줄일 수 있습니다.`;
  }

  if (plan.id === 'hybridTransfer') {
    return `${industryTitle} 채널을 당장 멈추지 않으면서 내부 운영 기준을 만들어야 합니다. ${modelTitle} 방식으로 운영하면 초기 성과와 내부화 준비를 동시에 가져갈 수 있습니다.`;
  }

  return `${industryTitle} 채널의 현재 상태는 “${statusTitle}”에 가깝고, 핵심 목표는 ${selectedGoals}입니다. ${volumeTitle} 기준으로 운영하면 기획, 제작, 업로드, 리포트가 한 번에 맞물려 상담 전 운영 범위를 빠르게 확정할 수 있습니다.`;
}

function buildSummary(state: FormState, plan: PlanDefinition) {
  const rows = [
    ['추천 플랜', plan.title],
    ['적합 이유', buildReason(state, plan)],
    ['업종', getTitle(industries, state.industry)],
    ['현재 상태', getTitle(statuses, state.status)],
    ['운영 목표', joinTitles(goals, state.goals)],
    ['내부 리소스', joinTitles(resources, state.resources)],
    ['희망 운영 방식', getTitle(models, state.model)],
    ['월간 제작 볼륨', getTitle(volumes, state.volume)],
    ['예상 투자 범위', getTitle(investments, state.investment)],
    ['희망 결제 방식', getTitle(payments, state.payment)],
    ['기본 포함 범위', plan.scope.join(' / ')],
    ['다음 단계', plan.nextStep]
  ];

  return rows.map(([label, value]) => `${label}: ${value}`).join('\n');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return entities[char];
  });
}

export default function DiagnosticCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<FormState>(initialState);

  const plan = useMemo(() => planDefinitions[buildPlanId(state)], [state]);
  const summary = useMemo(() => buildSummary(state, plan), [state, plan]);
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const canProceed = (() => {
    if (currentStep === 0) return Boolean(state.industry);
    if (currentStep === 1) return Boolean(state.status);
    if (currentStep === 2) return state.goals.length > 0;
    if (currentStep === 3) return state.resources.length > 0;
    if (currentStep === 4) return Boolean(state.model);
    if (currentStep === 5) return Boolean(state.volume);
    return true;
  })();

  function goNext() {
    if (!canProceed) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goPrev() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function reset() {
    setState(initialState);
    setCurrentStep(0);
  }

  function toggleGoal(id: GoalId) {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter((goal) => goal !== id) : [...prev.goals, id]
    }));
  }

  function toggleResource(id: ResourceId) {
    setState((prev) => {
      if (id === 'none') {
        return { ...prev, resources: prev.resources.includes('none') ? [] : ['none'] };
      }

      const withoutNone = prev.resources.filter((resource) => resource !== 'none');
      return {
        ...prev,
        resources: withoutNone.includes(id)
          ? withoutNone.filter((resource) => resource !== id)
          : [...withoutNone, id]
      };
    });
  }

  function moveToContact() {
    const payload = `${summary}\n\n요청 유형: 이 플랜으로 상담 신청`;
    window.sessionStorage.setItem('turnkeyhaus:plan-recommendation', payload);
    
    // 🚨 Vercel TS strict mode 방어를 위한 정통 콜백 함수 사용 🚨
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload).catch(function(_error: unknown): void {
        // 클립보드 복사 실패 시 무시
      });
    }

    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.location.href = '/#contact';
  }

  function printPlan() {
    const popup = window.open('', 'turnkeyhaus-plan-print', 'width=860,height=960');
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>턴키하우스 운영 플랜 추천 결과</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #101816; margin: 48px; line-height: 1.7; }
    h1 { font-size: 32px; margin: 0 0 8px; }
    p { color: #4a5551; margin: 0 0 28px; }
    dl { border-top: 1px solid #d9dfdc; }
    div { border-bottom: 1px solid #d9dfdc; padding: 14px 0; }
    dt { font-size: 12px; font-weight: 700; color: #66726e; letter-spacing: .08em; text-transform: uppercase; }
    dd { margin: 4px 0 0; font-size: 16px; }
  </style>
</head>
<body>
  <h1>턴키하우스 운영 플랜 추천 결과</h1>
  <p>이 결과는 상담 전 운영 범위를 빠르게 맞추기 위한 기준입니다. 최종 범위와 금액은 업종, 촬영 환경, 승인 구조 확인 후 확정됩니다.</p>
  <dl>
    ${summary
      .split('\n')
      .map((line) => {
        const [label, ...value] = line.split(': ');
        return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value.join(': '))}</dd></div>`;
      })
      .join('')}
  </dl>
</body>
</html>`;

    if (!popup) {
      window.print();
      return;
    }

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    window.setTimeout(() => popup.print(), 250);
  }

  function renderSingleChoice<T extends string>(options: Option<T>[], selected: T | undefined, onSelect: (id: T) => void) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`group border p-5 text-left transition ${
                active
                  ? 'border-[#21c1a2] bg-[#e8fbf7] shadow-[inset_0_0_0_1px_#21c1a2]'
                  : 'border-black/10 bg-white hover:border-black/30'
              }`}
            >
              <span className="mb-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15 text-xs font-semibold">
                {active ? '✓' : '+'}
              </span>
              <strong className="block break-keep text-[17px] font-semibold leading-[1.48] tracking-tight text-[#111816]">{option.title}</strong>
              <span className="mt-3 block text-sm leading-6 text-black/60">{option.description}</span>
              {option.meta ? <span className="mt-4 block text-xs font-semibold text-[#16a88e]">{option.meta}</span> : null}
            </button>
          );
        })}
      </div>
    );
  }

  function renderMultiChoice<T extends string>(options: Option<T>[], selected: T[], onToggle: (id: T) => void) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              aria-pressed={active}
              className={`border p-5 text-left transition ${
                active
                  ? 'border-[#21c1a2] bg-[#e8fbf7] shadow-[inset_0_0_0_1px_#21c1a2]'
                  : 'border-black/10 bg-white hover:border-black/30'
              }`}
            >
              <span className="mb-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15 text-xs font-semibold">
                {active ? '✓' : '+'}
              </span>
              <strong className="block break-keep text-[17px] font-semibold leading-[1.48] tracking-tight text-[#111816]">{option.title}</strong>
              <span className="mt-3 block text-sm leading-6 text-black/60">{option.description}</span>
              {option.meta ? <span className="mt-4 block text-xs font-semibold text-[#16a88e]">{option.meta}</span> : null}
            </button>
          );
        })}
      </div>
    );
  }

  function renderStep() {
    if (currentStep === 0) {
      return renderSingleChoice(industries, state.industry, (industry) => setState((prev) => ({ ...prev, industry })));
    }

    if (currentStep === 1) {
      return renderSingleChoice(statuses, state.status, (status) => setState((prev) => ({ ...prev, status })));
    }

    if (currentStep === 2) {
      return renderMultiChoice(goals, state.goals, toggleGoal);
    }

    if (currentStep === 3) {
      return renderMultiChoice(resources, state.resources, toggleResource);
    }

    if (currentStep === 4) {
      return renderSingleChoice(models, state.model, (model) => setState((prev) => ({ ...prev, model })));
    }

    if (currentStep === 5) {
      return renderSingleChoice(volumes, state.volume, (volume) => setState((prev) => ({ ...prev, volume })));
    }

    return (
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#16a88e]">추천 플랜</p>
          <h3 className="mt-3 text-[34px] font-semibold leading-[1.18] tracking-tight text-[#101816] md:text-[44px]">{plan.title}</h3>
          <p className="mt-3 break-keep text-[17px] font-semibold leading-[1.75] text-black/68">{plan.subtitle}</p>
          <p className="mt-8 border-y border-black/10 py-6 text-base leading-8 text-black/70">{buildReason(state, plan)}</p>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-black/45">예상 투자 범위</p>
              <p className="mt-2 text-2xl font-semibold text-[#101816]">{plan.investmentRange}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-black/45">결제 안내</p>
              <p className="mt-2 text-base font-semibold leading-7 text-black/70">{plan.paymentGuide}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[#101816]">기본 포함 범위</p>
            <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {plan.scope.map((item) => (
                <li key={item} className="flex gap-3 py-3 text-sm font-semibold text-black/68">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#21c1a2]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border border-[#21c1a2]/45 bg-[#e8fbf7] p-5">
            <p className="text-sm font-semibold text-[#101816]">이 결과는 확정 견적이 아닙니다.</p>
            <p className="mt-2 text-sm leading-6 text-black/65">
              촬영 환경, 출연자 수, 검수/승인 구조, 업종별 표현 리스크를 확인한 뒤 운영 범위와 최종 금액을 확정합니다.
              결제 등록 전에 맞는 플랜인지 먼저 확인하는 이유가 여기에 있습니다.
            </p>
          </div>
        </div>

        <div className="border border-black/10 bg-white p-5 md:p-6">
          <p className="text-sm font-semibold text-[#101816]">상담 전 확인할 항목</p>
          <div className="mt-5 space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-black/45">희망 투자 범위</p>
              <div className="grid gap-2">
                {investments.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setState((prev) => ({ ...prev, investment: option.id }))}
                    className={`border px-4 py-3 text-left transition ${
                      state.investment === option.id ? 'border-[#21c1a2] bg-[#e8fbf7]' : 'border-black/10 hover:border-black/30'
                    }`}
                  >
                    <strong className="block text-sm font-semibold text-[#101816]">{option.title}</strong>
                    <span className="mt-1 block text-xs leading-5 text-black/55">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-black/45">희망 결제 방식</p>
              <div className="grid gap-2">
                {payments.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setState((prev) => ({ ...prev, payment: option.id }))}
                    className={`border px-4 py-3 text-left transition ${
                      state.payment === option.id ? 'border-[#21c1a2] bg-[#e8fbf7]' : 'border-black/10 hover:border-black/30'
                    }`}
                  >
                    <strong className="block text-sm font-semibold text-[#101816]">{option.title}</strong>
                    <span className="mt-1 block text-xs leading-5 text-black/55">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-black/10 pt-5">
            <p className="text-xs font-semibold tracking-[0.12em] text-black/45">선택 요약</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-black/45">업종</dt><dd className="text-right font-semibold">{getTitle(industries, state.industry)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-black/45">상태</dt><dd className="text-right font-semibold">{getTitle(statuses, state.status)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-black/45">운영 방식</dt><dd className="text-right font-semibold">{getTitle(models, state.model)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-black/45">월간 볼륨</dt><dd className="text-right font-semibold">{getTitle(volumes, state.volume)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="pricing" className="border-b border-black/10 bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-black/45">[ 운영 플랜 추천기 ]</p>
          <h2 className="mt-5 break-keep text-[34px] font-semibold leading-[1.18] tracking-tight text-[#101816] md:text-[52px]">
            우리 조직에 맞는
            <br />
            유튜브 운영 플랜을 확인하세요.
          </h2>
          <p className="mt-6 max-w-[62ch] break-keep text-[16px] font-medium leading-[1.9] text-black/64">
            업종, 채널 상태, 내부 리소스, 운영 목표를 선택하면 적합한 월간 운영 방식과 예상 투자 범위를 안내합니다.
            상담 신청 시 이 내용으로 운영 범위를 더 빠르게 맞출 수 있습니다.
          </p>
          <div className="mt-7 max-w-[70ch] border border-[#21c1a2]/40 bg-[#e8fbf7] px-5 py-4 text-[14px] font-semibold leading-[1.8] text-[#123c35]">
            턴키하우스는 단건 촬영·편집만 진행하지 않습니다. 채널 성과는 기획, 제작, 업로드, 리포트가 함께 움직일 때 만들어지기 때문에 월간 운영 단위로만 플랜을 제안합니다.
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit border border-black/10 bg-white p-5 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.14em] text-black/45">진행 단계</span>
              <span className="text-xs font-semibold text-[#16a88e]">{progress}%</span>
            </div>
            <div className="h-1 bg-black/10">
              <div className="h-full bg-[#21c1a2] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <ol className="mt-5 space-y-2">
              {steps.map((step, index) => {
                const active = index === currentStep;
                const done = index < currentStep;
                return (
                  <li key={step.label}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`flex w-full items-center gap-3 border px-3 py-2 text-left text-sm font-semibold transition ${
                        active
                          ? 'border-[#21c1a2] bg-[#e8fbf7] text-[#101816]'
                          : done
                            ? 'border-black/10 bg-black/[0.03] text-black/70'
                            : 'border-black/10 text-black/45'
                      }`}
                    >
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${active || done ? 'bg-[#101816] text-white' : 'bg-black/10 text-black/55'}`}>
                        {done ? '✓' : index + 1}
                      </span>
                      {step.label}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="text-xs font-semibold tracking-[0.12em] text-black/45">현재 추천</p>
              <p className="mt-2 text-xl font-semibold text-[#101816]">{plan.title}</p>
              <p className="mt-2 text-xs leading-5 text-black/55">선택값에 따라 추천 플랜이 실시간으로 바뀝니다.</p>
            </div>
          </aside>

          <div className="border border-black/10 bg-white p-5 md:p-8">
            <div className="border-b border-black/10 pb-6">
              <p className="text-sm font-semibold tracking-[0.14em] text-[#16a88e]">STEP {currentStep + 1} / {steps.length}</p>
              <h3 className="mt-3 break-keep text-[28px] font-semibold leading-[1.24] tracking-tight text-[#101816] md:text-[36px]">{steps[currentStep].title}</h3>
              <p className="mt-4 text-base leading-7 text-black/58">{steps[currentStep].subtitle}</p>
            </div>

            <div className="py-8">{renderStep()}</div>

            <div className="border-t border-black/10 pt-6">
              {currentStep < steps.length - 1 ? (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={currentStep === 0}
                      className="border border-black/15 px-5 py-3 text-sm font-semibold text-[#101816] transition hover:border-black disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="border border-black/15 px-5 py-3 text-sm font-semibold text-[#101816] transition hover:border-black"
                    >
                      다시 선택
                    </button>
                  </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed}
                  className="bg-[#101816] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#21c1a2] hover:text-[#101816] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/40"
                >
                  다음 단계
                </button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-3">
                  <button type="button" onClick={moveToContact} className="bg-[#101816] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#21c1a2] hover:text-[#101816]">
                    이 플랜으로 상담 신청
                  </button>
                  <button type="button" onClick={printPlan} className="border border-black/15 px-5 py-3 text-sm font-semibold text-[#101816] transition hover:border-black">
                    PDF로 저장하기
                  </button>
                  <button type="button" onClick={reset} className="border border-black/15 px-5 py-3 text-sm font-semibold text-[#101816] transition hover:border-black">
                    다시 시도
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
