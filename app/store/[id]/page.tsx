"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type ProductType = "SINGLE" | "SUBSCRIPTION";

type StoreProduct = {
  id: string;
  type: ProductType;
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
};

// 🚨 DB 오류 방지용 기본(Fallback) 데이터
const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "tier-ebook",
    type: "SINGLE",
    name: "브랜드 유튜브 구축 전자책",
    summary: "유튜브를 처음 시작하는 전문직/기업을 위한 필수 가이드\n문의가 들어오는 채널 세팅의 3가지 핵심 원칙",
    price: 0,
    delivery_info: "결제(0원) 즉시 마이페이지 다운로드 제공"
  },
  {
    id: "tier-report",
    type: "SINGLE",
    name: "운영 진단 리포트 (1회성)",
    summary: "현재 채널 및 경쟁 채널 3곳 정밀 분석\n검색 유입을 위한 주제 20개 추출 및 검증\n즉시 적용 가능한 썸네일/제목 교정 가이드",
    price: 490000,
    delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송"
  },
  {
    id: "tier-planner",
    type: "SINGLE",
    name: "90일 채널 전략 플래너 (특가)",
    summary: "단기 성과를 위한 3개월 채널 로드맵 기획\n시즌 이슈 및 검색량 기반 핵심 키워드 매칭\n기존 업로드 영상 구조 피드백 및 코칭",
    price: 297000,
    delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅"
  },
  {
    id: "tier-subscription",
    type: "SUBSCRIPTION",
    name: "유튜브 채널 운영대행 플랜 (정기구독)",
    summary: "매월 영상 기획, 대본/질문지 작성, 촬영 현장 디렉팅\n편집, 썸네일 디자인, 채널 업로드 및 세팅 전담\n월간 데이터 성과 리포트 및 익월 개선안 도출",
    price: 3800000,
    delivery_info: "매월 지정 결제일 자동 과금 (전담 Ops 팀 배치)"
  }
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const productId = params.id;

  const [product, setProduct] = useState<StoreProduct | null>(
    STORE_PRODUCTS.find(p => p.id === productId) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("store_products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (!error && data && isMounted) {
          setProduct(data as StoreProduct);
        }
      } catch (err) {
        console.error("상품 상세 로딩 에러:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();
    return () => { isMounted = false; };
  }, [supabase, productId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-black/50">상품 정보를 불러오는 중입니다...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B0F0E]">상품을 찾을 수 없습니다.</h1>
        <button onClick={() => router.push('/store')} className="text-[#21c1a2] font-bold hover:underline">스토어 목록으로 돌아가기</button>
      </div>
    );
  }

  const isSub = product.type === "SUBSCRIPTION";
  const isFree = product.price === 0;
  const bullets = product.summary.split('\n').filter(text => text.trim() !== '');

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      
      {/* 빵판(Breadcrumb) 네비게이션 */}
      <nav className="mb-8 text-[13px] font-bold text-black/40 flex items-center gap-2">
        <Link href="/store" className="hover:text-[#21c1a2] transition-colors">스토어 홈</Link>
        <span>&gt;</span>
        <span className="text-[#0B0F0E]">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
        
        {/* 왼쪽: 상품 상세 설명 영역 */}
        <section className="space-y-12">
          {/* 상품 타이틀 헤더 */}
          <div className="space-y-4 border-b border-black/10 pb-10">
            <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase ${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#E6F8F5] text-[#169B82]"}`}>
              {isSub ? "MONTHLY PLAN" : isFree ? "FREE ASSET" : "SINGLE PAYMENT"}
            </span>
            <h1 className="text-[32px] md:text-[42px] font-bold tracking-tight leading-[1.2] text-[#0B0F0E] break-keep">
              {product.name}
            </h1>
            <p className="text-[16px] md:text-[18px] text-black/60 font-medium leading-[1.7] break-keep">
              턴키하우스의 검증된 프로세스를 통해 성공적인 채널 자산을 구축하세요.
            </p>
          </div>

          {/* 상품 상세 설명 본문 (여기에 나중에 이미지나 긴 글을 추가하시면 됩니다) */}
          <div className="space-y-8">
            <h3 className="text-[22px] font-bold text-[#0B0F0E]">상품 세부 정보</h3>
            
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-black/5 space-y-4">
              <h4 className="text-[16px] font-bold text-[#21c1a2]">주요 제공 내역</h4>
              <ul className="space-y-3">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 items-start text-[15px] font-medium text-black/80">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0B0F0E] shrink-0"/>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-[16px] font-bold text-[#0B0F0E]">안내 사항</h4>
              <p className="text-[15px] leading-[1.8] text-black/60 font-medium break-keep">
                모든 서비스는 결제 완료 후 전담 매니저가 배정되어 순차적으로 연락을 드립니다.
                무형 서비스(리포트, 컨설팅, 운영대행)의 특성상 작업이 착수된 이후에는 환불이 불가하오니 결제 전 이 점을 반드시 유의해 주시기 바랍니다.
              </p>
            </div>
            
            {/* 정기구독 위약금 안내 박스 */}
            {isSub && (
              <div className="bg-[#FFF5F5] border border-[#FEB2B2] border-l-4 border-l-[#E53E3E] p-6 rounded-xl space-y-3 mt-8">
                <h4 className="text-[15px] font-bold text-[#C53030]">🚨 정기구독 의무 유지 및 위약금 안내</h4>
                <p className="text-[14px] text-[#742A2A] leading-relaxed font-medium break-keep">
                  채널 운영대행 플랜은 초기 기획 및 전담 인력 세팅에 큰 비용이 투입되므로 <strong>최소 3개월의 의무 유지 기간</strong>이 발생합니다. 중도 해지 시 잔여 월에 해당하는 위약금이 발생하며, 결제 완료 전까지 해지가 승인되지 않습니다.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 오른쪽: 스티키(Sticky) 결제 요약 카드 */}
        <aside className="lg:sticky lg:top-32 w-full">
          <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-xl shadow-black/[0.03]">
            <p className="text-[13px] font-bold text-black/40 mb-2 uppercase tracking-widest">결제 금액</p>
            <div className="flex items-end gap-2 mb-8 border-b border-black/10 pb-6">
              <span className="text-[36px] font-bold tracking-tight text-[#0B0F0E] leading-none">
                {isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}
              </span>
              {!isFree && <span className="text-[14px] font-semibold text-black/40 mb-1.5">{isSub ? "/ 월 (VAT 포함)" : "(VAT 포함)"}</span>}
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <p className="text-[12px] font-bold text-black/40 mb-1">제공 방식</p>
                <p className="text-[14px] font-bold text-[#0B0F0E] break-keep">{product.delivery_info}</p>
              </div>
            </div>

            {/* 메인 결제 페이지로 돌아가면서, 현재 상품이 선택되어 있도록 유도할 수 있습니다. 
                (현재 로직상으로는 스토어 홈으로 이동 후 직접 결제하는 방식) */}
            <button 
              onClick={() => router.push('/store')}
              className={`w-full h-14 rounded-xl ${isSub ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"} text-[16px] font-bold ${isSub ? "text-white" : "text-[#07211d]"} transition-transform hover:scale-[1.02] shadow-md ${focusRing}`}
            >
              {isFree ? "무료로 받기" : "결제 페이지로 이동하기"}
            </button>
            
            <p className="text-center text-[12px] text-black/40 font-medium mt-4">
              결제 시 회원가입 및 약관 동의가 필요합니다.
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
