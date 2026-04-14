'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { content } from '../content';

type StepKey = 'channel' | 'budget' | 'goal' | 'mix' | 'term' | 'addons';
type ChannelState = 'existing' | 'new' | 'rebuild';
type GoalType = 'brand' | 'lead' | 'balanced';
type MixType = 'long' | 'short' | 'balanced';
type TermMonths = 3 | 6 | 9 | 12;
type LineItemKey = 'shoot' | 'planning' | 'longform' | 'reedit' | 'shortform' | 'thumbnail';

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
};

type FormState = {
  channelState?: ChannelState;
  monthlyBudget?: number;
  goal?: GoalType;
  mix?: MixType;
  term?: TermMonths;
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
    subtitle: '드론 촬영/고급 모션 그래픽은 별도 협의 항목입니다.'
  }
];

const lineItems: LineItem[] = [
  {
    key: 'shoot',
    label: '촬영 (PD 2인, 3CAM 기준)',
    unitPrice: 600000,
    unitLabel: '회차',
    min: 1,
    max: 3,
    step: 1
  },
  {
    key: 'planning',
    label: '콘텐츠 기획 및 연출',
    unitPrice: 200000,
    unitLabel: '편',
    min: 4,
    max: 16,
    step: 1
  },
  {
    key: 'longform',
    label: '롱폼 편집 (10분 이내)',
    unitPrice: 600000,
    unitLabel: '편',
    min: 1,
    max: 8,
    step: 1
  },
  {
    key: 'reedit',
    label: '쇼츠 편집 (기존 영상 재편집)',
    unitPrice: 0,
    unitLabel: '편',
    min: 4,
    max: 32,
    step: 2
  },
  {
    key: 'shortform',
    label: '숏폼 편집 (신규 촬영 후 편집)',
    unitPrice: 200000,
    unitLabel: '편',
    min: 2,
    max: 24,
    step: 1
  },
  {
    key: 'thumbnail',
    label: '썸네일 디자인',
    unitPrice: 50000,
    unitLabel: '편',
    min: 2,
    max: 24,
    step: 1
  }
];

const lineItemMap = Object.fromEntries(lineItems.map((item) => [item.key, item])) as Record<
  LineItemKey,
  LineItem
>;

const initialFormState: FormState = {
  addOns: {
    drone: false,
    motion: false
  }
};

const budgetOptions = [
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
  return Math.min(12000000, Math.max(2000000, Math.round(value / 100000) * 100000));
};

const toSafeFileDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

