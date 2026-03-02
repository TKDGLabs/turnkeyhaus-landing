'use client';

import type { ReactNode } from 'react';
import CountUp from './CountUp';

export default function BeforeAfterRomance() {
  const before = 500;
  const after = 5930;
  const growthPct = ((after - before) / before) * 100;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6">
        <div className="text-sm font-medium text-black/60">포트폴리오 · 리빌딩</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          로맨즈 채널 Before & After
        </h3>
        <p className="mt-2 text-black/60">
          구독자 성장폭을 “최종 숫자”가 아니라 “변화”로 보여줍니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="😭 리빌딩 전" sub="구독자">
          <div className="text-3xl font-semibold">
            <CountUp value={before} format={(n) => Math.round(n).toLocaleString()} />
            <span className="text-base font-medium text-black/60"> 명</span>
          </div>
          <div className="mt-2 text-sm text-black/60">운영은 되고 있었지만 전환이 약했던 상태</div>
        </Card>

        <div className="flex items-center justify-center">
          <div className="rounded-full bg-black/5 px-6 py-3 text-xl font-semibold">→</div>
        </div>

        <Card title="🤩 리빌딩 후" sub="현재 구독자">
          <div className="text-3xl font-semibold">
            <CountUp value={after} format={(n) => Math.round(n).toLocaleString()} />
            <span className="text-base font-medium text-black/60"> 명</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-yellow-200/60 px-3 py-2 text-sm font-semibold">
            +{growthPct.toFixed(0)}% 성장 (500 → 5,930)
          </div>

          <div className="mt-2 text-sm text-black/60">
            *필요하면 “상담문의 증가” 같은 문구는 데이터(문의수/리드수) 확보 후 숫자로 붙이는 걸 추천
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-sm text-black/60">{sub}</div>
      <div className="mt-1 text-lg font-semibold">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
