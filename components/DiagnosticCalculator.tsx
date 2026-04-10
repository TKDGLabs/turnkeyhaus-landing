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
    target: '유튜브를 처음 시작하거나, 채널의 기본기를 탄탄하게 다지고 싶은 원장님',
    includes: [
      '롱폼 기획/촬영/편집 (월 2회)',
      '숏폼 기획/편집 (월 2회)',
      '썸네일/채널 아트 디자인',
      '채널 방향성 및 초기 기획 컨설팅'
    ]
  },
  growth: {
    level: 'Growth Level',
    price: '4,000,000',
    target: '안정적인 채널 성장과 실질적인 DB 전환(매출)이 필요한 전문직',
    includes: [
      '롱폼 기획/촬영/편집 (월 4회)',
      '숏폼 기획/편집 (월 4회)',
      '썸네일/채널 아트 디자인',
      '유튜브 SEO 최적화 및 업로드 대행'
    ]
  },
  intensive: {
    level: 'Intensive Level',
    price: '6,000,000',
    target: '대규모 트래픽 확보와 하이엔드 브랜딩이 동시에 필요한 병원/기업',
    includes: [
      '롱폼 기획/촬영/편집 (월 4회)',
      '숏폼 기획/편집 (월 8회)',
      '썸네일/채널 아트 디자인',
      '유튜브 SEO 최적화 및 업로드 대행',
      '전담 PD 배정 및 월 1회 전략 회의'
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
    <section className="py-20 bg-zinc-50 border-t border-black/10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 mb-4">
            QUICK DIAGNOSIS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0B0F0E]">1분 맞춤형 채널 진단</h2>
          <p className="text-black/60 mt-4 font-medium">단순 제작 견적이 아니라, 원장님께 필요한 최적의 운영 레벨을 진단해 드립니다.</p>
        </div>

        <div className="bg-[#0B0F0E] rounded-3xl p-6 md:p-12 min-h-[450px] relative overflow-hidden shadow-2xl">
          {/* @ts-ignore */}
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full justify-center text-white"
              >
                <div className="w-full bg-white/10 h-1 mb-10 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[#21c1a2] h-full" 
                    initial={{ width: `${(step / questions.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center leading-tight">
                  {questions[step].title}
                </h3>
                <div className="grid gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="w-full p-5 md:p-6 text-left border border-white/10 rounded-xl hover:bg-white/5 hover:border-[#21c1a2]/50 transition-all text-base md:text-lg font-medium group"
                    >
                      <span className="text-[#21c1a2] opacity-0 group-hover:opacity-100 transition-opacity mr-2">✓</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* 결과 화면: 고급 영수증 / 제안서 리포트 형태 */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-[#0B0F0E] rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative"
              >
                <div className="border-b-2 border-[#0B0F0E] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">DIAGNOSIS REPORT</h3>
                    <p className="text-sm text-black/50 font-mono mt-1 font-medium">TURNKEYHAUS CHANNEL STRATEGY</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-black/40 tracking-widest uppercase mb-1">Date</p>
                    <p className="text-sm font-mono font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
                    <div>
                      <p className="text-[11px] font-bold text-black/40 tracking-widest uppercase mb-2">Recommended Package</p>
                      <h4 className="text-2xl md:text-3xl font-extrabold text-[#0B0F0E]">{result.level}</h4>
                      <p className="text-sm text-black/70 mt-3 font-medium leading-relaxed max-w-[40ch]">
                        {result.target}
                      </p>
                    </div>
                    <div className="text-left md:text-right bg-zinc-50 p-5 rounded-xl border border-black/5">
                      <p className="text-[11px] font-bold text-black/40 tracking-widest uppercase mb-1">Estimated Budget</p>
                      <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#21c1a2]">
                        <span className="text-lg text-black mr-1">₩</span>{result.price} <span className="text-sm font-medium text-black/50 tracking-normal">/ 월</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-black/10"></div>

                  <div>
                    <p className="text-[11px] font-bold text-black/40 tracking-widest uppercase mb-4">Service Details</p>
                    <ul className="space-y-3">
                      {result.includes.map((item, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-black/80 font-medium">
                           <span className="text-[#21c1a2] mt-0.5 font-bold">✓</span>
                           {item}
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 하단 CTA: 카카오톡 플러스 친구 상담으로 새 창 연결 */}
                <div className="mt-10 pt-6 border-t border-black/10">
                  <p className="text-xs text-black/40 mb-6 font-medium leading-relaxed">
                    * 본 리포트는 입력하신 데이터를 바탕으로 도출된 가이드라인입니다. 상세 제안 및 확정 견적은 대면/줌 미팅을 통한 채널 정밀 진단 이후 제공됩니다.
                  </p>
                  
                  {/* 버튼 대신 <a> 태그를 써서 새 창으로 링크 연결 */}
                  <a 
                    href="https://pf.kakao.com/_dyNPn/chat" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full block text-center bg-[#0B0F0E] text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors text-[15px] shadow-[0_8px_16px_rgba(11,15,14,0.1)]"
                  >
                    이 레벨로 정밀 진단 신청하기 (카카오톡 1:1 상담) &rarr;
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