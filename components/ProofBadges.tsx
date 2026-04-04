'use client';

import CountUp from './CountUp';

export default function ProofBadges() {
  const items = [
    {
      value: 2,
      prefix: '-',
      suffix: '일',
      small: '기존 대비 제작 기간 단축',
      format: (n: number) => String(Math.round(n)),
    },
    {
      value: 2,
      prefix: '+',
      suffix: '천 명',
      small: '영상 1편 당 최대 구독자 증가 수',
      format: (n: number) => String(Math.round(n)),
    },
  ];

  return (
    <section className="pb-2 pt-4">
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
        {items.map((it) => (
          <div
            key={`${it.prefix}${it.value}${it.suffix}`}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_22px_rgba(11,15,14,0.03)] md:p-6"
          >
            <div className="text-[42px] font-semibold tracking-tight leading-[1.05] text-[#0B0F0E] md:text-[48px]">
              <CountUp
                value={it.value}
                prefix={it.prefix}
                suffix={it.suffix}
                format={it.format}
                durationMs={900}
              />
            </div>
            <div className="mt-2 text-sm leading-[1.5] text-black/58">{it.small}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs tracking-[0.01em] text-black/45">*internal aggregated data 기준</p>
    </section>
  );
}
