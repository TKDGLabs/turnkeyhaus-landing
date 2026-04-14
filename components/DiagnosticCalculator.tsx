'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { content } from '../content';

type StepKey = 'channel' | 'budget' | 'goal' | 'mix' | 'term' | 'addons';
type ChannelState = 'existing' | 'new' | 'rebuild';
type GoalType = 'brand' | 'lead' | 'balanced';
type MixType = 'long' | 'short' | 'balanced';
type TermMonths = 3 | 6 | 9 | 12;
type ConsultLocation = 'seoul' | 'busan';
type LineItemKey =
  | 'shoot'
  | 'planning'
  | 'longform'
  | 'reedit'
  | 'shortform'
  | 'thumbnail'
  | 'consultSurvey'
  | 'consultSession'
  | 'consultReport'
  | 'inhouseSetup'
  | 'practicalTraining';

type LineItem = {
  key: LineItemKey;
  label: string;
  unitPrice: number;
  unitLabel: string;
  min: number;
  max: number;
  step: number;
};

type Quantities = Record<LineItemKey, number>;

type AddOns = {
  drone: boolean;
  motion: boolean;
  consultingOnly: boolean;
  inhouseSetup: boolean;
  practicalTraining: boolean;
};

type FormState = {
  channelState?: ChannelState;
  monthlyBudget?: number;
  goal?: GoalType;
  mix?: MixType;
  term?: TermMonths;
  consultLocation?: ConsultLocation;
  addOns: AddOns;
};

type QuoteResult = {
  lineTotals: Record<LineItemKey, number>;
  quantities: Quantities;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  taxable: number;
  vat: number;
  total: number;
  budget: number;
  utilization: number;
  addOns: AddOns;
  discountNotes: string[];
};

const steps: { key: StepKey; title: string; subtitle: string }[] = [
  {
    key: 'channel',
    title: '채널 상태를 선택해 주세요',
    subtitle: '현재 단계에 따라 기획/리빌딩 투입량이 달라집니다.'
  },
  {
    key: 'budget',
    title: '월 운영 예산(공급가 기준)을 선택해 주세요',
    subtitle: '선택 예산 안에서 우선순위 항목을 최적 배치합니다.'
  },
  {
    key: 'goal',
    title: '이번 분기 운영 목표를 선택해 주세요',
    subtitle: '브랜딩 중심인지, 문의 중심인지에 따라 편집 비중이 달라집니다.'
  },
  {
    key: 'mix',
    title: '콘텐츠 믹스를 선택해 주세요',
    subtitle: '롱폼/숏폼 비율에 맞춰 제작 수량을 자동 조정합니다.'
  },
  {
    key: 'term',
    title: '계약 기간을 선택해 주세요',
    subtitle: '장기 운영일수록 운영 효율 할인율이 적용됩니다.'
  },
  {
    key: 'addons',
    title: '추가 옵션을 선택해 주세요',
    subtitle: '컨설팅 단독·인하우스 셋업/교육 상품과 별도 협의 항목을 선택할 수 있습니다.'
  }
];

const stepDisplayLabels: Record<StepKey, string> = {
  channel: '채널 현황',
  budget: '월 예산',
  goal: '운영 목표',
  mix: '콘텐츠 믹스',
  term: '계약 기간',
  addons: '추가 옵션'
};

const lineItems: LineItem[] = [
  {
    key: 'shoot',
    label: '촬영 (PD 2인, 3CAM 기준)',
    unitPrice: 600000,
    unitLabel: '회차',
    min: 0,
    max: 3,
    step: 1
  },
  {
    key: 'planning',
    label: '콘텐츠 기획 및 연출',
    unitPrice: 200000,
    unitLabel: '편',
    min: 2,
    max: 16,
    step: 1
  },
  {
    key: 'longform',
    label: '롱폼 편집 (10분 이내)',
    unitPrice: 600000,
    unitLabel: '편',
    min: 0,
    max: 8,
    step: 1
  },
  {
    key: 'reedit',
    label: '쇼츠 편집 (기존 영상 재편집)',
    unitPrice: 0,
    unitLabel: '편',
    min: 0,
    max: 32,
    step: 2
  },
  {
    key: 'shortform',
    label: '숏폼 편집 (신규 촬영 후 편집)',
    unitPrice: 200000,
    unitLabel: '편',
    min: 0,
    max: 24,
    step: 1
  },
  {
    key: 'thumbnail',
    label: '썸네일 디자인',
    unitPrice: 50000,
    unitLabel: '편',
    min: 0,
    max: 24,
    step: 1
  },
  {
    key: 'consultSurvey',
    label: '사전 설문/진단 분석',
    unitPrice: 0,
    unitLabel: '회',
    min: 0,
    max: 1,
    step: 1
  },
  {
    key: 'consultSession',
    label: '오프라인 컨설팅 (2시간 이내)',
    unitPrice: 150000,
    unitLabel: '회',
    min: 0,
    max: 1,
    step: 1
  },
  {
    key: 'consultReport',
    label: '온라인 보고서 제공',
    unitPrice: 100000,
    unitLabel: '건',
    min: 0,
    max: 5,
    step: 1
  },
  {
    key: 'inhouseSetup',
    label: '인하우스 마케팅팀 셋업 및 채용 대행',
    unitPrice: 500000,
    unitLabel: '월',
    min: 0,
    max: 12,
    step: 1
  },
  {
    key: 'practicalTraining',
    label: '영상 촬영/편집 실무 교육 (1개월·주1회·2시간·총8회)',
    unitPrice: 800000,
    unitLabel: '패키지',
    min: 0,
    max: 1,
    step: 1
  }
];

const lineItemMap = Object.fromEntries(lineItems.map((item) => [item.key, item])) as Record<
  LineItemKey,
  LineItem
>;

const initialFormState: FormState = {
  consultLocation: 'seoul',
  addOns: {
    drone: false,
    motion: false,
    consultingOnly: false,
    inhouseSetup: false,
    practicalTraining: false
  }
};

const budgetOptions = [
  { value: 2200000, label: '220만원', desc: '저예산 테스트 운영' },
  { value: 2800000, label: '280만원', desc: '라이트 운영' },
  { value: 3300000, label: '330만원', desc: '필수 운영 중심' },
  { value: 4400000, label: '440만원', desc: '표준 운영 권장' },
  { value: 5500000, label: '550만원', desc: '확장 운영' },
  { value: 6600000, label: '660만원', desc: '집중 운영' }
] as const;

const anniversaryBenefit = {
  active: true,
  title: '법인 전환 1주년 혜택',
  body: '이번 달 내 계약 시 1개월 무료 진행 (12+1개월)'
};

const formEntries = {
  budget: '285925672',
  goal: '1552981172',
  detailNote: '699812247'
} as const;

