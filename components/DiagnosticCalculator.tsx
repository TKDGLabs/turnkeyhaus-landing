'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 'frequency',
    title: 'Q1. 한 달에 촬영에 할애할 수 있는 시간은 어느 정도인가요?',
    options: [
      { label: '월 1회 (하루 날을 잡아 반나절 몰아서 촬영)', value: '1' },
      { label: '월 2회 이상 (여유로운 일정으로 분할 촬영)', value: '2' },
    ]
  },
  {
    id: 'format',
    title: 'Q2. 어떤 형태의 영상이 주력이길 원하시나요?',
    options: [
      { label: '전문적인 정보 전달 위주의 롱폼 (가로 영상)', value: 'long' },
      { label: '빠른 확산과 노출을 위한 숏폼 (세로 영상)', value: 'short' },
      { label: '롱폼과 숏폼의 균형 있는 병행', value: 'mixed' },
    ]
  },
  {
    id: 'volume',
    title: 'Q3. 희망하는 월간 영상 업로드 빈도는 어떻게 되나요?',
    options: [
      { label: '기본적인 채널 유지보수 (월 2편 내외)', value: 'basic' },
      { label: '꾸준한 성장 곡선 형성 (월 3~4편 내외)', value: 'standard' },
      { label: '공격적인 트래픽 및 DB 확보 (월 4편 이상)', value: 'premium' },
    ]
  }
];

