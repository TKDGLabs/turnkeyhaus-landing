"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type StoreProduct = {
  id: string;
  type: "SINGLE" | "SUBSCRIPTION";
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
};

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
              브랜드의 성장을 위한 최적의 채널 운영 솔루션. 전담 기획자와 PD가 하나의 팀으로 배정됩니다.
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

            <div className="space-y-4 pt-4 border-t border-black/10">
              <h4 className="text-[16px] font-bold text-[#0B0F0E]">계약 및 결제 안내</h4>
              <p className="text-[15px] leading-[1.8] text-black/60 font-medium break-keep">
                본 페이지에서의 결제는 안전하게 진행됩니다. 결제 확인 후 1영업일 이내에 전담 매니저가 배정되어 킥오프 미팅 및 세부 일정을 조율합니다.
                {isSub && " 정기구독 상품의 경우 첫 달 착수금 결제 후, 익월부터는 법인 세금계산서 청구 또는 전용 결제 링크를 통해 별도 과금됩니다."}
              </p>
            </div>
            
            {isSub && (
              <div className="bg-[#FFF5F5] border border-[#FEB2B2] border-l-4 border-l-[#E53E3E] p-6 rounded-xl space-y-3 mt-8">
                <h4 className="text-[15px] font-bold text-[#C53030]">🚨 의무 유지 기간 및 위약금 안내</h4>
                <p className="text-[14px] text-[#742A2A] leading-relaxed font-medium break-keep">
                  채널 운영대행 플랜은 초기 채널 분석 및 전담 인력 고정 배치를 위해 <strong>최소 3개월의 의무 유지 기간</strong>이 적용됩니다. 중도 해지 시 위약금이 발생할 수 있습니다.
                </p>
              </div>
            )}
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
              {isFree ? "무료로 다운로드 받기" : "결제 페이지로 돌아가기"}
            </button>
            <p className="text-center text-[12px] text-black/40 font-medium mt-4">안전한 거래를 위해 약관 동의가 필요합니다.</p>
          </div>
        </aside>

      </div>
    </main>
  );
}
