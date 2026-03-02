'use client';

export default function ProofBadges() {
  const items = [
    { big: '-2일', small: '콘텐츠 제작 기간 단축' },
    { big: '4개월', small: '신규 런칭 후 신환 발생' },
    { big: '+2,000', small: '영상 1편 구독자 증가' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.big} className="rounded-2xl bg-black/[0.02] p-6">
            <div className="text-3xl font-semibold tracking-tight">{it.big}</div>
            <div className="mt-2 text-sm text-black/60">{it.small}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
