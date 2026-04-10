'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const modalContent = {
  diagnosis: {
    title: '01. 진단\n경험과 공감',
    description: '단순한 수치 분석을 넘어 원장님/대표님의 철학과 운영 환경을 깊숙이 공감하고 이해합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/diagnosis.png', // 확장자가 .jpg라면 .jpg로 수정해주세요.
    alt: '진단 단계 제안서 이미지'
  },
  positioning: {
    title: '02. 포지셔닝\n압도적 전문성',
    description: '타겟 고객의 니즈에 맞춰 원장님만의 압도적 전문성을 시장에 각인시키는 전략을 수립합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/positioning.png',
    alt: '포지셔닝 단계 제안서 이미지'
  },
  organization: {
    title: '03. 편성\n전략적 3-track',
    description: '조회수, DB 전환, 브랜딩을 동시에 잡기 위해 숏폼/롱폼 콘텐츠를 전략적으로 배치합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/organization.png',
    alt: '편성 단계 제안서 이미지'
  },
  operation: {
    title: '04. 운영\n최적화 설계',
    description: '알고리즘이 사랑하고 시청자가 기다리는 최적의 업로드 패턴과 운영 로직을 설계합니다.',
    footnote: '*저희 팀이 직접 작성한 제안서의 내용입니다.',
    image: '/images/operation.png',
    alt: '운영 단계 제안서 이미지'
  }
};

type ModalType = keyof typeof modalContent | null;

export default function StrategyModals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <section className="py-24 bg-white border-y border-black/10">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-8">
        {/* 헤더 영역 */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base">
            SERVICE FRAME
          </div>
          <h2 className="whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px]">
            전략 설계 프레임
          </h2>
          <p className="mx-auto max-w-[60ch] text-base leading-[1.95] text-black/72 md:text-lg">
            카드를 클릭하여 턴키하우스만의 차별화된 컨설팅 세부 내용을 확인해 보세요.
          </p>
        </div>
        
        {/* 카드 리스트: 화이트 테마 최적화 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(modalContent).map((key) => (
            <motion.button
              key={key}
              whileHover={{ y: -8, shadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal(key as ModalType)}
              className="group flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/10 bg-white p-8 text-left shadow-[0_10px_24px_rgba(11,15,14,0.04)] transition-all duration-300 min-h-[240px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold tracking-widest text-black/30 uppercase">
                  {modalContent[key as ModalType].title.split('\n')[0]}
                </span>
                <div className="h-2 w-2 rounded-full bg-[#21c1a2]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0B0F0E] whitespace-pre-line leading-tight">
                  {modalContent[key as ModalType].title.split('\n')[1]}
                </h3>
                <p className="mt-4 text-[15px] font-semibold text-[#21c1a2] opacity-0 transition-opacity group-hover:opacity-100">
                  세부 내용 보기 →
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 1400px 초대형 모달 영역 */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              {/* 뒷배경 블러 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              
              {/* 모달 박스 */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative flex h-full max-h-[90vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:flex-row z-10"
              >
                {/* 닫기 버튼 */}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute right-8 top-8 z-50 rounded-full bg-black/5 p-3 text-black transition-colors hover:bg-black/10"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                {/* 좌측: 설명 텍스트 (400px 고정) */}
                <div className="flex w-full flex-col justify-center bg-[#FBFBFB] p-10 md:w-[450px] md:p-16 shrink-0">
                  <div className="space-y-8">
                    <div className="text-sm font-bold tracking-[0.2em] text-[#21c1a2] uppercase font-mono">
                      TURNKEYHAUS METHODOLOGY
                    </div>
                    <h3 className="whitespace-pre-line text-4xl font-bold leading-[1.15] tracking-tight text-[#0B0F0E] lg:text-5xl">
                      {modalContent[activeModal].title}
                    </h3>
                    <div className="h-px w-12 bg-black/10" />
                    <p className="break-keep text-lg leading-[1.8] text-black/70 font-medium">
                      {modalContent[activeModal].description}
                    </p>
                    <div className="pt-4">
                      <p className="inline-block rounded-lg bg-black/5 px-4 py-2 text-[13px] font-semibold text-black/50 italic">
                        {modalContent[activeModal].footnote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 우측: 16:9 이미지 영역 */}
                <div className="relative flex flex-1 items-center justify-center bg-white p-6 md:p-12">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    <Image 
                      src={modalContent[activeModal].image} 
                      alt={modalContent[activeModal].alt}
                      fill
                      priority
                      className="object-contain" // PDF 비율 유지를 위해 contain 사용
                      sizes="(max-width: 1400px) 100vw, 1000px"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}