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

// 첨부해주신 PDF 견적서 기반 실제 데이터 연동
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
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
        
        {/* 헤더 영역: 톤앤매너 완벽 동기화 */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base">
            [ 운영 레벨 진단 ]
          </div>
          <h2 className="whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px]">
            유튜브는 건별 제작이 아니라<br />운영 단위로 설계됩니다.
          </h2>
          <p className="mx-auto max-w-[60ch] text-base leading-[1.95] text-black/72 md:text-lg">
            원장님의 목표와 예산에 맞는 질문에 답해주시면, 최적의 월간 패키지와 세부 견적을 산출해 드립니다.
          </p>
        </div>

        {/* 계산기 영역: 클린 화이트 테마 적용 */}
        <div className="bg-white rounded-[40px] border border-black/10 p-6 md:p-16 min-h-[500px] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full justify-center max-w-2xl mx-auto"
              >
                {/* 진행률 바 (민트색) */}
                <div className="w-full bg-zinc-100 h-2 mb-12 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[#21c1a2] h-full" 
                    initial={{ width: `${(step / questions.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-extrabold mb-12 text-center text-[#0B0F0E] leading-[1.4] break-keep">
                  {questions[step].title}
                </h3>
                
                <div className="grid gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className="w-full p-6 text-left border border-black/10 rounded-2xl hover:bg-zinc-50 hover:border-[#21c1a2] transition-all text-lg font-semibold text-black/80 group flex items-center shadow-sm hover:shadow-md"
                    >
                      <span className="w-6 h-6 rounded-full border-2 border-black/10 group-hover:border-[#21c1a2] flex items-center justify-center mr-4 transition-colors">
                        <span className="w-3 h-3 rounded-full bg-[#21c1a2] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* 결과 리포트 화면: PDF 견적서 연동, 깔끔한 문서 스타일 */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full w-full max-w-4xl mx-auto"
              >
                <div className="border-b-2 border-black pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0B0F0E] mb-2 uppercase">Quotation</h3>
                    <p className="text-sm font-bold text-black/40 tracking-[0.2em] font-mono">TURNKEYHAUS CHANNEL STRATEGY</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[11px] font-bold text-[#21c1a2] tracking-widest uppercase mb-1">Issue Date</p>
                    <p className="text-base font-mono font-bold text-black/80">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
                  <div>
                    <span className="inline-block px-3 py-1 bg-black/5 text-black/60 text-[11px] font-bold tracking-widest rounded-lg mb-4 uppercase">Recommended Level</span>
                    <h4 className="text-4xl font-extrabold text-[#0B0F0E] tracking-tight mb-4">
                      {result?.level}
                    </h4>
                    <p className="text-base text-black/70 font-medium leading-relaxed break-keep">
                      {result?.target}
                    </p>
                  </div>
                  
                  <div className="bg-[#FBFBFB] border border-black/5 p-8 rounded-3xl">
                    <p className="text-[12px] font-bold text-black/40 tracking-widest uppercase mb-2">Estimated Monthly Budget</p>
                    <p className="text-4xl md:text-5xl font-black text-[#21c1a2] tracking-tighter">
                      <span className="text-2xl text-black/30 mr-1 font-semibold">₩</span>{result?.price}
                    </p>
                    <p className="text-xs font-semibold text-black/40 mt-3">* VAT 별도 / 월 단위 계약 기준</p>
                  </div>
                </div>

                {/* 상세 항목 리스트 (표 형태) */}
                <div className="mb-12">
                  <h5 className="text-[13px] font-bold text-black/60 tracking-widest uppercase mb-6 border-l-4 border-[#21c1a2] pl-3">Package Details</h5>
                  <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
                    {result?.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border-b border-black/5 last:border-0 hover:bg-zinc-50 transition-colors">
                        <span className="text-[15px] font-bold text-black/80">{item.label}</span>
                        <span className="text-[15px] font-bold text-[#21c1a2] bg-[#21c1a2]/10 px-3 py-1 rounded-full">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA 버튼 */}
                <a 
                  href="https://pf.kakao.com/_dyNPn/chat" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group relative flex items-center justify-center bg-[#0B0F0E] text-white text-lg font-bold py-5 rounded-2xl hover:bg-zinc-800 transition-all shadow-[0_10px_20px_rgba(11,15,14,0.15)] w-full max-w-sm mx-auto"
                >
                  이 레벨로 정밀 견적 요청하기
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
