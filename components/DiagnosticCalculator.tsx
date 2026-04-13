'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 'frequency',
    title: 'Q1. 한 달에 촬영에 할애할 수 있는 시간은 어느 정도인가요?',
    options: [
      { label: '월 1회', desc: '하루 날을 잡아 반나절 몰아서 촬영', value: '1' },
      { label: '월 2회 이상', desc: '여유로운 일정으로 분할 촬영', value: '2' },
    ]
  },
  {
    id: 'format',
    title: 'Q2. 어떤 형태의 영상이 주력이길 원하시나요?',
    options: [
      { label: '롱폼 위주', desc: '전문적인 정보 전달 위주의 가로 영상', value: 'long' },
      { label: '숏폼 위주', desc: '빠른 확산과 노출을 위한 세로 영상', value: 'short' },
      { label: '롱폼 + 숏폼 병행', desc: '두 마리 토끼를 다 잡는 균형 있는 운영', value: 'mixed' },
    ]
  },
  {
    id: 'volume',
    title: 'Q3. 희망하는 월간 영상 업로드 빈도는 어떻게 되나요?',
    options: [
      { label: '유지보수형', desc: '기본적인 채널 유지 (월 2편 내외)', value: 'basic' },
      { label: '꾸준한 성장형', desc: '안정적인 성장 곡선 형성 (월 3~4편 내외)', value: 'standard' },
      { label: '공격적 확보형', desc: '폭발적인 트래픽 및 DB 확보 (월 4편 이상)', value: 'premium' },
    ]
  }
];

const packageData = {
  basic: {
    level: 'Structure Foundation',
    price: '3,800,000',
    target: '유튜브 브랜딩의 기초를 다지고 효율적으로 운영하고 싶은 분께 추천합니다.',
    details: [
      '월 1회 스튜디오/출장 촬영 (PD 2인, 3CAM)',
      '콘텐츠 기획 및 연출 (총 6편 내외)',
      '롱폼 편집 (10분 이내) 2편',
      '쇼츠 재편집 8편 + 신규 숏폼 4편',
      '전문 썸네일 디자인 2편'
    ]
  },
  standard: {
    level: 'Structure Growth',
    price: '4,400,000',
    target: '꾸준한 콘텐츠 업로드로 안정적인 채널 성장을 원하시는 분께 추천합니다.',
    details: [
      '월 1회 스튜디오/출장 촬영 (PD 2인, 3CAM)',
      '콘텐츠 기획 및 연출 (총 7편 내외)',
      '롱폼 편집 (10분 이내) 3편',
      '쇼츠 재편집 12편 + 신규 숏폼 4편',
      '전문 썸네일 디자인 3편'
    ]
  },
  premium: {
    level: 'Structure Intensive',
    price: '5,000,000',
    target: '공격적인 트래픽 확보와 하이엔드 퀄리티 브랜딩이 필요한 분께 추천합니다.',
    details: [
      '월 2회 스튜디오/출장 촬영 (PD 2인, 3CAM)',
      '콘텐츠 기획 및 연출 (총 12편 내외)',
      '롱폼 편집 (10분 이내) 4편',
      '쇼츠 재편집 20편 + 신규 숏폼 8편',
      '전문 썸네일 디자인 4편'
    ]
  }
};

