'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 'status',
    title: '현재 유튜브 채널의 상황은 어떠신가요?',
    options: [
      { label: '이제 막 시작하려고 합니다', value: 'new' },
      { label: '운영 중이나 성장이 정체되어 있습니다', value: 'stagnant' },
      { label: '조회수는 나오는데 실제 매출/DB 전환이 안 됩니다', value: 'conversion' },
    ]
  },
  {
    id: 'painpoint',
    title: '가장 큰 고민거리는 무엇인가요?',
    options: [
      { label: '기획과 촬영에 쏟을 시간이 절대적으로 부족합니다', value: 'time' },
      { label: '전문적인 편집과 디자인 퀄리티가 아쉽습니다', value: 'quality' },
      { label: '어떤 콘텐츠를 만들어야 할지 전략이 없습니다', value: 'strategy' },
    ]
  }
];

export default function DiagnosticCalculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    if (step < questions.length) {
      setTimeout(() => setStep(step + 1), 300); // 부드러운 전환을 위한 딜레이
    }
  };

  // 결과 도출 로직 (단순 예시)
  const getRecommendation = () => {
    if (answers.status === 'new') return { level: 'Foundation', price: '월 300만 원대' };
    if (answers.status === 'conversion') return { level: 'Intensive', price: '월 600만 원대' };
    return { level: 'Growth', price: '월 400만 원대' };
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">1분 맞춤형 채널 진단</h2>
          <p className="text-gray-400 mt-4">단순 제작 견적이 아닌, 원장님께 필요한 최적의 운영 레벨을 진단해 드립니다.</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 min-h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full justify-center"
              >
                {/* 진행도 바 */}
                <div className="w-full bg-zinc-800 h-1 mb-8 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-white h-full" 
                    initial={{ width: `${(step / questions.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-2xl font-bold mb-8 text-center">{questions[step].title}</h3>
                <div className="grid gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="w-full p-6 text-left border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-white transition-all text-lg"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* 결과 화면 (PDF 양식 느낌으로 디자인) */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-black rounded-xl p-8"
              >
                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                  <h3 className="text-3xl font-black tracking-tight">DIAGNOSIS REPORT</h3>
                  <span className="text-gray-500 font-mono text-sm">TURNKEYHAUS.</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 font-bold mb-1">추천 운영 레벨</p>
                    <p className="text-2xl font-bold text-blue-600">{getRecommendation().level} Package</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 font-bold mb-1">예상 예산 범위</p>
                    <p className="text-xl font-bold">{getRecommendation().price}</p>
                    <p className="text-xs text-gray-400 mt-2">* 상세 견적은 대면/줌 미팅을 통한 정밀 진단 후 최종 확정됩니다.</p>
                  </div>
                </div>

                <button className="w-full mt-8 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors">
                  이 레벨로 정밀 진단 신청하기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}