const packageData = {
  basic: {
    level: 'Basic Package',
    price: '3,800,000',
    target: '유튜브 브랜딩의 기초를 다지고 효율적으로 운영하고 싶은 분께 추천합니다.',
    details: [
      { label: '촬영 (PD 2인, 3CAM)', value: '월 1회' },
      { label: '콘텐츠 기획 및 연출', value: '6편' },
      { label: '롱폼 편집 (10분 이내)', value: '2편' },
      { label: '쇼츠 편집 (재편집)', value: '8편' },
      { label: '숏폼 편집 (신규 촬영)', value: '4편' },
      { label: '썸네일 디자인', value: '2편' }
    ]
  },
  standard: {
    level: 'Standard Package',
    price: '4,400,000',
    target: '꾸준한 콘텐츠 업로드로 안정적인 채널 성장을 원하시는 분께 추천합니다.',
    details: [
      { label: '촬영 (PD 2인, 3CAM)', value: '월 1회' },
      { label: '콘텐츠 기획 및 연출', value: '7편' },
      { label: '롱폼 편집 (10분 이내)', value: '3편' },
      { label: '쇼츠 편집 (재편집)', value: '12편' },
      { label: '숏폼 편집 (신규 촬영)', value: '4편' },
      { label: '썸네일 디자인', value: '3편' }
    ]
  },
  premium: {
    level: 'Premium Package',
    price: '5,000,000',
    target: '공격적인 트래픽 확보와 하이엔드 퀄리티 브랜딩이 필요한 분께 추천합니다.',
    details: [
      { label: '촬영 (PD 2인, 3CAM)', value: '월 2회' },
      { label: '콘텐츠 기획 및 연출', value: '12편' },
      { label: '롱폼 편집 (10분 이내)', value: '4편' },
      { label: '쇼츠 편집 (재편집)', value: '20편' },
      { label: '숏폼 편집 (신규 촬영)', value: '8편' },
      { label: '썸네일 디자인', value: '4편' }
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
    let score = 0;
    if (answers.frequency === '2') score += 2;
    if (answers.volume === 'premium') score += 2;
    if (answers.volume === 'standard') score += 1;

    if (score >= 3) return packageData.premium;
    if (score === 1 || score === 2) return packageData.standard;
    return packageData.basic;
  };

  const result = step >= questions.length ? getRecommendation() : null;

  return (
    <section className="py-24 bg-white border-y border-black/10">
      <div className="mx-auto max-w-[900px] px-5 sm:px-6">
        
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[13px] font-bold tracking-[0.1em] text-black/40">
            [ 운영 레벨 진단 ]
          </div>
          <h2 className="whitespace-pre-line text-[32px] font-bold leading-[1.3] tracking-tight text-[#0B0F0E] md:text-[42px]">
            유튜브는 건별 제작이 아니라<br />운영 단위로 설계됩니다.
          </h2>
          <p className="mx-auto max-w-[55ch] text-[16px] leading-[1.8] text-black/60 md:text-[17px]">
            원하시는 채널의 목표와 예산에 맞는 질문에 답해주시면, 최적의 월간 패키지와 세부 견적을 산출해 드립니다.
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-black/10 p-8 md:p-12 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.04)] min-h-[420px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <div className="w-full bg-zinc-100 h-1.5 mb-10 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[#21c1a2] h-full" 
                    initial={{ width: `${(step / questions.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
                
                <h3 className="text-[22px] md:text-[26px] font-bold mb-8 text-center text-[#0B0F0E] leading-[1.5] break-keep">
                  {questions[step].title}
                </h3>
                
                <div className="grid gap-3 md:gap-4 max-w-2xl mx-auto">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="w-full p-5 md:p-6 text-left border border-black/10 rounded-2xl hover:bg-[#FAFAFA] hover:border-[#21c1a2] transition-all text-[16px] md:text-[17px] font-medium text-black/80 leading-[1.6] group flex items-start shadow-sm"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full border-2 border-black/15 group-hover:border-[#21c1a2] flex items-center justify-center mr-4 mt-0.5 transition-colors">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#21c1a2] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span className="break-keep">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="border-b border-black/10 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h3 className="text-[28px] md:text-[34px] font-bold tracking-tight text-[#0B0F0E] mb-1">Quotation</h3>
                    <p className="text-[12px] font-bold text-black/40 tracking-[0.15em] font-mono">TURNKEYHAUS CHANNEL STRATEGY</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[11px] font-bold text-[#21c1a2] tracking-widest uppercase mb-1">Issue Date</p>
                    <p className="text-[15px] font-mono font-bold text-black/80">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-black/5 text-black/60 text-[11px] font-bold tracking-widest rounded mb-3 uppercase">Recommended</span>
                    <h4 className="text-[32px] md:text-[38px] font-bold text-[#0B0F0E] tracking-tight mb-3 leading-none">
                      {result?.level}
                    </h4>
                    <p className="text-[15px] text-black/60 font-medium leading-[1.7] break-keep">
                      {result?.target}
                    </p>
                  </div>
                  
                  <div className="bg-[#FAFAFA] border border-black/5 p-6 rounded-2xl text-left md:text-right">
                    <p className="text-[11px] font-bold text-black/40 tracking-widest uppercase mb-2">Estimated Monthly Budget</p>
                    <p className="text-[36px] md:text-[42px] font-bold text-[#21c1a2] tracking-tight leading-none">
                      <span className="text-[20px] text-black/30 mr-1 font-medium">₩</span>{result?.price}
                    </p>
                    <p className="text-[12px] font-medium text-black/40 mt-3">* VAT 별도 / 월 단위 계약 기준</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h5 className="text-[12px] font-bold text-black/50 tracking-widest uppercase mb-5 border-l-[3px] border-[#21c1a2] pl-3 leading-none">Package Details</h5>
                  <div className="border-t border-black/10">
                    {result?.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-4 border-b border-black/5">
                        <span className="text-[15px] font-medium text-black/80">{item.label}</span>
                        <span className="text-[14px] font-bold text-[#0B0F0E] bg-black/5 px-3 py-1 rounded-md">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FAFAFA] rounded-xl p-5 mb-8">
                  <p className="text-[13px] text-black/50 font-medium leading-[1.7] break-keep">
                    * 본 리포트는 입력하신 자가 진단 데이터를 기반으로 산출된 권장 레벨입니다. 턴키하우스 전문 PD팀과의 대면 정밀 진단을 통해 해당 채널의 고유한 강점과 시장 분석을 거쳐 최종 제안서가 확정됩니다.
                  </p>
                </div>

                <a 
                  href="https://pf.kakao.com/_dyNPn/chat" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group flex items-center justify-center bg-[#0B0F0E] text-white text-[16px] font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors w-full"
                >
                  이 레벨로 정밀 견적 요청하기
                  <span className="ml-2 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all">→</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
