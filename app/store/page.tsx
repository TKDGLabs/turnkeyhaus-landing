"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useEffect, useState, useRef, useMemo } from "react";
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
  image_url?: string;
  sort_order?: number;
};

// 화면 번쩍임 방지용 기본값 (DB 로딩 전 잠깐 보임)
const FALLBACK_PRODUCTS: StoreProduct[] = [
  { id: "tier-report", type: "SINGLE", name: "운영 진단 리포트", summary: "로딩중...", price: 490000, delivery_info: "로딩중" }
];

export default function StorePage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPenalty, setAgreedToPenalty] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId),
    [products, selectedProductId]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // 1. Supabase에서 방금 넣은 4개 상품 실시간으로 불러오기!
        const { data: productData, error: productError } = await supabase
          .from("store_products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!productError && productData && productData.length > 0 && isMounted) {
          setProducts(productData as StoreProduct[]);
          setSelectedProductId(productData[0].id); // 첫 번째 상품 자동 선택
        }

        if (isMounted) setLoading(false);

        // 2. 유저 정보 불러오기
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
        console.error("데이터 로딩 중 에러 발생:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { isMounted = false; };
  }, [supabase]);

  // 상품이 바뀔 때마다 동의 체크박스 초기화
  useEffect(() => {
    setAgreedToTerms(false);
    setAgreedToPenalty(false);
  }, [selectedProductId]);

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    if (!authUser) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedProduct) return setError("상품을 선택해 주세요.");
    if (!customerName.trim() || !customerPhone.trim()) return setError("이름과 전화번호를 입력해 주세요.");
    if (!agreedToTerms) return setError("무형 서비스 환불 규정에 동의해 주세요.");
    
    if (selectedProduct.type === "SUBSCRIPTION" && !agreedToPenalty) {
      return setError("정기구독 중도 해지 및 위약금 청구 규정에 동의하셔야 결제가 가능합니다.");
    }

    setLoading(true);
    try {
      if (selectedProduct.price === 0) {
        alert("0원 상품(전자책) 다운로드 완료. 마이페이지를 확인해주세요.");
      } else if (selectedProduct.type === "SUBSCRIPTION") {
        alert(`${selectedProduct.name} 월 정기결제 모듈 호출 대기중`);
      } else {
        alert(`${selectedProduct.name} 단건 결제 모듈 호출 대기중`);
      }
    } catch (e) {
      setError("결제 진행 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
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
          단건 리포트/플래너 결제부터 월간 채널 운영대행 정기구독까지 턴키하우스의 모든 서비스를 안전하게 결제하실 수 있습니다.
        </p>
        {authUser ? (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-black/58 pt-2">
            <span className="border border-black/12 bg-black/[0.02] px-2.5 py-1.5 rounded font-medium">{authUser.email} (계정 인증됨)</span>
            <button type="button" onClick={handleSignOut} className={`h-8 border border-black/15 px-3 rounded text-[12px] font-semibold text-black/65 transition-colors hover:bg-black/[0.03] ${focusRing}`}>로그아웃</button>
          </div>
        ) : (
          <div className="text-[13px] text-black/40 font-medium pt-2">로그인하지 않은 상태입니다. 상품 조회가 가능하며 결제 시 회원가입 팝업이 표출됩니다.</div>
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
                className={`w-full text-left transition-all duration-300 ${focusRing} ${
                  active 
                    ? `ring-2 ${isSub ? "ring-[#0B0F0E]" : "ring-[#21c1a2]"} bg-[#FAFAFA] rounded-2xl p-6 md:p-8 shadow-sm` 
                    : "border border-black/10 hover:border-[#21c1a2]/40 bg-white hover:bg-[#FAFAFA]/50 p-6 md:p-8 rounded-2xl"
                }`}
              >
                <div 
                  className="grid gap-4 md:gap-6 sm:grid-cols-[160px_1fr] cursor-pointer"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <div>
                    <p className={`text-[11px] md:text-[12px] font-bold tracking-widest mb-1.5 uppercase ${isSub ? "text-[#0B0F0E]" : "text-[#21c1a2]"}`}>
                      {isSub ? "MONTHLY PLAN" : isFree ? "FREE ASSET" : "SINGLE PAYMENT"}
                    </p>
                    <p className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0B0F0E]">
                      {isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}
                    </p>
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-black/45 mt-1">{isSub ? "월 정기결제 / VAT 포함" : "VAT 포함"}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <h3 className="text-[20px] md:text-[22px] font-bold tracking-tight text-[#0B0F0E]">{product.name}</h3>
                      {active && (
                        <span className={`${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#21c1a2] text-[#07211d]"} text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap`}>
                          선택됨
                        </span>
                      )}
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
                      
                      {/* 🚨 각 상품의 상세페이지로 넘어가는 버튼 추가! */}
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

        <aside className="border border-black/10 bg-white p-6 md:p-8 rounded-2xl shadow-sm h-fit lg:sticky lg:top-28">
          <h2 className="text-[22px] font-bold tracking-tight">결제 정보 입력</h2>
          
          <form className="mt-6 space-y-6" onSubmit={handleProcessPayment}>
            {selectedProduct && selectedProduct.price > 0 && (
              <div className="space-y-2">
                <p className="text-[13px] font-bold tracking-[0.06em] text-black/58 uppercase">결제수단</p>
                <div className="flex flex-wrap gap-2">
                  {PAY_METHOD_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPayMethod(option.value)}
                      className={`inline-flex h-10 items-center rounded-lg border px-4 text-[14px] font-bold transition-colors ${focusRing} ${
                        payMethod === option.value
                          ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]"
                          : "border-black/15 text-black/65 hover:bg-black/5"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[12px] font-bold text-black/50">담당자명*</span>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required={!!authUser} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[12px] font-bold text-black/50">전화번호*</span>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required={!!authUser} placeholder="010-1234-5678" className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[12px] font-bold text-black/50">이메일 (결제 내역 수신용)</span>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
            </label>

            <AnimatePresence>
              {selectedProduct?.type === "SUBSCRIPTION" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#FFF5F5] border border-[#FEB2B2] border-l-4 border-l-[#E53E3E] p-5 rounded-lg overflow-hidden space-y-3"
                >
                  <h4 className="text-[14px] font-bold text-[#C53030]">🚨 정기구독 의무 약정 및 해지 규정</h4>
                  <p className="text-[13px] text-[#742A2A] leading-relaxed font-medium break-keep">
                    유튜브 운영대행 플랜은 전담 인력 배치의 특성상 <strong>최소 3개월의 의무 유지 기간</strong>이 적용됩니다. 3개월 이내 중도 해지 시 잔여 월에 대한 해지 위약금이 발생하며, <strong>해당 위약금의 결제가 완료되어야만 시스템상 구독 해지가 승인</strong>됩니다.
                  </p>
                  <label className="flex items-start gap-2 pt-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      checked={agreedToPenalty}
                      onChange={(e) => setAgreedToPenalty(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#E53E3E] border-gray-300 rounded focus:ring-[#E53E3E]"
                    />
                    <span className="text-[13px] font-bold text-[#C53030]">네, 위약금 및 해지 제한 규정을 확인하였으며 이에 동의합니다. (필수)</span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="flex items-start gap-3 p-4 bg-[#FAFAFA] border border-black/5 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                required={!!authUser}
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#21c1a2] border-gray-300 rounded focus:ring-[#21c1a2]"
              />
              <div className="text-[13px] leading-relaxed text-black/70 font-medium">
                <p>무형 서비스 특성상 작업 착수 또는 리포트 전송 이후에는 환불이 불가함을 확인했습니다. (필수)</p>
              </div>
            </label>

            {error && (
              <p className="text-[13px] font-bold text-red-500 text-center animate-pulse">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !selectedProduct}
                className={`inline-flex h-14 w-full items-center justify-center rounded-xl ${selectedProduct?.type === "SUBSCRIPTION" ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"} text-[16px] font-bold ${selectedProduct?.type === "SUBSCRIPTION" ? "text-white" : "text-[#07211d]"} transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${focusRing}`}
              >
                {loading ? "처리 중..." : selectedProduct ? `${selectedProduct.price === 0 ? "무료 다운로드 받기" : `${selectedProduct.price.toLocaleString("ko-KR")}원 결제하기`}` : "상품을 선택해주세요"}
              </button>
            </div>
          </form>
        </aside>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-7 rounded-2xl max-w-sm w-full mx-5 border border-black/10 shadow-2xl text-center space-y-4"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-500 text-xl font-bold">!</div>
              <h3 className="text-[18px] font-bold text-[#0B0F0E]">결제 전 안내</h3>
              <p className="text-[14px] text-black/60 leading-relaxed break-keep">
                결제는 회원가입 후 가능합니다. 계정을 생성하고 상담 기록과 정산 내역을 한눈에 관리해 보세요.
              </p>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 h-11 border border-black/15 rounded-xl text-[14px] font-semibold text-black/55 transition-colors hover:bg-black/[0.03]"
                >
                  돌아가기
                </button>
                <Link
                  href="/auth?next=/store&mode=signup"
                  className="flex-1 h-11 bg-[#21c1a2] text-[#07211d] rounded-xl text-[14px] font-bold flex items-center justify-center transition-colors hover:bg-[#1db197]"
                >
                  회원가입 하기
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