export default function DiagnosticCalculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setStep(step + 1);
      }, 600);
    }
  };

  const getRecommendation = () => {
    let score = 0;
    if (answers.frequency === '2') score += 2;
    if (answers.volume === 'premium') score += 2;
    if (answers.volume === 'standard') score += 1;

    if (score >= 3) return packageData.premium;
    if (score === 1 || score === 2) return packageData.standard;
    return packageData.basic;
  };

  const result = step >= questions.length && !isCalculating ? getRecommendation() : null;

  return (
    <section id="pricing" className="py-24 bg-white border-y border-black/10">
      <div className="mx-auto max-w-[900px] px-5 sm:px-6">
        
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[13px] font-bold tracking-[0.1em] text-black/40">
            [ 운영 레벨 진단 ]
          </div>
          <h2 className="whitespace-pre-line text-[32px] font-bold leading-[1.3] tracking-tight text-[#0B0F0E] md:text-[42px]">
            내 채널에 맞는 운영 레벨은?
          </h2>
          <p className="mx-auto max-w-[55ch] text-[16px] leading-[1.8] text-black/60 md:text-[17px]">
            단 3개의 질문으로 현재 상황에 가장 적합한 운영 체계와 예상 투자 예산을 확인해 보세요.
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-black/10 p-8 md:p-12 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.04)] min-h-[480px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* 1. 질문 섹션 */}
            {step < questions.length && !isCalculating && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* 진행률 바 */}
                <div className="flex items-center justify-between mb-10">
                  <div className="text-sm font-bold text-[#21c1a2]">STEP 0{step + 1}</div>
                  <div className="flex gap-2">
                    {questions.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx <= step ? 'w-8 bg-[#21c1a2]' : 'w-3 bg-black/10'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-[22px] md:text-[28px] font-bold mb-8 text-left text-[#0B0F0E] leading-[1.4] break-keep">
                  {questions[step].title}
                </h3>
                
                <div className="grid gap-3 md:gap-4 max-w-full">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="group flex items-center w-full p-5 md:p-6 text-left border border-black/10 rounded-2xl hover:bg-[#21c1a2]/5 hover:border-[#21c1a2] transition-all duration-300 shadow-sm"
                    >
                      <div className="shrink-0 w-6 h-6 rounded-full border-2 border-black/15 group-hover:border-[#21c1a2] flex items-center justify-center mr-5 transition-colors bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#21c1a2] scale-0 group-hover:scale-100 transition-transform duration-300" />
                      </div>
                      <div>
                        <div className="text-[17px] md:text-[19px] font-bold text-black/80 group-hover:text-[#0B0F0E] leading-tight mb-1 transition-colors">
                          {opt.label}
                        </div>
                        <div className="text-[14px] text-black/50 group-hover:text-black/60 break-keep leading-snug transition-colors">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. 로딩 (분석 중) 섹션 */}
            {isCalculating && (
              <motion.div
                key="calculating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full flex flex-col items-center justify-center py-12"
              >
                <div className="relative w-16 h-16 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-black/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#21c1a2] border-t-transparent animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B0F0E] mb-3">응답 정리 중…</h3>
                <p className="text-black/50 font-medium text-center break-keep">
                  응답해주신 내용을 바탕으로<br />가장 효율적인 채널 구조를 설계하고 있습니다.
                </p>
              </motion.div>
            )}

            {/* 3. 결과 리포트 섹션 */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="border-b border-black/10 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h3 className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#0B0F0E] mb-1">맞춤형 진단 리포트</h3>
                    <p className="text-[12px] font-bold text-black/40 tracking-[0.15em] font-mono">TURNKEYHAUS DIAGNOSTIC RESULT</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[11px] font-bold text-[#21c1a2] tracking-widest uppercase mb-1">진단 일자</p>
                    <p className="text-[15px] font-mono font-bold text-black/80">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-[#21c1a2]/10 text-[#21c1a2] text-[12px] font-bold tracking-widest rounded mb-3">추천 운영 레벨</span>
                    <h4 className="text-[30px] md:text-[34px] font-bold text-[#0B0F0E] tracking-tight mb-3 leading-[1.2]">
                      {result?.level}
                    </h4>
                    <p className="text-[15px] text-black/60 font-medium leading-[1.7] break-keep">
                      {result?.target}
                    </p>
                  </div>
                  
                  <div className="bg-[#FAFAFA] border border-black/5 p-6 rounded-2xl text-left md:text-right shadow-sm">
                    <p className="text-[12px] font-bold text-black/50 mb-2">월 예상 투자 예산</p>
                    <p className="text-[36px] md:text-[42px] font-bold text-[#21c1a2] tracking-tight leading-none">
                      <span className="text-[20px] text-black/30 mr-1 font-medium">₩</span>{result?.price}
                    </p>
                    <p className="text-[12px] font-medium text-black/40 mt-3">* VAT 별도 / 월 단위 계약 기준</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h5 className="text-[14px] font-bold text-[#0B0F0E] mb-4">패키지 세부 구성</h5>
                  <div className="bg-[#FAFAFA] border border-black/5 rounded-2xl p-5 md:p-6 space-y-4">
                    {result?.details.map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        {/* 체크마크 아이콘 */}
                        <svg className="w-5 h-5 text-[#21c1a2] mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[15px] font-medium text-black/80 leading-[1.6] break-keep">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#21c1a2]/30 bg-[#21c1a2]/5 rounded-xl p-5 mb-8 text-center md:text-left">
                  <p className="text-[13px] text-black/70 font-medium leading-[1.7] break-keep">
                    * 본 리포트는 자가 진단용 예상 견적입니다. 정확한 방향성과 비용은 대면 구조 진단을 통해 채널의 고유 강점을 분석한 후 최종 확정됩니다.
                  </p>
                </div>

                {/* 하단 버튼을 2개로 분리하여 선택지 제공 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => { setStep(0); setAnswers({}); }}
                    className="flex-1 py-4 rounded-xl border border-black/10 text-[15px] font-bold text-black/60 hover:bg-black/5 transition-colors"
                  >
                    다시 진단하기
                  </button>
                  <a 
                    href="https://pf.kakao.com/_dyNPn/chat" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-[2] flex items-center justify-center bg-[#0B0F0E] text-white text-[16px] font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all shadow-md group"
                  >
                    이 레벨로 정밀 견적 요청하기
                    <span className="ml-2 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all">→</span>
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
