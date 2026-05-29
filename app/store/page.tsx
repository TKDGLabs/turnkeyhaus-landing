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
  { value: "CARD", label: "카드 결제" },
  { value: "TRANSFER", label: "계좌이체" }
] as const;

type PayMethod = (typeof PAY_METHOD_OPTIONS)[number]["value"];

// 상품 데이터 타입
type StoreProduct = {
  id: string;
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
  image_url?: string;
  sort_order?: number;
};

// 🚨 무적의 폴백(Fallback) 데이터: DB가 터져도 무조건 화면에 띄워줄 기본 상품들
const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "tier-1",
    name: "운영 진단 리포트 (1회성)",
    summary: "현재 채널·경쟁 채널 3개 분석\n주제 20개와 검증 운영표 제안\n썸네일/제목 개선안",
    price: 490000,
    delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송",
    sort_order: 1
  },
  {
    id: "tier-2",
    name: "3개월 채널 운영 전략 플랜",
    summary: "3개월 채널 로드맵 기획\n주제 및 핵심 키워드 추출\n기존 업로드 영상 피드백",
    price: 297000,
    delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅 제공",
    sort_order: 2
  },
  {
    id: "tier-3",
    name: "제작 포함 1개월 검증 운영 (착수금)",
    summary: "월간 기획과 1회차 촬영 운영\n긴 영상/쇼츠 일정 편성\n썸네일 및 초기 업로드 세팅",
    price: 2500000,
    delivery_info: "결제 후 1개월 내 촬영 및 편집본 이메일/클라우드 전송",
    sort_order: 3
  }
];

type KakaoPostcodeAddressData = { zonecode: string; address: string; roadAddress: string; jibunAddress: string; userSelectedType: "R" | "J"; bname: string; buildingName: string; apartment: "Y" | "N"; };

declare global {
  interface Window {
    kakao?: { Postcode?: any; };
  }
}

function composeSelectedAddress(data: KakaoPostcodeAddressData) {
  const mainAddress = data.userSelectedType === "R" ? data.roadAddress || data.address : data.jibunAddress || data.address;
  if (data.userSelectedType !== "R") return mainAddress;
  let extraAddress = "";
  if (data.bname && /[동로가]$/.test(data.bname)) extraAddress = data.bname;
  if (data.buildingName && data.apartment === "Y") extraAddress = extraAddress ? `${extraAddress}, ${data.buildingName}` : data.buildingName;
  return extraAddress ? `${mainAddress} (${extraAddress})` : mainAddress;
}

