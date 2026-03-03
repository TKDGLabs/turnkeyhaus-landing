'use client';

import CountUp from './CountUp';

const toMan = (n: number, fractionDigits = 0) => {
  const v = n / 10000;
  if (fractionDigits === 0) return String(Math.round(v));
  return v.toFixed(fractionDigits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
};

export default function StatsBar() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
        <p className="mt-3 text-xs text-black/45">*internal aggregated data 기준</p>
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
    <div className="rounded-2xl bg-black/[0.02] px-4 py-4">
      <div className="text-2xl font-semibold tracking-tight md:text-3xl">
        <CountUp value={value} suffix={suffix} decimals={decimals} format={format} />
      </div>
      <div className="mt-1 text-sm text-black/60">{label}</div>
    </div>
  );
}
