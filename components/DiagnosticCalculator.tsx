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

    // 점수 로직 검증 완료: 프리미엄 요소가 많으면 프리미엄, 중간이면 스탠다드
    if (score >= 3) return packageData.premium;
    if (score === 1 || score === 2) return packageData.standard;
    return packageData.basic;
  };

  const result = step >= questions.length ? getRecommendation() : null;

  return (
    <section className="py-24 bg-white border-y border-black/10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
        
        {/* 헤더 영역 */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base">
            [ 운영 레벨 진단 ]
          </div>
          <h2 className="whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px]">
            유튜브는 건별 제작이 아니라<br />운영 단위로 설계됩니다.
          </h2>
          {/* 특정 직업군 명
