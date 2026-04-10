'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { content } from '../content';

// 기존 카드에 없던 추가 데이터 (모달용 설명, 이미지 등)
const modalExtraData = [
  {
    id: 'diagnosis',
    description: '단순한 수치 분석을 넘어 대표님/원장님의 철학과 운영 환경을 깊숙이 공감하고 이해합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/diagnosis.png',
    alt: '진단 단계 제안서 이미지'
  },
  {
    id: 'positioning',
    description: '타겟 고객의 니즈에 맞춰 압도적 전문성을 시장에 각인시키는 전략을 수립합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/positioning.png',
    alt: '포지셔닝 단계 제안서 이미지'
  },
  {
    id: 'organization',
    description: '조회수, DB 전환, 브랜딩을 동시에 잡기 위해 숏폼/롱폼 콘텐츠를 전략적으로 배치합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/organization.png',
    alt: '편성 단계 제안서 이미지'
  },
  {
    id: 'operation',
    description: '알고리즘이 사랑하고 시청자가 기다리는 최적의 업로드 패턴과 운영 로직을 설계합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/operation.png',
    alt: '운영 단계 제안서 이미지'
  }
];

export default function StrategyModals() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeStep = activeIndex !== null ? content.strategyFrame.steps[activeIndex] : null;
  const activeExtra = activeIndex !== null ? modalExtraData[activeIndex] : null;

  return (
    <div className="space-y-8 border-t border-black/10 pt-10 md:space-y-10 md:pt-12">
      {/* 기존 홈페이지와 100% 동일한 헤더 적용 */}
      <div className="max-w-[64ch] space-y-4">
        <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base">
          {content.strategyFrame.label}
        </div>
        <h3 className="whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px] max-w-[15ch] md:max-w-[16ch]">
          {content.strategyFrame.h2}
        </h3>
      </div>

      {/* 기존 하얀색 카드 디자인 유지 + 클릭 모달 애니메이션 추가 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.strategyFrame.steps.map((step, index) => (
          <motion.button
            key={step.title}
            onClick={() => setActiveIndex(index)}
            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(11,15,14,0.06)' }}
            whileTap={{ scale: 0.98 }}
            className="group rounded-2xl border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(11,15,14,0.03)] md:p-6 text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold tracking-[0.08em] text-black/45">{`0${index + 1}`}</div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#21c1a2]/80 group-hover:scale-150 transition-transform" />
            </div>
            <h4 className="mt-3 text-lg font-semibold text-[#0B0F0E] flex items-center justify-between">
              {step.title}
              <span className="text-[12px] font-medium text-[#21c1a2] opacity-0 group-hover:opacity-100 transition-opacity">
                자세히 보기 &rarr;
              </span>
            </h4>
            <p className="mt-2 text-sm leading-[1.9] text-black/70 whitespace-pre-line">{step.detail}</p>
          </motion.button>
        ))}
      </div>

      {/* 모달창 (깔끔한 화이트톤 유지) */}
      <AnimatePresence>
        {activeIndex !== null && activeStep && activeExtra && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIndex(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              className="relative flex h-full max-h-[85vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl md:flex-row z-10"
            >
              <button 
                onClick={() => setActiveIndex(null)}
                className="absolute right-6 top-6 z-50 rounded-full bg-black/5 p-2.5 text-black/70 transition-colors hover:bg-black/10 hover:text-black"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="flex w-full flex-col justify-center bg-white p-8 md:w-[420px] md:p-12 shrink-0 text-left border-b md:border-b-0 md:border-r border-black/5">
                <div className="space-y-8">
                  <div className="text-[12px] font-bold tracking-[0.2em] text-[#21c1a2] uppercase font-mono">
                    METHODOLOGY
                  </div>
                  <h3 className="whitespace-pre-line text-3xl md:text-4xl font-bold leading-[1.3] tracking-tight text-[#0B0F0E]">
                    {`0${activeIndex + 1}. `}{activeStep.title}
                  </h3>
                  <div className="h-[2px] w-12 bg-black/10" />
                  <p className="break-keep text-[16px] leading-[1.7] text-black/70 font-medium">
                    {activeStep.detail}
                    <br /><br />
                    {activeExtra.description}
                  </p>
                  <div className="pt-2">
                    <p className="inline-block rounded-lg bg-zinc-100 px-3 py-2 text-[12px] font-medium text-black/50">
                      {activeExtra.footnote}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center bg-zinc-50 p-6 md:p-10">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white">
                  <Image 
                    src={activeExtra.image} 
                    alt={activeExtra.alt}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 800px"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