const formatWon = (n: number) => n.toLocaleString('ko-KR');
const formatRate = (n: number) => Math.round(n * 1000) / 10;

const clampBudget = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(12000000, Math.max(1500000, Math.round(value / 100000) * 100000));
};

const toSafeFileDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

function toBudgetBandLabel(monthlyBudget: number) {
  if (monthlyBudget <= 2000000) return '월 150만 ~ 200만 원 (테스트 운영형)';
  if (monthlyBudget <= 3000000) return '월 200만 ~ 300만 원 (라이트 운영형)';
  if (monthlyBudget <= 5000000) return '월 300 ~ 500만 원 (성장기/브랜딩 강화형)';
  if (monthlyBudget <= 10000000) return '월 500 ~ 1,000만 원 (공격적 확장/시장 선점형)';
  return '월 1,000만 원 이상 (VIP/통합 마케팅형)';
}

function toGoalLabel(goal?: GoalType) {
  if (goal === 'lead') return '직접적인 신규 상담 및 매출 증대';
  if (goal === 'brand') return '브랜드 신뢰도 상승 및 권위자 이미지 구축';
  return '기업/브랜드 홍보 자산 축적';
}

function toChannelLabel(channel?: ChannelState) {
  if (channel === 'new') return '신규 채널 개설';
  if (channel === 'rebuild') return '채널 리빌딩';
  return '운영 중인 채널 개선';
}

function toMixLabel(mix?: MixType) {
  if (mix === 'long') return '롱폼 중심';
  if (mix === 'short') return '숏폼 중심';
  return '균형 믹스';
}

function toConsultLocationLabel(location?: ConsultLocation) {
  return location === 'busan' ? '부산' : '서울';
}

function toAddOnLabel(addOns: AddOns) {
  const list: string[] = [];
  if (addOns.consultingOnly) list.push('컨설팅 단독 상품');
  if (addOns.inhouseSetup) list.push('인하우스 마케팅팀 셋업/채용 대행');
  if (addOns.practicalTraining) list.push('영상 촬영/편집 실무 교육');
  if (addOns.drone) list.push('드론 촬영');
  if (addOns.motion) list.push('고급 모션 그래픽');
  return list.length > 0 ? list.join(', ') : '없음';
}

function getLineItemUnitPrice(form: FormState, key: LineItemKey) {
  if (key === 'consultSession') {
    return form.consultLocation === 'busan' ? 250000 : 150000;
  }

  return lineItemMap[key].unitPrice;
}

function getGoogleFormViewUrl() {
  const embedUrl = content.contact.googleFormEmbedUrl.trim();
  try {
    const url = new URL(embedUrl);
    url.search = '';
    return url.toString();
  } catch {
    return content.contact.googleFormShareUrl.trim();
  }
}