export default function StorePage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // 🚨 화면이 빈칸으로 시작하지 않게 기본 상품(STORE_PRODUCTS)을 채워두고 시작합니다!
  const [products, setProducts] = useState<StoreProduct[]>(STORE_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(STORE_PRODUCTS[0].id);
  
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postcodeLoaded, setPostcodeLoaded] = useState(false);
  const detailAddressInputRef = useRef<HTMLInputElement>(null);
  
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
        // 1. Supabase에서 데이터 불러오기 시도
        const { data: productData, error: productError } = await supabase
          .from("store_products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        // 🚨 Supabase에 정상적인 데이터가 있을 때만 덮어씌웁니다. 없으면 기본 상품(STORE_PRODUCTS) 유지!
        if (!productError && productData && productData.length > 0 && isMounted) {
          setProducts(productData);
          setSelectedProductId(productData[0].id);
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

  function handleOpenPostcodePopup() {
    setError(null);
    const Postcode = window.kakao?.Postcode;
    if (!Postcode) return;

    new Postcode({
      oncomplete: (data: any) => {
        setZipcode(data.zonecode || "");
        setAddressLine1(composeSelectedAddress(data) || "");
        detailAddressInputRef.current?.focus();
      }
    }).open();
  }

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
    if (!agreedToTerms) return setError("환불 규정 및 서비스 제공 방식에 동의해 주세요.");

    setLoading(true);
    try {
      alert(`${selectedProduct.name} 결제 모듈 연동 대기중 (PG)`);
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
      <Script src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" onLoad={() => setPostcodeLoaded(true)} />

      <div className="mb-10 space-y-4 border-b border-black/10 pb-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 운영 플랜 신청 ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">운영 플랜 신청 및 결제</h1>
        <p className="max-w-[72ch] break-keep text-[16px] leading-[1.8] text-black/68">
          턴키하우스의 월간 운영은 상담 후 계약서 기반으로 진행됩니다. 이 페이지에서는 진단 리포트와 전략 플랜, 착수금 등 초기 세팅 비용만 안전하게 결제하실 수 있습니다.
        </p>
        {authUser ? (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-black/58 pt-2">
            <span className="border border-black/12 bg-black/[0.02] px-2.5 py-1.5 rounded">{authUser.email} (로그인됨)</span>
            <button type="button" onClick={handleSignOut} className={`h-8 border border-black/15 px-3 rounded text-[12px] font-semibold text-black/65 transition-colors hover:bg-black/[0.03] ${focusRing}`}>로그아웃</button>
          </div>
        ) : (
          <div className="text-[13px] text-black/40 font-medium pt-2">로그인하지 않은 상태입니다. 상품 조회가 가능하며 결제 시 회원가입 팝업이 표출됩니다.</div>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {products.map((product, index) => {
            const active = selectedProductId === product.id;
            const optionLabel = `OPTION ${(index + 1).toString().padStart(2, '0')}`;
            
            // 엔터(\n) 기준으로 체크리스트 분리
            const bullets = product.summary.split('\n').filter(text => text.trim() !== '');

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                className={`w-full text-left transition-all duration-300 ${focusRing} ${
                  active 
                    ? "ring-2 ring-[#21c1a2] bg-[#FAFAFA] rounded-2xl p-6 md:p-8 shadow-sm" 
                    : "border border-black/10 hover:border-[#21c1a2]/40 bg-white hover:bg-[#FAFAFA]/50 p-6 md:p-8 rounded-2xl"
                }`}
              >
                <div className="grid gap-4 md:gap-6 sm:grid-cols-[150px_1fr]">
                  <div>
                    <p className="text-[11px] md:text-[12px] font-bold tracking-widest text-[#21c1a2] mb-1.5 uppercase">{optionLabel}</p>
                    <p className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0B0F0E]">
                      {product.price.toLocaleString("ko-KR")}원
                    </p>
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-black/45 mt-1">VAT 포함</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <h3 className="text-[20px] md:text-[22px] font-bold tracking-tight text-[#0B0F0E]">{product.name}</h3>
                      {active && <span className="bg-[#21c1a2] text-[#07211d] text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap">선택됨</span>}
                    </div>
                    
                    <ul className="grid gap-2.5 text-[13px] md:text-[14px] font-medium text-black/70 mb-6">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-black/30 shrink-0"/>
                          <span className="text-left break-keep">{bullet.trim()}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="inline-block p-3 bg-white border border-black/10 rounded-lg text-[12px] text-black/60 w-full sm:w-auto">
                      <span className="font-bold text-black mr-2">제공 방식:</span> {product.delivery_info}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <aside className="border border-black/10 bg-white p-6 md:p-8 rounded-2xl shadow-sm h-fit lg:sticky lg:top-28">
          <h2 className="text-[22px] font-bold tracking-tight">결제 정보 입력</h2>
          
          <form className="mt-6 space-y-5" onSubmit={handleProcessPayment}>
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

            <label className="flex items-start gap-3 mt-6 p-4 bg-[#FAFAFA] border border-black/5 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                required={!!authUser}
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#21c1a2] border-gray-300 rounded focus:ring-[#21c1a2]"
              />
              <div className="text-[13px] leading-relaxed text-black/70 font-medium">
                <p>무형 서비스 특성상 작업 착수 또는 리포트 전송 이후에는 환불이 불가함을 확인했습니다. (필수)</p>
                <Link href="/refund" target="_blank" className="text-[#21c1a2] font-bold hover:underline inline-block mt-1">환불 규정 전문 보기</Link>
              </div>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (!selectedProduct && products.length > 0)}
                className={`inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#0B0F0E] text-[16px] font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${focusRing}`}
              >
                {loading ? "불러오는 중..." : selectedProduct ? `${selectedProduct.price.toLocaleString("ko-KR")}원 결제하기` : "상품을 선택해주세요"}
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
