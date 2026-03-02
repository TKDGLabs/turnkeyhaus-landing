'use client';

import CountUp from './CountUp';

const comma = (n: number) => Math.round(n).toLocaleString();

export default function StatsBar() {
  return (
    <section className="w-full border-y border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatItem
            value={20200000}
            label="누적 조회수 돌파"
            suffix="+"
            format={comma}
          />
          <StatItem
            value={177000}
            label="누적 관리 구독자"
            suffix="+"
            format={comma}
          />
          <StatItem
            value={7.1}
            label="평균 노출 클릭률"
            suffix="%"
            decimals={1}
            format={(n) => n.toFixed(1)}
          />
          <StatItem
            value={3}
            label="동시 운영 채널 수 제한"
            suffix="개"
            format={(n) => String(Math.round(n))}
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
