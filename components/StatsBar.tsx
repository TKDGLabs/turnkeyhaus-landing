'use client';

import CountUp from './CountUp';

const toMan = (n: number, fractionDigits = 0) => {
  const v = n / 10000;
  if (fractionDigits === 0) return String(Math.round(v));
  return v.toFixed(fractionDigits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
};

export default function StatsBar() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-4">
        <StatItem
          value={20200000}
          label="누적 조회수 돌파"
          suffix="만+"
          format={(n) => toMan(n, 0)}
        />
        <StatItem
          value={177000}
          label="누적 관리 구독자"
          suffix="만+"
          format={(n) => toMan(n, 1)}
        />
        <StatItem
          value={7.1}
          label="평균 노출 클릭률"
          suffix="%"
          decimals={1}
          format={(n) => n.toFixed(1)}
        />
        <StatItem
          value={2250000}
          label="단일 영상 최대 조회수"
          suffix="만+"
          format={(n) => toMan(n, 0)}
        />
      </div>
    </section>
  );
}

function StatItem({
  value,
  label,
  suffix,
  decimals,
  format,
}: {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
  format?: (n: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-[0_8px_22px_rgba(11,15,14,0.03)]">
      <div className="text-[34px] font-semibold tracking-tight leading-[1.05] text-[#0B0F0E] md:text-[42px]">
        <CountUp value={value} suffix={suffix} decimals={decimals} format={format} />
      </div>
      <div className="mt-1 text-sm leading-[1.5] text-black/58">{label}</div>
    </div>
  );
}