function buildConsultPrefillUrl(form: FormState, quote: QuoteResult) {
  const url = new URL(getGoogleFormViewUrl());
  const term = form.term ?? 3;
  const summary = [
    '[자동 입력] 견적 기반 상담 요청',
    `월 예산(공급가): ${formatWon(quote.budget)}원`,
    `예산 활용도: ${quote.utilization}%`,
    `공급가액: ${formatWon(quote.subtotal)}원`,
    `할인율: ${formatRate(quote.discountRate)}%`,
    `최종 금액(VAT 포함): ${formatWon(quote.total)}원`,
    `채널 상태: ${toChannelLabel(form.channelState)}`,
    `운영 목표: ${toGoalLabel(form.goal)}`,
    `콘텐츠 믹스: ${toMixLabel(form.mix)}`,
    `계약 기간: ${term}개월${anniversaryBenefit.active && term === 12 ? ' (12+1 혜택 문의)' : ''}`,
    `선택 옵션: ${toAddOnLabel(form.addOns)}`,
    `컨설팅 지역: ${toConsultLocationLabel(form.consultLocation)}`,
    form.addOns.consultingOnly
      ? '컨설팅 단독 구성: 사전 설문(필수) + 오프라인 컨설팅(2시간) + 온라인 보고서(건별)'
      : '월 운영대행 중심 구성'
  ].join('\n');

  url.searchParams.set('usp', 'pp_url');
  url.searchParams.set(`entry.${formEntries.budget}`, toBudgetBandLabel(quote.budget));
  url.searchParams.set(`entry.${formEntries.goal}`, toGoalLabel(form.goal));
  url.searchParams.set(`entry.${formEntries.detailNote}`, summary);

  return url.toString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getQuantityBounds(form: FormState, quantities: Quantities, key: LineItemKey) {
  const item = lineItemMap[key];
  let min = item.min;
  let max = item.max;
  const budget = form.monthlyBudget ?? 4400000;
  const isLeanBudget = budget <= 3000000;
  const isConsultingOnly = form.addOns.consultingOnly;
  const term = form.term ?? 3;

  const operationKeys: LineItemKey[] = ['shoot', 'planning', 'longform', 'reedit', 'shortform', 'thumbnail'];
  const consultingFixedKeys: LineItemKey[] = ['consultSurvey', 'consultSession'];

  if (isConsultingOnly && operationKeys.includes(key)) {
    min = 0;
    max = 0;
    return { min, max, step: item.step };
  }

  if (consultingFixedKeys.includes(key)) {
    const value = isConsultingOnly ? 1 : 0;
    min = value;
    max = value;
    return { min, max, step: item.step };
  }

  if (key === 'consultReport') {
    if (isConsultingOnly) {
      min = 1;
      max = 5;
    } else {
      min = 0;
      max = 0;
    }
    return { min, max, step: item.step };
  }

  if (key === 'inhouseSetup') {
    if (form.addOns.inhouseSetup) {
      min = term;
      max = term;
    } else {
      min = 0;
      max = 0;
    }
    return { min, max, step: item.step };
  }

  if (key === 'practicalTraining') {
    const enabled =
      form.addOns.practicalTraining;
    min = enabled ? 1 : 0;
    max = enabled ? 1 : 0;
    return { min, max, step: item.step };
  }

  if (key === 'thumbnail') {
    if (quantities.longform <= 0) {
      min = 0;
      max = 0;
    } else {
      min = Math.max(min, quantities.longform);
    }
  }

  if (key === 'shoot' && isLeanBudget) {
    min = 0;
    max = Math.min(max, 1);
  }

  if (key === 'planning' && isLeanBudget) {
    min = Math.max(min, 2);
  }

  if (key === 'reedit') {
    if (form.mix === 'short') {
      min = Math.max(min, 4);
    } else {
      min = Math.max(min, 2);
    }
  }

  if (key === 'shortform') {
    if (form.mix === 'short') {
      min = Math.max(min, isLeanBudget ? 2 : 4);
    } else if (form.mix === 'balanced') {
      min = Math.max(min, isLeanBudget ? 1 : 2);
    }
  }

  if (key === 'longform') {
    if (form.mix === 'short') {
      min = 0;
    } else if (form.mix === 'long') {
      min = Math.max(min, isLeanBudget ? 1 : 2);
    } else if (form.goal === 'brand' && !isLeanBudget) {
      min = Math.max(min, 1);
    }
  }

  return { min, max, step: item.step };
}

function applyDependentQuantityRules(form: FormState, quantities: Quantities): Quantities {
  const next = { ...quantities };
  const longformBounds = getQuantityBounds(form, next, 'longform');
  next.longform = Math.min(longformBounds.max, Math.max(longformBounds.min, next.longform));

  const thumbnailBounds = getQuantityBounds(form, next, 'thumbnail');
  next.thumbnail = Math.min(thumbnailBounds.max, Math.max(thumbnailBounds.min, next.thumbnail));

  const shootBounds = getQuantityBounds(form, next, 'shoot');
  next.shoot = Math.min(shootBounds.max, Math.max(shootBounds.min, next.shoot));

  const planningBounds = getQuantityBounds(form, next, 'planning');
  next.planning = Math.min(planningBounds.max, Math.max(planningBounds.min, next.planning));

  const shortformBounds = getQuantityBounds(form, next, 'shortform');
  next.shortform = Math.min(shortformBounds.max, Math.max(shortformBounds.min, next.shortform));

  const reeditBounds = getQuantityBounds(form, next, 'reedit');
  next.reedit = Math.min(reeditBounds.max, Math.max(reeditBounds.min, next.reedit));

  const consultSurveyBounds = getQuantityBounds(form, next, 'consultSurvey');
  next.consultSurvey = Math.min(consultSurveyBounds.max, Math.max(consultSurveyBounds.min, next.consultSurvey));

  const consultSessionBounds = getQuantityBounds(form, next, 'consultSession');
  next.consultSession = Math.min(consultSessionBounds.max, Math.max(consultSessionBounds.min, next.consultSession));

  const consultReportBounds = getQuantityBounds(form, next, 'consultReport');
  next.consultReport = Math.min(consultReportBounds.max, Math.max(consultReportBounds.min, next.consultReport));

  const inhouseSetupBounds = getQuantityBounds(form, next, 'inhouseSetup');
  next.inhouseSetup = Math.min(inhouseSetupBounds.max, Math.max(inhouseSetupBounds.min, next.inhouseSetup));

  const practicalTrainingBounds = getQuantityBounds(form, next, 'practicalTraining');
  next.practicalTraining = Math.min(
    practicalTrainingBounds.max,
    Math.max(practicalTrainingBounds.min, next.practicalTraining)
  );

  return next;
}

function getVisibleLineItems(quote: QuoteResult) {
  return lineItems.filter((item) => quote.quantities[item.key] > 0);
}

function downloadEstimateCsv(form: FormState, quote: QuoteResult) {
  const term = form.term ?? 3;
  const visibleLineItems = getVisibleLineItems(quote);
  const rows = [
    ['항목', '단가', '수량', '구분', '합계'],
    ...visibleLineItems.map((item) => [
      item.label,
      String(getLineItemUnitPrice(form, item.key)),
      String(quote.quantities[item.key]),
      item.unitLabel,
      getLineItemUnitPrice(form, item.key) === 0 ? '필수 절차' : String(quote.lineTotals[item.key])
    ]),
    [],
    ['채널 상태', toChannelLabel(form.channelState)],
    ['운영 목표', toGoalLabel(form.goal)],
    ['콘텐츠 믹스', toMixLabel(form.mix)],
    ['계약 기간', `${term}개월`],
    ['선택 옵션', toAddOnLabel(form.addOns)],
    ['공급가액', String(quote.subtotal)],
    ['할인율(%)', String(formatRate(quote.discountRate))],
    ['할인금액', String(quote.discountAmount)],
    ['할인 반영 공급가', String(quote.taxable)],
    ['부가세(10%)', String(quote.vat)],
    ['최종 금액(VAT 포함)', String(quote.total)]
  ];

  const csv = rows.map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `turnkeyhaus-estimate-${toSafeFileDate()}.csv`;
  a.click();
  URL.revokeObjectURL(href);
}

function openEstimatePdfPrint(form: FormState, quote: QuoteResult) {
  const term = form.term ?? 3;
  const visibleLineItems = getVisibleLineItems(quote);
  const tableRows = visibleLineItems
    .map((item) => {
      const unitPrice = getLineItemUnitPrice(form, item.key);
      const total = unitPrice === 0 ? '필수 절차' : `${formatWon(quote.lineTotals[item.key])}원`;
      return `<tr>
        <td>${escapeHtml(item.label)}</td>
        <td style="text-align:right;">${unitPrice === 0 ? '0' : `${formatWon(unitPrice)}원`}</td>
        <td style="text-align:center;">${quote.quantities[item.key]}</td>
        <td style="text-align:center;">${escapeHtml(item.unitLabel)}</td>
        <td style="text-align:right;">${total}</td>
      </tr>`;
    })
    .join('');

  const html = `<!doctype html>
  <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <title>Turnkeyhaus 견적서</title>
      <style>
        body { font-family: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; color:#111; padding:24px; }
        h1 { margin:0 0 6px; font-size:24px; }
        p { margin:4px 0; font-size:13px; color:#444; }
        table { width:100%; border-collapse:collapse; margin-top:20px; }
        th, td { border:1px solid #d8d8d8; padding:8px 10px; font-size:12px; }
        th { background:#f4f4f4; text-align:left; }
        .summary { margin-top:20px; width:360px; margin-left:auto; }
        .summary div { display:flex; justify-content:space-between; font-size:13px; margin:4px 0; }
        .total { border-top:1px solid #333; padding-top:8px; margin-top:8px; font-weight:700; font-size:18px; }
        .badge { margin-top:10px; display:inline-block; border:1px solid #21c1a2; background:#e9fbf7; color:#0b3d35; padding:6px 10px; font-size:12px; font-weight:600; }
      </style>
    </head>
    <body>
      <h1>Turnkeyhaus 월 운영 견적서</h1>
      <p>산출일: ${new Date().toLocaleDateString('ko-KR')}</p>
      <p>채널 상태: ${escapeHtml(toChannelLabel(form.channelState))} · 운영 목표: ${escapeHtml(
    toGoalLabel(form.goal)
  )} · 콘텐츠 믹스: ${escapeHtml(toMixLabel(form.mix))}</p>
      <p>계약 기간: ${term}개월 · 선택 옵션: ${escapeHtml(toAddOnLabel(form.addOns))} · 컨설팅 지역: ${escapeHtml(
    toConsultLocationLabel(form.consultLocation)
  )}</p>
      ${anniversaryBenefit.active && term === 12 ? `<span class="badge">${escapeHtml(anniversaryBenefit.body)}</span>` : ''}

      <table>
        <thead>
          <tr>
            <th>항목</th><th style="text-align:right;">단가</th><th style="text-align:center;">수량</th><th style="text-align:center;">구분</th><th style="text-align:right;">합계</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>

      <div class="summary">
        <div><span>공급가액</span><strong>${formatWon(quote.subtotal)}원</strong></div>
        <div><span>할인금액</span><strong>- ${formatWon(quote.discountAmount)}원</strong></div>
        <div><span>할인 반영 공급가</span><strong>${formatWon(quote.taxable)}원</strong></div>
        <div><span>부가세 (10%)</span><strong>+ ${formatWon(quote.vat)}원</strong></div>
        <div class="total"><span>최종 금액 (VAT 포함)</span><strong>${formatWon(quote.total)}원</strong></div>
      </div>
      <script>window.onload = () => window.print();</script>
    </body>
  </html>`;

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=960,height=720');
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

const copyQuantities = (source: Quantities): Quantities => ({ ...source });

function getInitialQuantities(form: FormState): Quantities {
  const budget = form.monthlyBudget ?? 4400000;
  const quantities: Quantities =
    budget <= 2600000
      ? {
          shoot: 0,
          planning: 2,
          longform: 0,
          reedit: 6,
          shortform: 3,
          thumbnail: 0,
          consultSurvey: 0,
          consultSession: 0,
          consultReport: 0,
          inhouseSetup: 0,
          practicalTraining: 0
        }
      : budget <= 3600000
      ? {
          shoot: 1,
          planning: 4,
          longform: 1,
          reedit: 8,
          shortform: 3,
          thumbnail: 1,
          consultSurvey: 0,
          consultSession: 0,
          consultReport: 0,
          inhouseSetup: 0,
          practicalTraining: 0
        }
      : budget <= 5000000
      ? {
          shoot: 1,
          planning: 6,
          longform: 2,
          reedit: 10,
          shortform: 4,
          thumbnail: 2,
          consultSurvey: 0,
          consultSession: 0,
          consultReport: 0,
          inhouseSetup: 0,
          practicalTraining: 0
        }
      : {
          shoot: 2,
          planning: 8,
          longform: 3,
          reedit: 12,
          shortform: 6,
          thumbnail: 3,
          consultSurvey: 0,
          consultSession: 0,
          consultReport: 0,
          inhouseSetup: 0,
          practicalTraining: 0
        };

  if (form.channelState === 'new') {
    quantities.planning += budget <= 3000000 ? 1 : 2;
    quantities.thumbnail += budget <= 3000000 ? 0 : 1;
  }

  if (form.channelState === 'rebuild') {
    quantities.planning += 3;
    quantities.longform += 1;
  }

  if (form.goal === 'lead') {
    quantities.longform = Math.max(0, quantities.longform - 1);
    quantities.shortform += 2;
    quantities.reedit += 2;
  }

  if (form.goal === 'brand') {
    quantities.longform += 1;
    quantities.thumbnail += 1;
    quantities.shortform = Math.max(0, quantities.shortform - 1);
  }

  if (form.mix === 'long') {
    quantities.longform += 2;
    quantities.shortform = Math.max(0, quantities.shortform - 2);
    quantities.reedit = Math.max(4, quantities.reedit - 4);
  }

  if (form.mix === 'short') {
    quantities.longform = Math.max(0, quantities.longform - 2);
    quantities.shortform += 4;
    quantities.reedit += 4;
  }

  if ((form.term ?? 3) >= 9) {
    quantities.planning += 1;
    quantities.reedit += 2;
  }

  return applyDependentQuantityRules(form, quantities);
}

function getDiscountRate(form: FormState) {
  if (form.addOns.consultingOnly) {
    return {
      rate: 0,
      notes: ['컨설팅 단독 상품은 회차형 고정 단가로 할인율이 적용되지 않습니다.']
    };
  }

  const term = form.term ?? 3;
  const budget = form.monthlyBudget ?? 4400000;

  const termRate =
    term === 12 ? 0.1 :
    term === 9 ? 0.07 :
    term === 6 ? 0.04 :
    0;

  const budgetRate = budget >= 5500000 ? 0.01 : budget >= 4400000 ? 0.005 : 0;
  const goalRate =
    form.goal === 'lead' && term >= 9 ? 0.01 :
    form.goal === 'lead' ? 0.005 :
    form.goal === 'balanced' && term >= 9 ? 0.005 :
    0;

  const raw = termRate + budgetRate + goalRate;
  const rate = Math.min(raw, 0.12);

  const notes: string[] = [];
  if (termRate > 0) notes.push(`계약 기간 할인 ${Math.round(termRate * 100)}% 적용`);
  if (budgetRate > 0) notes.push(`예산 효율 보너스 ${Math.round(budgetRate * 1000) / 10}% 적용`);
  if (goalRate > 0) notes.push(`운영 목표 정합 할인 ${Math.round(goalRate * 1000) / 10}% 적용`);
  notes.push('단가 보호 가드: 총 할인율 상한 12% 적용');

  return { rate, notes };
}

function subtotalFor(form: FormState, quantities: Quantities) {
  return lineItems.reduce((sum, item) => sum + getLineItemUnitPrice(form, item.key) * quantities[item.key], 0);
}

function getAdjustmentOrders(form: FormState) {
  if (form.addOns.consultingOnly) {
    return {
      addOrder: [] as LineItemKey[],
      removeOrder: [] as LineItemKey[]
    };
  }

  const mix = form.mix;
  const goal = form.goal;
  const budget = form.monthlyBudget ?? 4400000;
  const isLeanBudget = budget <= 3000000;

  if (mix === 'short') {
    return {
      addOrder: ['shortform', 'reedit', 'planning', 'thumbnail', 'longform', 'shoot'] as LineItemKey[],
      removeOrder: (isLeanBudget
        ? ['thumbnail', 'longform', 'shoot', 'planning', 'shortform']
        : ['thumbnail', 'planning', 'longform', 'shortform', 'shoot']) as LineItemKey[]
    };
  }

  if (mix === 'long') {
    return {
      addOrder: ['longform', 'planning', 'thumbnail', 'shortform', 'shoot'] as LineItemKey[],
      removeOrder: (isLeanBudget
        ? ['thumbnail', 'shortform', 'shoot', 'planning', 'longform']
        : ['thumbnail', 'planning', 'shortform', 'longform', 'shoot']) as LineItemKey[]
    };
  }

  if (goal === 'lead') {
    return {
      addOrder: ['shortform', 'reedit', 'planning', 'longform', 'thumbnail', 'shoot'] as LineItemKey[],
      removeOrder: (isLeanBudget
        ? ['thumbnail', 'longform', 'shoot', 'planning', 'shortform']
        : ['thumbnail', 'planning', 'longform', 'shortform', 'shoot']) as LineItemKey[]
    };
  }

  return {
    addOrder: ['planning', 'longform', 'shortform', 'reedit', 'thumbnail', 'shoot'] as LineItemKey[],
    removeOrder: (isLeanBudget
      ? ['thumbnail', 'shoot', 'longform', 'planning', 'shortform']
      : ['thumbnail', 'planning', 'shortform', 'longform', 'shoot']) as LineItemKey[]
  };
}

function optimizeQuantities(form: FormState, base: Quantities, discountRate: number): Quantities {
  const budget = form.monthlyBudget ?? 4400000;
  const targetSubtotal = Math.round(budget / Math.max(0.01, 1 - discountRate));
  let quantities = applyDependentQuantityRules(form, copyQuantities(base));
  const { addOrder, removeOrder } = getAdjustmentOrders(form);

  let loopCount = 0;
  while (subtotalFor(form, quantities) > targetSubtotal * 1.03 && loopCount < 240) {
    let changed = false;

    for (const key of removeOrder) {
      const item = lineItemMap[key];
      if (item.unitPrice === 0) continue;
      const { min } = getQuantityBounds(form, quantities, key);

      const next = quantities[key] - item.step;
      if (next >= min) {
        const candidate = applyDependentQuantityRules(form, {
          ...quantities,
          [key]: next
        });
        if (subtotalFor(form, candidate) === subtotalFor(form, quantities) && candidate[key] === quantities[key]) continue;
        quantities = candidate;
        changed = true;
        break;
      }
    }

    if (!changed) break;
    loopCount += 1;
  }

  loopCount = 0;
  while (subtotalFor(form, quantities) < targetSubtotal * 0.97 && loopCount < 240) {
    let changed = false;

    for (const key of addOrder) {
      const item = lineItemMap[key];
      const { max } = getQuantityBounds(form, quantities, key);
      const next = quantities[key] + item.step;
      if (next <= max) {
        const candidate = applyDependentQuantityRules(form, {
          ...quantities,
          [key]: next
        });
        if (subtotalFor(form, candidate) === subtotalFor(form, quantities) && candidate[key] === quantities[key]) continue;
        quantities = candidate;
        changed = true;
        break;
      }
    }

    if (!changed) break;
    loopCount += 1;
  }

  if (form.mix === 'short') {
    quantities.reedit = Math.max(10, quantities.shortform * 2);
  } else if (form.mix === 'long') {
    quantities.reedit = Math.max(4, quantities.shortform);
  } else {
    quantities.reedit = Math.max(8, Math.round(quantities.shortform * 1.5));
  }

  return applyDependentQuantityRules(form, quantities);
}

function calculateQuote(form: FormState, quantities: Quantities, rate: number, notes: string[]): QuoteResult {
  const normalizedQuantities = applyDependentQuantityRules(form, quantities);
  const lineTotals = lineItems.reduce((acc, item) => {
    acc[item.key] = getLineItemUnitPrice(form, item.key) * normalizedQuantities[item.key];
    return acc;
  }, {} as Record<LineItemKey, number>);

  const subtotal = Object.values(lineTotals).reduce((sum, value) => sum + value, 0);
  const discountAmount = Math.min(Math.round(subtotal * rate), Math.round(subtotal * 0.12));
  const taxable = Math.max(0, subtotal - discountAmount);
  const vat = Math.round(taxable * 0.1);
  const total = taxable + vat;
  const budget = form.monthlyBudget ?? 4400000;
  const utilization = budget > 0 ? Math.round((taxable / budget) * 1000) / 10 : 0;

  return {
    lineTotals,
    quantities: normalizedQuantities,
    subtotal,
    discountRate: rate,
    discountAmount,
    taxable,
    vat,
    total,
    budget,
    utilization,
    addOns: form.addOns,
    discountNotes: notes
  };
}

function buildQuote(form: FormState): QuoteResult {
  const { rate, notes } = getDiscountRate(form);
  const base = getInitialQuantities(form);
  const optimized = optimizeQuantities(form, base, rate);
  return calculateQuote(form, optimized, rate, notes);
}

function getStepCompletion(form: FormState, step: StepKey) {
  switch (step) {
    case 'channel':
      return Boolean(form.channelState);
    case 'budget':
      return Boolean(form.monthlyBudget);
    case 'goal':
      return Boolean(form.goal);
    case 'mix':
      return Boolean(form.mix);
    case 'term':
      return Boolean(form.term);
    case 'addons':
      return true;
    default:
      return false;
  }
}

export default function DiagnosticCalculator() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const currentStep = steps[stepIndex];
  const canProceed = getStepCompletion(form, currentStep.key);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setBudget = (value: number) => {
    updateForm('monthlyBudget', clampBudget(value));
  };

  const toggleAddOn = (key: keyof AddOns) => {
    setForm((prev) => {
      const nextValue = !prev.addOns[key];
      return {
        ...prev,
        consultLocation:
          key === 'consultingOnly' && nextValue ? (prev.consultLocation ?? 'seoul') : prev.consultLocation,
        addOns: {
          ...prev.addOns,
          [key]: nextValue
        }
      };
    });
  };

  const goNext = () => {
    if (!canProceed) return;
    if (stepIndex >= steps.length - 1) return;
    setStepIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    if (stepIndex <= 0) return;
    setStepIndex((prev) => prev - 1);
  };

  const generateQuote = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setQuote(buildQuote(form));
      setIsCalculating(false);
    }, 700);
  };

  const resetAll = () => {
    setForm(initialFormState);
    setStepIndex(0);
    setQuote(null);
    setIsCalculating(false);
  };

  const adjustQuantity = (key: LineItemKey, direction: -1 | 1) => {
    setQuote((prev) => {
      if (!prev) return prev;

      const item = lineItemMap[key];
      const { min, max } = getQuantityBounds(form, prev.quantities, key);
      const next = prev.quantities[key] + item.step * direction;
      if (next < min || next > max) return prev;

      const quantities = applyDependentQuantityRules(form, {
        ...prev.quantities,
        [key]: next
      });

      return calculateQuote(form, quantities, prev.discountRate, prev.discountNotes);
    });
  };

  const handleBudgetInputChange = (raw: string) => {
    const digits = raw.replaceAll(/[^0-9]/g, '');
    if (!digits) {
      updateForm('monthlyBudget', undefined);
      return;
    }
    setBudget(Number(digits));
  };

  const handleDownloadExcel = () => {
    if (!quote) return;
    downloadEstimateCsv(form, quote);
  };

  const handleDownloadPdf = () => {
    if (!quote) return;
    openEstimatePdfPrint(form, quote);
  };

  const consultPrefillUrl = quote ? buildConsultPrefillUrl(form, quote) : content.contact.googleFormShareUrl.trim();
  const progressRatio = quote ? 1 : (stepIndex + 1) / steps.length;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <section id="pricing" className="border-y border-black/10 bg-white py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
        <div className="mb-12 space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-[13px] font-bold tracking-[0.1em] text-black/45">
            [ 운영 견적 플래너 ]
          </div>
          <h2 className="whitespace-pre-line text-[32px] font-bold leading-[1.28] tracking-tight text-[#0B0F0E] md:text-[44px]">
            내 월 예산으로 바로 확인하는
            {'\n'}
            유튜브 채널 운영 견적
          </h2>
          <p className="mx-auto max-w-[70ch] text-[16px] leading-[1.85] text-black/60 md:text-[17px]">
            월 예산과 운영 목표를 선택하면 실행 가능한 제작 조합과 예상 금액을 자동 산출합니다. 상담 신청 시
            선택한 견적 내용이 함께 전달되어 빠르게 맞춤 제안을 받을 수 있습니다.
          </p>
          {anniversaryBenefit.active ? (
            <div className="mx-auto inline-flex max-w-[760px] items-center rounded-xl border border-[#21c1a2]/35 bg-[#e9fbf7] px-4 py-2.5 text-[14px] font-semibold text-[#0b3d35]">
              {anniversaryBenefit.title} · {anniversaryBenefit.body}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="order-2 h-fit rounded-2xl border border-black/10 bg-white p-4 md:p-5 lg:order-1 lg:sticky lg:top-24">
            <div className="mb-4">
              <div className="flex items-end justify-between">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-black/55">진행 상태</p>
                <p className="text-sm font-bold text-[#0B0F0E]">
                  {quote ? '완료' : `${stepIndex + 1}/${steps.length}`}
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#0B0F0E] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <ol className="space-y-2.5">
              {steps.map((step, index) => {
                const isDone = quote ? true : index < stepIndex;
                const isActive = !quote && index === stepIndex;
                const isLocked = !quote && index > stepIndex;

                return (
                  <li
                    key={step.key}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'border-[#0B0F0E] bg-[#0B0F0E] text-white shadow-[0_2px_10px_rgba(11,15,14,0.18)]'
                        : isDone
                        ? 'border-black/15 bg-[#F3F5F6] text-[#0B0F0E]'
                        : isLocked
                        ? 'border-black/10 bg-white text-black/40'
                        : 'border-black/10 bg-white text-black/55'
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white text-[#0B0F0E]'
                          : isDone
                          ? 'bg-[#0B0F0E] text-white'
                          : 'bg-black/10 text-black/50'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-[14px] font-semibold leading-[1.3] ${isActive ? 'text-white' : 'text-current'}`}>
                      {stepDisplayLabels[step.key]}
                    </span>
                  </li>
                );
              })}
            </ol>

            {form.monthlyBudget ? (
              <div className="mt-4 rounded-xl border border-black/12 bg-[#FAFAFA] p-3">
                <p className="text-xs font-semibold text-black/50">선택 예산 (공급가 기준)</p>
                <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0B0F0E]">
                  {formatWon(form.monthlyBudget)}원
                </p>
              </div>
            ) : null}
          </aside>

          <div className="order-1 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)] md:p-8 lg:order-2">
            <AnimatePresence mode="wait">
              {quote ? (
                <motion.div
                  key="quote-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-7"
                >
                  <div className="flex flex-col gap-4 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.12em] text-black/45">맞춤 견적서</p>
                      <h3 className="mt-1 text-[30px] font-bold tracking-tight text-[#0B0F0E] md:text-[34px]">
                        {form.addOns.consultingOnly
                          ? '컨설팅 단독 상품 견적안'
                          : `월 ${formatWon(quote.budget)}원 예산 최적안`}
                      </h3>
                      <p className="mt-1 text-sm text-black/58">
                        {form.addOns.consultingOnly
                          ? '사전 설문 + 오프라인 1회(2시간 이내) + 온라인 보고서 1회 구성'
                          : `예산 활용도 ${quote.utilization}% · 할인율 ${formatRate(quote.discountRate)}% 적용`}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-black/52">산출일: {new Date().toLocaleDateString()}</p>
                  </div>

                  {anniversaryBenefit.active && form.term === 12 ? (
                    <div className="rounded-xl border border-[#21c1a2]/35 bg-[#e9fbf7] p-4">
                      <p className="text-[13px] font-semibold text-[#0b3d35]">{anniversaryBenefit.title}</p>
                      <p className="mt-1 text-[14px] font-medium text-[#0f4e45]">{anniversaryBenefit.body}</p>
                    </div>
                  ) : null}

                  <div className="overflow-x-auto rounded-xl border border-black/10">
                    <table className="w-full min-w-[780px] text-left">
                      <thead className="bg-black/[0.03] text-[12px] font-bold tracking-[0.08em] text-black/58">
                        <tr>
                          <th className="px-4 py-3">항목</th>
                          <th className="px-4 py-3 text-right">단가</th>
                          <th className="px-4 py-3 text-center">수량</th>
                          <th className="px-4 py-3 text-center">구분</th>
                          <th className="px-4 py-3 text-right">합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getVisibleLineItems(quote).map((item) => {
                          const bounds = getQuantityBounds(form, quote.quantities, item.key);
                          const canDecrement = quote.quantities[item.key] - item.step >= bounds.min;
                          const canIncrement = quote.quantities[item.key] + item.step <= bounds.max;
                          const unitPrice = getLineItemUnitPrice(form, item.key);

                          return (
                            <tr key={item.key} className="border-t border-black/8 text-sm text-black/72">
                              <td className="px-4 py-4 font-medium text-[#0B0F0E]">
                                {item.label}
                                {item.key === 'thumbnail' && quote.quantities.longform === 0 ? (
                                  <p className="mt-1 text-xs font-medium text-black/45">롱폼 1편 이상 선택 시 적용</p>
                                ) : null}
                              </td>
                              <td className="px-4 py-4 text-right">
                                {unitPrice === 0 ? '0' : formatWon(unitPrice)}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => adjustQuantity(item.key, -1)}
                                    disabled={!canDecrement}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-black/15 text-black/70 leading-none transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
                                  >
                                    -
                                  </button>
                                  <span className="min-w-[34px] text-center font-semibold text-[#0B0F0E]">
                                    {quote.quantities[item.key]}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => adjustQuantity(item.key, 1)}
                                    disabled={!canIncrement}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-black/15 text-black/70 leading-none transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center text-black/55">{item.unitLabel}</td>
                              <td className="px-4 py-4 text-right font-semibold text-[#0B0F0E]">
                                {unitPrice === 0 ? '필수 절차' : formatWon(quote.lineTotals[item.key])}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="rounded-xl border border-[#21c1a2]/35 bg-[#21c1a2]/8 p-4">
                      <p className="text-[13px] font-semibold text-black/70">할인율 산정 근거</p>
                      <ul className="mt-2 space-y-1 text-[13px] leading-[1.7] text-black/64">
                        {quote.discountNotes.map((note) => (
                          <li key={note}>- {note}</li>
                        ))}
                      </ul>
                    </div>

                    <dl className="w-full min-w-[300px] space-y-2 text-sm md:w-auto">
                      <div className="flex items-center justify-between text-black/65">
                        <dt>공급가액</dt>
                        <dd>{formatWon(quote.subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between text-black/65">
                        <dt>할인금액</dt>
                        <dd>-{formatWon(quote.discountAmount)}</dd>
                      </div>
                      <div className="flex items-center justify-between text-black/65">
                        <dt>할인 반영 공급가</dt>
                        <dd>{formatWon(quote.taxable)}</dd>
                      </div>
                      <div className="flex items-center justify-between text-black/65">
                        <dt>부가세 (10%)</dt>
                        <dd>+{formatWon(quote.vat)}</dd>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-black/12 pt-3 text-[30px] font-bold tracking-tight text-[#0B0F0E]">
                        <dt className="text-base font-semibold">최종 금액 (VAT 포함)</dt>
                        <dd>{formatWon(quote.total)}원</dd>
                      </div>
                    </dl>
                  </div>

                  {(quote.addOns.drone || quote.addOns.motion) ? (
                    <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4">
                      <p className="text-[13px] font-semibold text-amber-800">별도 협의 항목 (견적 미포함)</p>
                      <ul className="mt-2 space-y-1 text-[13px] leading-[1.7] text-amber-700">
                        {quote.addOns.drone ? (
                          <li>- 드론 촬영: 촬영 환경/비행 허가/안전 조건에 따라 별도 협의</li>
                        ) : null}
                        {quote.addOns.motion ? (
                          <li>- 고급 모션 그래픽: 작업 난이도/러닝타임에 따라 별도 협의</li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <button
                        type="button"
                        onClick={handleDownloadExcel}
                        className="rounded-xl border border-black/12 py-3.5 text-[14px] font-bold text-black/65 transition-colors hover:bg-black/[0.03]"
                      >
                        Excel 내보내기
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="rounded-xl border border-black/12 py-3.5 text-[14px] font-bold text-black/65 transition-colors hover:bg-black/[0.03]"
                      >
                        PDF 저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuote(null)}
                        className="rounded-xl border border-black/12 py-3.5 text-[14px] font-bold text-black/60 transition-colors hover:bg-black/[0.03]"
                      >
                        단계 다시 수정하기
                      </button>
                      <button
                        type="button"
                        onClick={resetAll}
                        className="rounded-xl border border-black/12 py-3.5 text-[14px] font-bold text-black/60 transition-colors hover:bg-black/[0.03]"
                      >
                        처음부터 다시하기
                      </button>
                    </div>
                    <a
                      href={consultPrefillUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#0B0F0E] px-5 py-4 text-[17px] font-bold text-white transition-colors hover:bg-zinc-800"
                    >
                      이 견적으로 상담 신청하기
                    </a>
                    <p className="text-center text-xs font-medium text-black/46">
                      예산·믹스·예상 금액이 상담 폼에 자동 첨부됩니다.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={currentStep.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-8 border-b border-black/10 pb-5">
                    <p className="text-xs font-semibold tracking-[0.12em] text-black/45">
                      STEP {stepIndex + 1} / {steps.length}
                    </p>
                    <h3 className="mt-1 text-[28px] font-bold tracking-tight text-[#0B0F0E] md:text-[32px]">
                      {currentStep.title}
                    </h3>
                    <p className="mt-1 text-sm text-black/58">{currentStep.subtitle}</p>
                  </div>

                  {currentStep.key === 'channel' ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { value: 'existing' as ChannelState, label: '운영 중인 채널', desc: '현재 채널을 개선' },
                        { value: 'new' as ChannelState, label: '신규 채널 개설', desc: '채널 기획부터 시작' },
                        { value: 'rebuild' as ChannelState, label: '채널 리빌딩', desc: '포지셔닝 재정비' }
                      ].map((option) => {
                        const selected = form.channelState === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateForm('channelState', option.value)}
                            className={`rounded-xl border px-4 py-5 text-left transition-colors ${
                              selected
                                ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                                : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                            }`}
                          >
                            <p className="text-[18px] font-semibold text-[#0B0F0E]">{option.label}</p>
                            <p className="mt-1 text-sm text-black/58">{option.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {currentStep.key === 'budget' ? (
                    <div className="space-y-5">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {budgetOptions.map((option) => {
                          const selected = form.monthlyBudget === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setBudget(option.value)}
                              className={`rounded-xl border px-4 py-5 text-left transition-colors ${
                                selected
                                  ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                                  : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                              }`}
                            >
                              <p className="text-[22px] font-bold tracking-tight text-[#0B0F0E]">
                                {option.label}
                              </p>
                              <p className="mt-1 text-sm text-black/58">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="text-sm font-semibold text-black/62">예산 직접 입력 (150만원 ~ 1,200만원)</p>
                          <label className="inline-flex items-center gap-2 text-sm">
                            <span className="text-black/50">공급가 기준</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={form.monthlyBudget ? formatWon(form.monthlyBudget) : ''}
                              onChange={(event) => handleBudgetInputChange(event.target.value)}
                              placeholder="예: 4,400,000"
                              className="w-[180px] rounded-lg border border-black/12 bg-white px-3 py-2 text-right font-semibold text-[#0B0F0E] outline-none focus:border-[#21c1a2]"
                            />
                            <span className="text-black/60">원</span>
                          </label>
                        </div>

                        <input
                          type="range"
                          min={1500000}
                          max={12000000}
                          step={100000}
                          value={form.monthlyBudget ?? 4400000}
                          onChange={(event) => setBudget(Number(event.target.value))}
                          className="mt-4 h-2 w-full cursor-pointer accent-[#21c1a2]"
                        />
                        <div className="mt-2 flex justify-between text-xs text-black/45">
                          <span>150만원</span>
                          <span>600만원</span>
                          <span>1,200만원</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentStep.key === 'goal' ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { value: 'brand' as GoalType, label: '브랜딩 강화', desc: '신뢰/전문성 중심' },
                        { value: 'lead' as GoalType, label: '문의 전환', desc: '상담/리드 중심' },
                        { value: 'balanced' as GoalType, label: '균형 운영', desc: '브랜딩+전환 병행' }
                      ].map((option) => {
                        const selected = form.goal === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateForm('goal', option.value)}
                            className={`rounded-xl border px-4 py-5 text-left transition-colors ${
                              selected
                                ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                                : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                            }`}
                          >
                            <p className="text-[18px] font-semibold text-[#0B0F0E]">{option.label}</p>
                            <p className="mt-1 text-sm text-black/58">{option.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {currentStep.key === 'mix' ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { value: 'long' as MixType, label: '롱폼 중심', desc: '설득형 본편 강화' },
                        { value: 'short' as MixType, label: '숏폼 중심', desc: '노출량/빈도 강화' },
                        { value: 'balanced' as MixType, label: '균형 믹스', desc: '롱폼+숏폼 동시 운용' }
                      ].map((option) => {
                        const selected = form.mix === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateForm('mix', option.value)}
                            className={`rounded-xl border px-4 py-5 text-left transition-colors ${
                              selected
                                ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                                : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                            }`}
                          >
                            <p className="text-[18px] font-semibold text-[#0B0F0E]">{option.label}</p>
                            <p className="mt-1 text-sm text-black/58">{option.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {currentStep.key === 'term' ? (
                    <div className="space-y-4">
                      {anniversaryBenefit.active ? (
                        <div className="rounded-xl border border-[#21c1a2]/35 bg-[#e9fbf7] px-4 py-3 text-sm font-semibold text-[#0f4e45]">
                          {anniversaryBenefit.title} · {anniversaryBenefit.body}
                        </div>
                      ) : null}
                      <div className="grid gap-3 md:grid-cols-4">
                        {[
                          { value: 3 as TermMonths, label: '3개월', desc: '정가', rate: '0%' },
                          { value: 6 as TermMonths, label: '6개월', desc: '운영 안정화', rate: '최대 4%' },
                          { value: 9 as TermMonths, label: '9개월', desc: '확장 추천', rate: '최대 7%' },
                          { value: 12 as TermMonths, label: '12개월', desc: '장기 파트너', rate: '최대 10%', bonus: '12+1 혜택' }
                        ].map((option) => {
                          const selected = form.term === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateForm('term', option.value)}
                              className={`rounded-xl border px-4 py-5 text-left transition-colors ${
                                selected
                                  ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                                  : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                              }`}
                            >
                              {option.bonus ? (
                                <span className="inline-flex rounded-full bg-[#0B0F0E] px-2 py-0.5 text-[11px] font-semibold text-[#b7ff00]">
                                  {option.bonus}
                                </span>
                              ) : null}
                              <p className="mt-2 text-[24px] font-bold tracking-tight text-[#0B0F0E]">{option.label}</p>
                              <p className="mt-1 text-sm text-black/58">{option.desc}</p>
                              <p className="mt-2 text-xs font-semibold text-[#21c1a2]">{option.rate}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {currentStep.key === 'addons' ? (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => toggleAddOn('consultingOnly')}
                        className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                          form.addOns.consultingOnly
                            ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                            : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                        }`}
                      >
                        <p className="text-[18px] font-semibold text-[#0B0F0E]">컨설팅 단독 상품</p>
                        <p className="mt-1 text-sm text-black/60">
                          사전 설문 + 1회 오프라인 컨설팅(2시간 이내) + 온라인 보고서 1회 제공
                        </p>
                      </button>

                      {form.addOns.consultingOnly ? (
                        <div className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4">
                          <p className="text-[13px] font-semibold text-black/60">오프라인 컨설팅 지역</p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {[
                              { value: 'seoul' as ConsultLocation, label: '서울 (15만원)' },
                              { value: 'busan' as ConsultLocation, label: '부산 (25만원)' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => updateForm('consultLocation', option.value)}
                                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                                  (form.consultLocation ?? 'seoul') === option.value
                                    ? 'border-[#21c1a2] bg-[#21c1a2]/10 text-[#0B0F0E]'
                                    : 'border-black/12 text-black/60 hover:bg-black/[0.03]'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="grid gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => toggleAddOn('inhouseSetup')}
                          className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                            form.addOns.inhouseSetup
                              ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                              : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                          }`}
                        >
                          <p className="text-[18px] font-semibold text-[#0B0F0E]">인하우스 팀 셋업/채용 대행</p>
                          <p className="mt-1 text-sm text-black/60">
                            월 50만원 · 면접 대행 + 팀 구성 + 장비/운영 솔루션 제공
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAddOn('practicalTraining')}
                          className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                            form.addOns.practicalTraining
                              ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                              : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                          }`}
                        >
                          <p className="text-[18px] font-semibold text-[#0B0F0E]">영상 촬영/편집 실무 교육</p>
                          <p className="mt-1 text-sm text-black/60">
                            1개월 과정(총 8회) · 패키지 80만원
                          </p>
                        </button>
                      </div>

                      <div className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4">
                        <p className="text-[13px] font-semibold text-black/60">별도 협의 항목 (견적 미포함)</p>
                        <div className="mt-3 space-y-3">
                      <button
                        type="button"
                        onClick={() => toggleAddOn('drone')}
                        className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                          form.addOns.drone
                            ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                            : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                        }`}
                      >
                        <p className="text-[18px] font-semibold text-[#0B0F0E]">드론 촬영</p>
                        <p className="mt-1 text-sm text-black/60">촬영지/허가/비행 안전 조건에 따라 별도 협의 (견적 미포함)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleAddOn('motion')}
                        className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                          form.addOns.motion
                            ? 'border-[#21c1a2] bg-[#21c1a2]/10'
                            : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                        }`}
                      >
                        <p className="text-[18px] font-semibold text-[#0B0F0E]">고급 모션 그래픽</p>
                        <p className="mt-1 text-sm text-black/60">난이도/러닝타임 기준으로 별도 협의 (견적 미포함)</p>
                      </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={stepIndex === 0}
                      className="rounded-lg border border-black/12 px-4 py-2.5 text-sm font-semibold text-black/60 transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      이전
                    </button>

                    <div className="flex gap-2">
                      {currentStep.key === 'addons' ? (
                        <button
                          type="button"
                          onClick={generateQuote}
                          disabled={isCalculating}
                          className="rounded-lg bg-[#0B0F0E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isCalculating ? '계산 중…' : '견적 생성'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={goNext}
                          disabled={!canProceed}
                          className="rounded-lg bg-[#0B0F0E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          다음
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
