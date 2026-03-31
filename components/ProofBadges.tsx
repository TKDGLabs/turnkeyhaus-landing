'use client';

export default function ProofBadges() {
  const items = [
    { big: '-2일', small: '기존 대비 제작 기간 단축' },
    { big: '+2천 명', small: '영상 1편 당 최대 구독자 증가 수' },
  ];

  return (
    <section className="pb-2 pt-4">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.big} className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_8px_22px_rgba(11,15,14,0.03)]">
            <div className="text-3xl font-semibold tracking-tight text-[#0B0F0E]">{it.big}</div>
            <div className="mt-2 text-sm text-black/60">{it.small}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-black/45">*internal aggregated data 기준</p>
    </section>
  );
}
