'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 모달 내용 데이터 매핑
const modalContent = {
  diagnosis: {
    title: '진단: 경험과 공감',
    description: '단순한 가이드가 아닌, 원장님/대표님의 실제 경험과 철학을 이끌어냅니다.',
    image: '/images/diagnosis-empathy.png', // 첨부하신 이미지 경로로 변경
  },
  positioning: {
    title: '포지셔닝: 채널 리브랜딩 가이드',
    description: '타겟 고객의 니즈에 맞춘 압도적인 전문성 포지셔닝.',
    image: '/images/positioning-guide.png',
  },
  organization: {
    title: '편성: 전략적 3-track 운영 구조',
    description: '숏폼, 미드폼, 롱폼을 교차 배열하여 조회수와 신뢰도를 동시에 잡습니다.',
    image: '/images/organization-3track.png',
  },
  operation: {
    title: '운영: 업로드 패턴 설계',
    description: '알고리즘이 사랑하고 시청자가 기다리는 최적의 업로드 주기.',
    image: '/images/operation-pattern.png',
  }
};

type ModalType = keyof typeof modalContent | null;

export default function StrategyModals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">전략 설계 프레임</h2>
        
        {/* 카드 리스트 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.keys(modalContent).map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal(key as ModalType)}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-bold">{modalContent[key as ModalType].title.split(':')[0]}</h3>
              <p className="text-sm text-gray-500 mt-2">자세히 보기 &rarr;</p>
            </motion.button>
          ))}
        </div>

        {/* 모달 (팝업) 영역 */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              {/* 뒷배경 블러 처리 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              {/* 모달 컨텐츠 창 */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl z-10 flex flex-col md:flex-row"
              >
                {/* 닫기 버튼 */}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  ✕
                </button>

                {/* 텍스트 영역 */}
                <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-center bg-gray-50">
                  <h3 className="text-3xl font-bold mb-4">{modalContent[activeModal].title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {modalContent[activeModal].description}
                  </p>
                </div>

                {/* 이미지/그래픽 영역 (첨부해주신 가이드 이미지들이 들어갈 곳) */}
                <div className="md:w-2/3 bg-gray-100 relative min-h-[400px]">
                  {/* next/image를 사용하여 최적화된 이미지 렌더링 권장 */}
                  <img 
                    src={modalContent[activeModal].image} 
                    alt={modalContent[activeModal].title}
                    className="absolute inset-0 w-full h-full object-contain p-8"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}