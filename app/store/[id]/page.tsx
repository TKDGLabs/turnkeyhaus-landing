"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type StoreProduct = {
  id: string;
  type: "SINGLE" | "SUBSCRIPTION";
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
};

// 화면 깜빡임 방지 기본 데이터
const FULL_PRODUCTS: StoreProduct[] = [
  { id: "tier-ebook", type: "SINGLE", name: "브랜드 유튜브 구축 전자책", summary: "유튜브를 처음 시작하는 전문직/기업 필수 가이드\n문의가 들어오는 채널 세팅의 3가지 핵심 원칙", price: 0, delivery_info: "결제(0원) 즉시 마이페이지 다운로드 제공" },
  { id: "tier-report", type: "SINGLE", name: "운영 진단 리포트 (1회성)", summary: "현재 채널 및 경쟁 채널 3곳 정밀 분석\n검색 유입을 위한 주제 20개 추출 및 검증\n즉시 적용 가능한 썸네일/제목 교정 가이드", price: 490000, delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송" },
  { id: "tier-planner", type: "SINGLE", name: "90일 채널 전략 플래너 (특가)", summary: "단기 성과를 위한 3개월 채널 로드맵 기획\n시즌 이슈 및 검색량 기반 핵심 키워드 매칭\n기존 업로드 영상 구조 피드백 및 코칭", price: 297000, delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅" },
  { id: "tier-basic", type: "SUBSCRIPTION", name: "유튜브 운영대행 [베이직]", summary: "콘텐츠 기획 및 연출 (6편)\n롱폼 편집 10분 이내 (2편)\n숏폼 신규/재편집 (12편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 3800000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" },
  { id: "tier-standard", type: "SUBSCRIPTION", name: "유튜브 운영대행 [스탠다드]", summary: "콘텐츠 기획 및 연출 (7편)\n롱폼 편집 10분 이내 (3편)\n숏폼 신규/재편집 (16편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 4400000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" },
  { id: "tier-premium", type: "SUBSCRIPTION", name: "유튜브 운영대행 [프리미엄]", summary: "콘텐츠 기획 및 연출 (12편)\n롱폼 편집 10분 이내 (4편)\n숏폼 신규/재편집 (28편)\n현장 촬영 2회차 (PD 2인/3CAM)", price: 5000000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" }
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const productId = params.id;

  const [product, setProduct] = useState<StoreProduct | null>(
    FULL_PRODUCTS.find(p => p.id === productId) || null
  );

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("store_products").select("*").eq("id", productId).maybeSingle();
        if (!error && data && isMounted) setProduct(data as StoreProduct);
      } catch (err) {
        console.error(err);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [supabase, productId]);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold text-[#0B0F0E]">상품을 찾을 수 없습니다.</h1>
      <button onClick={() => router.push('/store')} className="text-[#21c1a2] font-bold hover:underline">스토어 목록으로 돌아가기</button>
    </div>
  );

  const isSub = product.type === "SUBSCRIPTION";
  const isFree = product.price === 0;
  const bulletPoints = product.summary.split('\n').filter(text => text.trim() !== '');

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <nav className="mb-8 text-[13px] font-bold text-black/40 flex items-center gap-2">
        <Link href="/store" className="hover:text-[#21c1a2] transition-colors">Store</Link>
        <span>&gt;</span>
        <span className="text-[#0B0F0E]">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
        <section className="space-y-12">
          <div className="space-y-4 border-b border-black/10 pb-10">
            <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase ${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#E6F8F5] text-[#169B82]"}`}>
              {isSub ? "MONTHLY OPS PLAN" : isFree ? "FREE ASSET" : "SINGLE PROJECT"}
            </span>
            <h1 className="text-[32px] md:text-[42px] font-bold tracking-tight leading-[1.2] text-[#0B0F0E] break-keep">
              {product.name}
            </h1>
            <p className="text-[16px] md:text-[18px] text-black/60 font-medium leading-[1.7] break-keep max-w-[50ch]">
              브랜드의 성장을 위한 최적의 채널 운영 솔루션. 전문 기획자와 PD가 하나의 전담 팀으로 배정됩니다.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-[22px] font-bold text-[#0B0F0E]">상세 제공 내역</h3>
            
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-black/5 space-y-4">
              <ul className="space-y-4">
                {bulletPoints.map((bullet, i) => {
                  const parts = bullet.split('(');
                  const title = parts[0];
                  const amount = parts.length > 1 ? `(${parts[1]}` : "";
                  
                  return (
                    <li key={i} className="flex justify-between items-center pb-4 border-b border-black/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSub ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"}`}/>
                        <span className="text-[15px] font-bold text-black/80">{title.trim()}</span>
                      </div>
                      {amount && <span className={`text-[14px] font-bold px-3 py-1 rounded-full ${isSub ? "bg-black/10 text-black" : "bg-[#E6F8F5] text-[#21c1a2]"}`}>{amount}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 🚨 오프라인 계약서의 독소조항 방어 논리를 온라인 운영 정책으로 승화시켰습니다. */}
            <div className="space-y-6 pt-6 border-t border-black/10">
              <h3 className="text-[20px] font-bold text-[#0B0F0E]">서비스 운영 및 계약 상세 규정</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-5 border border-black/10 rounded-xl space-y-2">
                  <h4 className="text-[14px] font-bold text-[#0B0F0E] flex items-center gap-2">
                    <span className="text-[#21c1a2]">01</span> 피드백 및 수정 정책
                  </h4>
                  <p className="text-[13px] text-black/60 leading-relaxed break-keep">
                    업로드 전 기준 <strong className="text-black">총 3회의 수정(자막, 화면 일부 조정)</strong>이 제공되며, 기존 기획을 벗어나는 재편집은 불가합니다. 검수 요청 후 <strong className="text-black">5영업일 내 무응답 시 자동 승인</strong>으로 간주됩니다.
                  </p>
                </div>
                
                <div className="p-5 border border-black/10 rounded-xl space-y-2">
                  <h4 className="text-[14px] font-bold text-[#0B0F0E] flex items-center gap-2">
                    <span className="text-[#21c1a2]">02</span> 저작권 및 원본 귀속
                  </h4>
                  <p className="text-[13px] text-black/60 leading-relaxed break-keep">
                    최종 산출물(영상) 및 채널 소유권은 고객사에 귀속되나, 영상 제작에 사용된 <strong className="text-black">촬영 원본 파일 및 프로젝트 파일의 소유권은 턴키하우스에 귀속</strong>되며 별도 제공되지 않습니다.
                  </p>
                </div>

                <div className="p-5 border border-black/10 rounded-xl space-y-2">
                  <h4 className="text-[14px] font-bold text-[#0B0F0E] flex items-center gap-2">
                    <span className="text-[#21c1a2]">03</span> 성과 보장 면책
                  </h4>
                  <p className="text-[13px] text-black/60 leading-relaxed break-keep">
                    본 서비스는 브랜드 인지도 제고 및 고관여 고객 설득을 위한 채널 운영대행으로, 비정상적 방법을 통한 <strong className="text-black">조회수, 구독자 수, 단기 매출 등의 정량적 성과를 맹목적으로 보장하지 않습니다.</strong>
                  </p>
                </div>

                <div className="p-5 border border-black/10 rounded-xl space-y-2 bg-[#FFF5F5] border-[#FEB2B2]">
                  <h4 className="text-[14px] font-bold text-[#C53030] flex items-center gap-2">
                    <span>04</span> 위약금 및 해지 규정
                  </h4>
                  <p className="text-[13px] text-[#742A2A] leading-relaxed break-keep">
                    정기구독의 경우 전담팀 배정 문제로 <strong className="text-[#C53030]">최소 3개월(또는 계약상 의무 횟수) 유지</strong>가 필수입니다. 기간 내 해지 시 <strong className="text-[#C53030]">1개월분의 결제대금이 위약금으로 청구</strong>됩니다.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        <aside className="lg:sticky lg:top-32 w-full">
          <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-xl shadow-black/[0.03]">
            <p className="text-[13px] font-bold text-black/40 mb-2 uppercase tracking-widest">초기 결제 금액</p>
            <div className="flex items-end gap-2 mb-8 border-b border-black/10 pb-6">
              <span className="text-[36px] font-bold tracking-tight text-[#0B0F0E] leading-none">
                {isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}
              </span>
              {!isFree && <span className="text-[14px] font-semibold text-black/40 mb-1.5">(VAT 포함)</span>}
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <p className="text-[12px] font-bold text-black/40 mb-1">서비스 제공 및 정산</p>
                <p className="text-[14px] font-bold text-[#0B0F0E] break-keep">{product.delivery_info}</p>
              </div>
            </div>

            <button 
              onClick={() => router.push('/store')}
              className={`w-full h-14 rounded-xl ${isSub ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"} text-[16px] font-bold ${isSub ? "text-white" : "text-[#07211d]"} transition-transform hover:scale-[1.02] shadow-md ${focusRing}`}
            >
              {isFree ? "무료로 다운로드 받기" : "약관 확인 및 결제하러 가기"}
            </button>
            <p className="text-center text-[12px] text-black/40 font-medium mt-4">
              안전한 거래를 위해 회원가입 및 약관 동의가 필요합니다.
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
