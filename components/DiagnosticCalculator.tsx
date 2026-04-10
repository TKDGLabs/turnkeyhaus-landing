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

const packageData = {
  foundation: {
    level: 'Foundation Level',
    price: '3,000,000',
    target: '유튜브를 처음 시작하거나, 채널의 기본기를 탄탄하게 다지고 싶은 원장님께 추천드립니다.',
    includes: [
      '롱폼 기획/촬영/편집 (월 2회)',
      '숏폼 기획/편집 (월 2회)',
      '썸네일/채널 아트 디자인 포함',
      '채널 방향성 및 초기 기획 컨설팅 제공'
    ]
  },
  growth: {
    level: 'Growth Level',
    price: '4,000,000',
    target: '안정적인 채널 성장과 실질적인 매출(DB) 전환이 필요한 전문직 원장님께 추천드립니다.',
    includes: [
      '롱폼 기획/촬영/편집 (월 4회)',
      '숏폼 기획/편집 (월 4회)',
      '썸네일/채널 아트 디자인 포함',
      '유튜브 SEO 최적화 및 업로드 전담 대행'
    ]
  },
  intensive: {
    level: 'Intensive Level',
    price: '6,000,000',
    target: '대규모 트래픽 확보와 하이엔드 브랜딩이 동시에 필요한 병원/기업에 추천드립니다.',
    includes: [
      '롱폼 기획/촬영/편집 (월 4회)',
      '숏폼 기획/편집 (월 8회)',
      '썸네일/채널 아트 디자인 포함',
      '유튜브 SEO 최적화 및 업로드 대행',
      '전담 PD 배정 및 월 1회 대면 전략 회의'
    ]
  }
};

export default function DiagnosticCalculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    if (step < questions.length) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const getRecommendation = () => {
    if (answers.status === 'new') return packageData.foundation;
    if (answers.status === 'conversion') return packageData.intensive;
    return packageData.growth;
  };

  const result = getRecommendation();

  return (
    <section className="py-24 bg-zinc-50 border-t border-black/10">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold tracking-[0.15em] text-black/40 mb-4 uppercase">
            Quick Diagnosis
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B0F0E]">1분 맞춤형 채널 진단</h2>
          <p className="text-black/60 mt-5 text-lg font-medium">단순 제작 견적이 아닌, 최적의 성장 전략 레벨을 도출합니다.</p>
        </div>

        <div className="bg-[#0B0F0E] rounded-[40px] p-6 md:p-16 min-h-[500px] relative overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full justify-center max-w-2xl mx-auto"
              >
                <div className="w-full bg-white/10 h-1.5 mb-12 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[#21c1a2] h-full" 
                    initial={{ width: `${(step / questions.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white leading-tight break-keep">
                  {questions[step].title}
                </h3>
                <div className="grid gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="w-full p-6 text-left border border-white/10 rounded-2xl hover:bg-white/5 hover:border-[#21c1a2]/50 transition-all text-lg font-medium text-white/80 group"
                    >
                      <span className="text-[#21c1a2] opacity-0 group-hover:opacity-100 transition-opacity mr-3">✓</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* ✅ 대폭 개선된 웅장한 리포트 화면 */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-[#0B0F0E] rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
              >
                {/* 리포트 상단부 */}
                <div className="p-10 md:p-16 border-b border-black/5 bg-zinc-50/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <div>
                      <h3 className="text-5xl font-black tracking-tighter text-[#0B0F0E] mb-2">DIAGNOSIS REPORT</h3>
                      <p className="text-sm font-bold text-black/30 tracking-[0.3em] font-mono">TURNKEYHAUS STRATEGY CENTER</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[11px] font-bold text-black/40 tracking-widest uppercase mb-1">Issue Date</p>
                      <p className="text-lg font-mono font-bold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
                    <div>
                      <span className="inline-block px-3 py-1 bg-black text-white text-[11px] font-bold tracking-widest rounded mb-4">RECOMMENDED</span>
                      <h4 className="text-4xl md:text-6xl font-black text-[#0B0F0E] tracking-tighter mb-6">
                        {result.level}
                      </h4>
                      <p className="text-xl text-black/70 font-medium leading-relaxed max-w-[500px] break-keep">
                        {result.target}
                      </p>
                    </div>
                    
                    <div className="bg-white border border-black/10 p-8 rounded-3xl shadow-sm min-w-[300px]">
                      <p className="text-[12px] font-bold text-black/40 tracking-widest uppercase mb-3">Estimated Monthly Budget</p>
                      <p className="text-4xl md:text-5xl font-black text-[#21c1a2] tracking-tighter">
                        <span className="text-2xl text-black/30 mr-2">₩</span>{result.price}
                      </p>
                      <p className="text-sm font-bold text-black/40 mt-2">VAT 별도 / 월 단위 계약</p>
                    </div>
                  </div>
                </div>

                {/* 리포트 하단부: 서비스 상세 내역 */}
                <div className="p-10 md:p-16">
                  <div className="mb-12">
                    <p className="text-[13px] font-bold text-black/40 tracking-widest uppercase mb-8 border-l-4 border-[#21c1a2] pl-4">Included Service Details</p>
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                      {result.includes.map((item, idx) => (
                         <div key={idx} className="flex items-start gap-4 text-lg md:text-xl text-black/80 font-semibold border-b border-black/5 pb-4">
                           <span className="text-[#21c1a2] font-bold text-2xl leading-none">✓</span>
                           {item}
                         </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-2xl p-6 mb-12">
                    <p className="text-sm text-black/50 font-medium leading-relaxed break-keep">
                      * 본 리포트는 원장님의 자가 진단 데이터를 기반으로 산출된 권장 레벨입니다. 턴키하우스의 전문 PD팀과의 대면 정밀 진단을 통해 원장님 채널의 고유한 강점과 시장 분석을 거쳐 최종 제안서가 확정됩니다.
                    </p>
                  </div>

                  {/* 최종 CTA 버튼: 더 크고 선명하게 */}
                  <a 
                    href="https://pf.kakao.com/_dyNPn/chat" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group relative flex items-center justify-center bg-[#0B0F0E] text-white text-xl font-bold py-6 rounded-[20px] hover:bg-zinc-800 transition-all shadow-xl"
                  >
                    이 레벨로 정밀 진단 신청하기 (카카오톡 상담)
                    <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}