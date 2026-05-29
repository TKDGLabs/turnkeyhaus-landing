"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

const PAY_METHOD_OPTIONS = [
  { value: "CARD", label: "신용/체크카드" },
  { value: "TRANSFER", label: "실시간 계좌이체" }
] as const;

type PayMethod = (typeof PAY_METHOD_OPTIONS)[number]["value"];
type ProductType = "SINGLE" | "SUBSCRIPTION";

type StoreProduct = {
  id: string;
  type: ProductType;
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
  sort_order?: number;
};

// 🚨 0초 로딩의 마법: 대표님의 6개 상품 전체 라인업을 기본 상태로 박아둡니다.
const FULL_PRODUCTS: StoreProduct[] = [
  { id: "tier-ebook", type: "SINGLE", name: "브랜드 유튜브 구축 전자책", summary: "유튜브를 처음 시작하는 전문직/기업 필수 가이드\n문의가 들어오는 채널 세팅의 3가지 핵심 원칙", price: 0, delivery_info: "결제(0원) 즉시 마이페이지 다운로드 제공" },
  { id: "tier-report", type: "SINGLE", name: "운영 진단 리포트 (1회성)", summary: "현재 채널 및 경쟁 채널 3곳 정밀 분석\n검색 유입을 위한 주제 20개 추출 및 검증\n즉시 적용 가능한 썸네일/제목 교정 가이드", price: 490000, delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송" },
  { id: "tier-planner", type: "SINGLE", name: "90일 채널 전략 플래너 (특가)", summary: "단기 성과를 위한 3개월 채널 로드맵 기획\n시즌 이슈 및 검색량 기반 핵심 키워드 매칭\n기존 업로드 영상 구조 피드백 및 코칭", price: 297000, delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅" },
  { id: "tier-basic", type: "SUBSCRIPTION", name: "유튜브 운영대행 [베이직]", summary: "콘텐츠 기획 및 연출 (6편)\n롱폼 편집 10분 이내 (2편)\n숏폼 신규/재편집 (12편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 3800000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" },
  { id: "tier-standard", type: "SUBSCRIPTION", name: "유튜브 운영대행 [스탠다드]", summary: "콘텐츠 기획 및 연출 (7편)\n롱폼 편집 10분 이내 (3편)\n숏폼 신규/재편집 (16편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 4400000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" },
  { id: "tier-premium", type: "SUBSCRIPTION", name: "유튜브 운영대행 [프리미엄]", summary: "콘텐츠 기획 및 연출 (12편)\n롱폼 편집 10분 이내 (4편)\n숏폼 신규/재편집 (28편)\n현장 촬영 2회차 (PD 2인/3CAM)", price: 5000000, delivery_info: "첫 달 착수금 결제 (익월부터 세금계산서 청구)" }
];

export default function StorePage() {
  const router = useRouter();
  
  // 🚨 무한 루프 에러 해결: useMemo를 사용해 통로(client)를 한 번만 만듭니다!
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // 기본값을 FULL_PRODUCTS로 설정해 로딩 지연을 0으로 만듭니다.
  const [products, setProducts] = useState<StoreProduct[]>(FULL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(FULL_PRODUCTS[1].id);
  
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPenalty, setAgreedToPenalty] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
  const [processLoading, setProcessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId),
    [products, selectedProductId]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadBackgroundData() {
      if (!supabase) return;
      try {
        // 백그라운드 DB 업데이트
        const { data, error: dbError } = await supabase.from("store_products").select("*").eq("is_active", true).order("sort_order", { ascending: true });
        if (!dbError && data && data.length > 0 && isMounted) {
          setProducts(data as StoreProduct[]);
        }

        // 유저 정보 체크
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isMounted) {
          setAuthUser(user);
          setCustomerEmail(user.email || "");
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
          if (profile && isMounted) {
            setCustomerName(`${profile.first_name || ""} ${profile.last_name || ""}`.trim());
            setCustomerPhone(profile.phone_number || "");
          }
        }
      } catch (err) {
        console.error("백그라운드 로딩 에러:", err);
      }
    }
    
    loadBackgroundData();
    return () => { isMounted = false; };
  }, [supabase]);

  useEffect(() => {
    setAgreedToTerms(false);
    setAgreedToPenalty(false);
  }, [selectedProductId]);

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processLoading) return;
    setError(null);

    if (!authUser) return setShowAuthModal(true);
    if (!selectedProduct) return setError("상품을 선택해 주세요.");
    if (!customerName.trim() || !customerPhone.trim()) return setError("이름과 전화번호를 입력해 주세요.");
    if (!agreedToTerms) return setError("무형 서비스 환불 규정에 동의해 주세요.");
    if (selectedProduct.type === "SUBSCRIPTION" && !agreedToPenalty) {
      return setError("정기구독 위약금 규정에 동의하셔야 결제가 가능합니다.");
    }

    setProcessLoading(true);
    try {
      if (selectedProduct.price === 0) alert("0원 상품 결제 완료.");
      else alert(`${selectedProduct.name} 결제 모듈 호출 대기중`);
    } catch (e) {
      setError("결제 진행 중 문제가 발생했습니다.");
    } finally {
      setProcessLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthUser(null);
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <div className="mb-10 space-y-4 border-b border-black/10 pb-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#21c1a2] uppercase">[ Store & Plan ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">서비스 및 플랜 결제</h1>
        <p className="max-w-[72ch] break-keep text-[16px] leading-[1.8] text-black/68">
          단건 리포트/플래너 결제부터 월간 채널 운영대행 정기구독까지 모든 서비스를 안전하게 결제하실 수 있습니다.
        </p>
        {authUser ? (
          <div className="flex items-center gap-2 text-[13px] pt-2">
            <span className="bg-black/5 px-2.5 py-1.5 rounded">{authUser.email}</span>
            <button onClick={handleSignOut} className={`h-8 border border-black/15 px-3 rounded text-[12px] font-semibold text-black/65 hover:bg-black/5 ${focusRing}`}>로그아웃</button>
          </div>
        ) : (
          <div className="text-[13px] text-black/40 font-medium pt-2">로그인하지 않은 상태입니다. 결제 시 가입 팝업이 표출됩니다.</div>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {products.map((product) => {
            const active = selectedProductId === product.id;
            const isSub = product.type === "SUBSCRIPTION";
            const isFree = product.price === 0;
            const bullets = product.summary.split('\n').filter(text => text.trim() !== '');

            return (
              <div 
                key={product.id}
                className={`w-full text-left transition-all duration-300 cursor-pointer ${focusRing} ${
                  active 
                    ? `ring-2 ${isSub ? "ring-[#0B0F0E]" : "ring-[#21c1a2]"} bg-[#FAFAFA] rounded-2xl p-6 md:p-8 shadow-sm` 
                    : "border border-black/10 hover:border-[#21c1a2]/40 bg-white hover:bg-[#FAFAFA]/50 p-6 md:p-8 rounded-2xl"
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="grid gap-4 md:gap-6 sm:grid-cols-[160px_1fr]">
                  <div>
                    <p className={`text-[11px] md:text-[12px] font-bold tracking-widest mb-1.5 uppercase ${isSub ? "text-[#0B0F0E]" : "text-[#21c1a2]"}`}>
                      {isSub ? "MONTHLY PLAN" : isFree ? "FREE ASSET" : "SINGLE PAYMENT"}
                    </p>
                    <p className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0B0F0E]">
                      {isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}
                    </p>
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-black/45 mt-1">{isSub ? "착수금 / VAT 포함" : "VAT 포함"}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <h3 className="text-[20px] md:text-[22px] font-bold tracking-tight text-[#0B0F0E]">{product.name}</h3>
                      {active && <span className={`${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#21c1a2] text-[#07211d]"} text-[11px] font-bold px-2.5 py-1 rounded`}>선택됨</span>}
                    </div>
                    
                    <ul className="grid gap-2.5 text-[13px] md:text-[14px] font-medium text-black/70 mb-5">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isSub ? "bg-[#0B0F0E]" : "bg-black/30"}`}/>
                          <span className="text-left break-keep">{bullet.trim()}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <div className="inline-block p-3 bg-white border border-black/10 rounded-lg text-[12px] text-black/60">
                        <span className="font-bold text-black mr-2">제공 방식:</span> {product.delivery_info}
                      </div>
                      <Link 
                        href={`/store/${product.id}`}
                        className={`inline-flex items-center text-[13px] font-bold border-b border-transparent hover:border-[#21c1a2] transition-colors ${isSub ? "text-[#0B0F0E]" : "text-[#21c1a2]"}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        상세 내용 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="lg:sticky lg:top-32 w-full h-fit">
          <div className="bg-white border border-black/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-[22px] font-bold tracking-tight">결제 정보 입력</h2>
            <form className="mt-6 space-y-6" onSubmit={handleProcessPayment}>
              {selectedProduct && selectedProduct.price > 0 && (
                <div className="space-y-2">
                  <p className="text-[13px] font-bold tracking-[0.06em] text-black/58 uppercase">결제수단</p>
                  <div className="flex flex-wrap gap-2">
                    {PAY_METHOD_OPTIONS.map((option) => (
                      <button key={option.value} type="button" onClick={() => setPayMethod(option.
