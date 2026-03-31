'use client';

export default function ProofBadges() {
  const items = [
    { big: '-2일', small: '기존 대비 제작 기간 단축' },
    { big: '+2천 명', small: '영상 1편 당 최대 구독자 증가 수' },
  ];

  return (
    <section className="pb-2 pt-4">
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
        {items.map((it) => (
          <div key={it.big} className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_22px_rgba(11,15,14,0.03)] md:p-6">
            <div className="text-[42px] font-semibold tracking-tight leading-[1.05] text-[#0B0F0E] md:text-[48px]">{it.big}</div>
            <div className="mt-2 text-sm leading-[1.5] text-black/58">{it.small}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs tracking-[0.01em] text-black/45">*internal aggregated data 기준</p>
    </section>
  );
}
