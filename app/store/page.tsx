"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

const PAY_METHOD_OPTIONS = [
  { value: "CARD", label: "카드 결제" },
  { value: "TRANSFER", label: "계좌이체" }
] as const;

type PayMethod = (typeof PAY_METHOD_OPTIONS)[number]["value"];

type StoreProduct = {
  id: string;
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
};

type KakaoPostcodeAddressData = { zonecode: string; address: string; roadAddress: string; jibunAddress: string; userSelectedType: "R" | "J"; bname: string; buildingName: string; apartment: "Y" | "N"; };

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
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");

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
    async function loadInitialData() {
      if (!supabase) return;

      const { data: productData, error: productError } = await supabase
        .from("store_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (productData && productData.length > 0) {
        setProducts(productData);
        setSelectedProductId(productData[0].id);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthUser(user);
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (profile) {
          setCustomerName(`${profile.first_name || ""} ${profile.last_name || ""}`.trim());
          setCompanyName(profile.company_name || "");
          setCustomerPhone(profile.phone_number || "");
          setBusinessRegistrationNumber(profile.business_registration_number || "");
        }
        setCustomerEmail(user.email || "");
      }
      setLoading(false);
    }
    
    loadInitialData();
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

    if (!selectedProduct) return setError("상품을 선택해 주세요.");
    if (!customerName.trim() || !customerPhone.trim()) return setError("이름과 전화번호를 입력해 주세요.");
    if (!agreedToTerms) return setError("환불 규정 및 서비스 제공 방식에 동의해 주세요.");

    setLoading(true);
    try {
      alert(`${selectedProduct.name} 결제 모듈 오픈 예정 (PG 연동 필요)`);
    } catch (e) {
      setError("결제 진행 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
      </div>

      <div className="grid gap-8 md:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          {products.length === 0 && !loading && (
            <p className="border p-5 text-black/60">현재 신청 가능한 상품이 없습니다.</p>
          )}
          {products.map((product) => {
            const active = selectedProductId === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                className={`w-full rounded-2xl border px-6 py-6 text-left transition-all ${focusRing} ${
                  active ? "border-[#21c1a2] bg-[#ecfbf7] shadow-sm" : "border-black/10 bg-white hover:border-[#21c1a2]/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[20px] font-bold tracking-tight text-[#0B0F0E]">{product.name}</p>
                    <p className="mt-1 text-[15px] leading-[1.7] text-black/65">{product.summary}</p>
                  </div>
                  {active && <span className="bg-[#21c1a2] text-black text-[11px] font-bold px-2 py-1 rounded">선택됨</span>}
                </div>
                
                <div className="mt-4 p-3 bg-white/60 rounded-lg border border-black/5 text-[13px] text-black/60">
                  <span className="font-bold text-[#21c1a2] mr-2">✓ 제공 방식:</span> {product.delivery_info}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4">
                  <p className="text-[24px] font-bold tracking-tight text-[#0B0F0E]">
                    {product.price.toLocaleString("ko-KR")}원
                  </p>
                  <p className="text-[12px] font-semibold tracking-[0.08em] text-black/45">VAT 포함</p>
                </div>
              </button>
            );
          })}
        </section>

        <aside className="border border-black/10 bg-white p-6 md:p-8 rounded-2xl shadow-sm h-fit sticky top-28">
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
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[12px] font-bold text-black/50">전화번호*</span>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required placeholder="010-1234-5678" className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[12px] font-bold text-black/50">이메일 (결제 내역 수신용)</span>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
            </label>

            <label className="flex items-start gap-3 mt-6 p-4 bg-[#FAFAFA] border border-black/5 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                required 
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
                disabled={loading || !selectedProduct}
                className={`inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#0B0F0E] text-[16px] font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${focusRing}`}
              >
                {loading ? "불러오는 중..." : `${selectedProduct?.price.toLocaleString("ko-KR")}원 결제하기`}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
