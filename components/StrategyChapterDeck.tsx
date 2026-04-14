"use client";

import Image from "next/image";
import { useState } from "react";
import { content } from "../content";

type ChapterItem = {
  chapter: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
  points: string[];
  accent: string;
};

const chapters: ChapterItem[] = [
  {
    chapter: "CHAPTER 1",
    title: "기존 채널 상태 분석 (AS-IS)",
    summary: "현재 채널에서 전환 역할이 빠진 지점을 먼저 찾습니다.",
    image: "/images/diagnosis.png",
    alt: "기존 채널 상태 분석 화면",
    points: [
      "소통 부재와 내원 전환 동력 저하 구간 점검",
      "채널 첫인상에서 전문성 전달 여부 확인",
      "아카이빙형 채널에서 전환형 채널로 구조 전환"
    ],
    accent: "전환 역할"
  },
  {
    chapter: "CHAPTER 2",
    title: "'가이드'가 아닌 '경험과 공감'",
    summary: "고객이 실제로 던지는 질문으로 콘텐츠 문장을 다시 씁니다.",
    image: "/images/positioning.png",
    alt: "경험과 공감 중심 포지셔닝 화면",
    points: [
      "현장 질문을 기준으로 후킹 문장 재정의",
      "정보 나열형 문장을 설득형 흐름으로 교체",
      "브랜드 고유의 화법을 유지하면서 이해 가능한 표현으로 변환"
    ],
    accent: "찐 경험과 찐 공감"
  },
  {
    chapter: "CHAPTER 3",
    title: "채널 리브랜딩 가이드",
    summary: "SEO와 소통 흐름을 동시에 반영해 채널 골격을 재설계합니다.",
    image: "/images/organization.png",
    alt: "채널 리브랜딩 가이드 화면",
    points: [
      "채널명·설명·재생목록의 키워드 정렬",
      "썸네일/제목 문법 통일로 클릭률 안정화",
      "댓글·커뮤니티를 전환 전 단계로 연결"
    ],
    accent: "소통 중심"
  },
  {
    chapter: "CHAPTER 5",
    title: "업로드 패턴 설계 (Calendar)",
    summary: "롱폼·숏폼 스케줄을 분리해 검색 노출을 누적합니다.",
    image: "/images/operation.png",
    alt: "업로드 패턴 설계 캘린더 화면",
    points: [
      "주간 포맷 배치로 운영 피로도 분산",
      "재편집 쇼츠 슬롯으로 노출 빈도 확보",
      "월간 리포트 데이터로 다음 달 캘린더 재보정"
    ],
    accent: "검색 노출량 극대화"
  }
];

export default function StrategyChapterDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = chapters[activeIndex];

  return (
    <div className="mt-12 space-y-6">
      <div
        className="flex gap-2 overflow-x-auto pb-1 md:hidden"
        role="tablist"
        aria-label="전략 챕터 모바일 탭"
      >
        {chapters.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`mobile-${item.chapter}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`chapter-panel-${index}`}
              id={`chapter-tab-mobile-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-[#21c1a2] bg-[#21c1a2]/10"
                  : "border-black/10 bg-white hover:border-black/25 hover:bg-black/[0.02]"
              }`}
            >
              <p className="text-[10px] font-semibold tracking-[0.12em] text-black/45">{item.chapter}</p>
              <p className="mt-0.5 text-[13px] font-semibold leading-[1.35] text-[#0B0F0E]">{item.title}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch">
        <div
          className="hidden gap-2 border border-black/10 bg-white p-2 md:grid"
          role="tablist"
          aria-label="전략 챕터 미리보기"
        >
          {chapters.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.chapter}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`chapter-panel-${index}`}
                id={`chapter-tab-${index}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`w-full border px-4 py-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2] ${
                  isActive
                    ? "border-[#21c1a2] bg-[#21c1a2]/10"
                    : "border-black/10 bg-white hover:border-black/25 hover:bg-black/[0.02]"
                }`}
            >
              <p className="text-[11px] font-semibold tracking-[0.12em] text-black/45">{item.chapter}</p>
              <h3 className="mt-1 text-[20px] font-semibold leading-[1.3] tracking-tight text-[#0B0F0E]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.7] text-black/65 xl:block">{item.summary}</p>
            </button>
          );
        })}
      </div>

        <div
          id={`chapter-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`chapter-tab-${activeIndex}`}
          className="relative overflow-hidden border border-black/10 bg-white"
        >
          <div className="border-b border-black/10 bg-white px-4 py-3 md:hidden">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-black/45">
              {active.chapter} · {activeIndex + 1}/{chapters.length}
            </p>
            <h3 className="mt-1 text-[20px] font-semibold leading-[1.3] tracking-tight text-[#0B0F0E]">
              {active.title}
            </h3>
            <p className="mt-1 text-[14px] leading-[1.65] text-black/66">{active.summary}</p>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-black/10 bg-black/[0.03]">
            {chapters.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.image}
                  className={`absolute inset-0 transition-all duration-500 ${
                    isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[1.02]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-4 p-5 md:p-6">
            <p className="inline-flex bg-[#D8FF1B] px-2 py-1 text-sm font-semibold text-[#0B0F0E]">
              {active.accent}
            </p>
            <ul className="space-y-2 text-sm leading-[1.8] text-black/72 md:text-base">
              {active.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>

            <p className="border-t border-black/10 pt-3 text-sm font-medium leading-[1.7] text-black/65">
              {content.strategyFrame.steps[activeIndex]?.title ?? "운영 단계"}: {content.strategyFrame.steps[activeIndex]?.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