function toBudgetBandLabel(monthlyBudget: number) {
  if (monthlyBudget <= 2500000) return '월 200만 원 내외 (스타트업/테스트형)';
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

function toAddOnLabel(addOns: AddOns) {
  const list: string[] = [];
  if (addOns.drone) list.push('드론 촬영');
  if (addOns.motion) list.push('고급 모션 그래픽');
  return list.length > 0 ? list.join(', ') : '없음';
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
    `별도 협의: ${toAddOnLabel(form.addOns)}`
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

function downloadEstimateCsv(form: FormState, quote: QuoteResult) {
  const term = form.term ?? 3;
  const rows = [
    ['항목', '단가', '수량', '구분', '합계'],
    ...lineItems.map((item) => [
      item.label,
      item.unitPrice === 0 ? '0' : String(item.unitPrice),
      String(quote.quantities[item.key]),
      item.unitLabel,
      item.unitPrice === 0 ? '패키지 포함' : String(quote.lineTotals[item.key])
    ]),
    [],
    ['채널 상태', toChannelLabel(form.channelState)],
    ['운영 목표', toGoalLabel(form.goal)],
    ['콘텐츠 믹스', toMixLabel(form.mix)],
    ['계약 기간', `${term}개월`],
    ['별도 협의', toAddOnLabel(form.addOns)],
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
  const tableRows = lineItems
    .map((item) => {
      const total = item.unitPrice === 0 ? '패키지 포함' : `${formatWon(quote.lineTotals[item.key])}원`;
      return `<tr>
        <td>${escapeHtml(item.label)}</td>
        <td style="text-align:right;">${item.unitPrice === 0 ? '0' : `${formatWon(item.unitPrice)}원`}</td>
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
      <p>계약 기간: ${term}개월 · 별도 협의: ${escapeHtml(toAddOnLabel(form.addOns))}</p>
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
  const quantities: Quantities = {
    shoot: 1,
    planning: 6,
    longform: 2,
    reedit: 10,
    shortform: 4,
    thumbnail: 3
  };

  if (form.channelState === 'new') {
    quantities.planning += 2;
    quantities.thumbnail += 1;
  }

  if (form.channelState === 'rebuild') {
    quantities.planning += 3;
    quantities.longform += 1;
  }

  if (form.goal === 'lead') {
    quantities.longform += 1;
    quantities.shortform += 2;
  }

  if (form.goal === 'brand') {
    quantities.longform += 1;
    quantities.thumbnail += 1;
  }

  if (form.mix === 'long') {
    quantities.longform += 2;
    quantities.shortform = Math.max(2, quantities.shortform - 2);
    quantities.reedit = Math.max(4, quantities.reedit - 4);
  }

  if (form.mix === 'short') {
    quantities.longform = Math.max(1, quantities.longform - 1);
    quantities.shortform += 4;
    quantities.reedit += 4;
  }

  if ((form.term ?? 3) >= 9) {
    quantities.planning += 1;
    quantities.reedit += 2;
  }

  return quantities;
}

function getDiscountRate(form: FormState) {
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

function subtotalFor(quantities: Quantities) {
  return lineItems.reduce((sum, item) => sum + item.unitPrice * quantities[item.key], 0);
}

function getAdjustmentOrders(mix: MixType | undefined) {
  if (mix === 'short') {
    return {
      addOrder: ['shortform', 'planning', 'thumbnail', 'longform', 'shoot'] as LineItemKey[],
      removeOrder: ['thumbnail', 'planning', 'longform', 'shortform', 'shoot'] as LineItemKey[]
    };
  }

  if (mix === 'long') {
    return {
      addOrder: ['longform', 'planning', 'thumbnail', 'shortform', 'shoot'] as LineItemKey[],
      removeOrder: ['thumbnail', 'planning', 'shortform', 'longform', 'shoot'] as LineItemKey[]
    };
  }

  return {
    addOrder: ['planning', 'longform', 'shortform', 'thumbnail', 'shoot'] as LineItemKey[],
    removeOrder: ['thumbnail', 'planning', 'shortform', 'longform', 'shoot'] as LineItemKey[]
  };
}

function optimizeQuantities(form: FormState, base: Quantities, discountRate: number): Quantities {
  const budget = form.monthlyBudget ?? 4400000;
  const targetSubtotal = Math.round(budget / Math.max(0.01, 1 - discountRate));
  const quantities = copyQuantities(base);
  const { addOrder, removeOrder } = getAdjustmentOrders(form.mix);

  let loopCount = 0;
  while (subtotalFor(quantities) > targetSubtotal * 1.03 && loopCount < 240) {
    let changed = false;

    for (const key of removeOrder) {
      const item = lineItemMap[key];
      if (item.unitPrice === 0) continue;

      const next = quantities[key] - item.step;
      if (next >= item.min) {
        quantities[key] = next;
        changed = true;
        break;
      }
    }

    if (!changed) break;
    loopCount += 1;
  }

  loopCount = 0;
  while (subtotalFor(quantities) < targetSubtotal * 0.97 && loopCount < 240) {
    let changed = false;

    for (const key of addOrder) {
      const item = lineItemMap[key];
      const next = quantities[key] + item.step;
      if (next <= item.max) {
        quantities[key] = next;
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

  quantities.thumbnail = Math.max(quantities.thumbnail, quantities.longform);

  return quantities;
}

function calculateQuote(form: FormState, quantities: Quantities, rate: number, notes: string[]): QuoteResult {
  const lineTotals = lineItems.reduce((acc, item) => {
    acc[item.key] = item.unitPrice * quantities[item.key];
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
    quantities,
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
    setForm((prev) => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [key]: !prev.addOns[key]
      }
    }));
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
      const next = prev.quantities[key] + item.step * direction;
      if (next < item.min || next > item.max) return prev;

      const quantities = {
        ...prev.quantities,
        [key]: next
      };

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

  return (
    <section id="pricing" className="border-y border-black/10 bg-white py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
        <div className="mb-12 space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-[13px] font-bold tracking-[0.1em] text-black/45">
            [ 운영 견적 플래너 ]
          </div>
          <h2 className="whitespace-pre-line text-[32px] font-bold leading-[1.28] tracking-tight text-[#0B0F0E] md:text-[44px]">
            월 예산 안에서 최대 효율을 찾는
            {'\n'}
            유튜브 채널 운영 견적
          </h2>
          <p className="mx-auto max-w-[70ch] text-[16px] leading-[1.85] text-black/60 md:text-[17px]">
            단가는 고정하고, 수량/믹스/계약기간 조합으로 효율을 최적화합니다. 드론 촬영, 고급 모션 그래픽은
            별도 협의 항목으로 분리해 견적의 현실성을 높였습니다.
          </p>
          {anniversaryBenefit.active ? (
            <div className="mx-auto inline-flex max-w-[760px] items-center rounded-xl border border-[#21c1a2]/35 bg-[#e9fbf7] px-4 py-2.5 text-[14px] font-semibold text-[#0b3d35]">
              {anniversaryBenefit.title} · {anniversaryBenefit.body}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-black/55">진행 단계</p>
            <ol className="space-y-2">
              {steps.map((step, index) => {
                const isDone = quote ? true : index < stepIndex;
                const isActive = !quote && index === stepIndex;
                const isLocked = !quote && index > stepIndex;

                return (
                  <li
                    key={step.key}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'border-[#21c1a2] bg-[#21c1a2]/10 text-[#0B0F0E]'
                        : isDone
                        ? 'border-black/12 bg-black/[0.02] text-black/70'
                        : isLocked
                        ? 'border-black/8 bg-white text-black/35'
                        : 'border-black/10 bg-white text-black/55'
                    }`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isActive
                          ? 'bg-[#21c1a2] text-[#06372f]'
                          : isDone
                          ? 'bg-black/70 text-white'
                          : 'bg-black/10 text-black/50'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>{step.title.replace(' 선택해 주세요', '')}</span>
                  </li>
                );
              })}
            </ol>

            {form.monthlyBudget ? (
              <div className="mt-4 rounded-xl border border-black/10 bg-[#FAFAFA] p-3">
                <p className="text-xs font-semibold text-black/50">선택 예산 (공급가 기준)</p>
                <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0B0F0E]">
                  {formatWon(form.monthlyBudget)}원
                </p>
              </div>
            ) : null}
          </aside>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)] md:p-8">
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
                        월 {formatWon(quote.budget)}원 예산 최적안
                      </h3>
                      <p className="mt-1 text-sm text-black/58">
                        예산 활용도 {quote.utilization}% · 할인율 {formatRate(quote.discountRate)}% 적용
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
                        {lineItems.map((item) => (
                          <tr key={item.key} className="border-t border-black/8 text-sm text-black/72">
                            <td className="px-4 py-4 font-medium text-[#0B0F0E]">{item.label}</td>
                            <td className="px-4 py-4 text-right">
                              {item.unitPrice === 0 ? '0' : formatWon(item.unitPrice)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => adjustQuantity(item.key, -1)}
                                  className="h-7 w-7 rounded border border-black/15 text-black/70 transition-colors hover:bg-black/[0.04]"
                                >
                                  -
                                </button>
                                <span className="min-w-[34px] text-center font-semibold text-[#0B0F0E]">
                                  {quote.quantities[item.key]}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => adjustQuantity(item.key, 1)}
                                  className="h-7 w-7 rounded border border-black/15 text-black/70 transition-colors hover:bg-black/[0.04]"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center text-black/55">{item.unitLabel}</td>
                            <td className="px-4 py-4 text-right font-semibold text-[#0B0F0E]">
                              {item.unitPrice === 0 ? '패키지 포함' : formatWon(quote.lineTotals[item.key])}
                            </td>
                          </tr>
                        ))}
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

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleDownloadExcel}
                      className="flex-1 rounded-xl border border-black/12 py-4 text-[15px] font-bold text-black/65 transition-colors hover:bg-black/[0.03]"
                    >
                      Excel 내보내기
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="flex-1 rounded-xl border border-black/12 py-4 text-[15px] font-bold text-black/65 transition-colors hover:bg-black/[0.03]"
                    >
                      PDF 저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuote(null)}
                      className="flex-1 rounded-xl border border-black/12 py-4 text-[15px] font-bold text-black/60 transition-colors hover:bg-black/[0.03]"
                    >
                      단계 다시 수정하기
                    </button>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex-1 rounded-xl border border-black/12 py-4 text-[15px] font-bold text-black/60 transition-colors hover:bg-black/[0.03]"
                    >
                      처음부터 다시하기
                    </button>
                    <a
                      href={consultPrefillUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-[1.3] flex items-center justify-center rounded-xl bg-[#0B0F0E] py-4 text-[16px] font-bold text-white transition-colors hover:bg-zinc-800"
                    >
                      이 견적으로 상담 신청하기
                    </a>
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
                          <p className="text-sm font-semibold text-black/62">예산 직접 입력 (200만원 ~ 1,200만원)</p>
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
                          min={2000000}
                          max={12000000}
                          step={100000}
                          value={form.monthlyBudget ?? 4400000}
                          onChange={(event) => setBudget(Number(event.target.value))}
                          className="mt-4 h-2 w-full cursor-pointer accent-[#21c1a2]"
                        />
                        <div className="mt-2 flex justify-between text-xs text-black/45">
                          <span>200만원</span>
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
