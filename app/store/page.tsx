"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { STORE_PRODUCTS, StoreProductId } from "@/lib/store-products";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

const PAY_METHOD_OPTIONS = [
  { value: "CARD", label: "카드" },
  { value: "TRANSFER", label: "계좌이체" },
  { value: "MOBILE", label: "휴대폰 소액결제" },
  { value: "GIFT_CERTIFICATE", label: "상품권" },
  { value: "EASY_PAY", label: "간편결제" }
] as const;

type PayMethod = (typeof PAY_METHOD_OPTIONS)[number]["value"];

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  role: string | null;
  business_registration_number: string | null;
};

type KakaoPostcodeAddressData = {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: "R" | "J";
  bname: string;
  buildingName: string;
  apartment: "Y" | "N";
};

type KakaoPostcodeOptions = {
  oncomplete: (data: KakaoPostcodeAddressData) => void;
  onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
  animation?: boolean;
  focusInput?: boolean;
  autoMapping?: boolean;
  hideMapBtn?: boolean;
  hideEngBtn?: boolean;
};

type KakaoPostcodeOpenOptions = {
  q?: string;
  popupTitle?: string;
  popupKey?: string;
  autoClose?: boolean;
};

type KakaoPostcodeInstance = {
  open: (options?: KakaoPostcodeOpenOptions) => void;
};

type KakaoPostcodeConstructor = new (options: KakaoPostcodeOptions) => KakaoPostcodeInstance;

declare global {
  interface Window {
    kakao?: {
      Postcode?: KakaoPostcodeConstructor;
    };
  }
}

function sanitizeDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function buildCustomerId({
  phone,
  businessNumber,
  email
}: {
  phone: string;
  businessNumber: string;
  email: string;
}) {
  const businessDigits = sanitizeDigits(businessNumber);
  if (businessDigits) return `biz-${businessDigits}`.slice(0, 20);

  const phoneDigits = sanitizeDigits(phone);
  if (phoneDigits) return `hp-${phoneDigits.slice(-11)}`.slice(0, 20);

  const emailSlug = email.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (emailSlug) return `em-${emailSlug.slice(0, 16)}`.slice(0, 20);

  return `guest-${Date.now().toString().slice(-8)}`;
}

function composeSelectedAddress(data: KakaoPostcodeAddressData) {
  const mainAddress =
    data.userSelectedType === "R"
      ? data.roadAddress || data.address
      : data.jibunAddress || data.address;

  if (data.userSelectedType !== "R") {
    return mainAddress;
  }

  let extraAddress = "";

  if (data.bname && /[동로가]$/.test(data.bname)) {
    extraAddress = data.bname;
  }

  if (data.buildingName && data.apartment === "Y") {
    extraAddress = extraAddress
      ? `${extraAddress}, ${data.buildingName}`
      : data.buildingName;
  }

  return extraAddress ? `${mainAddress} (${extraAddress})` : mainAddress;
}

function getMetadataString(user: User | null, key: string) {
  if (!user) return "";
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value : "";
}

export default function StorePage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [selectedProductId, setSelectedProductId] = useState<StoreProductId>("tier-1");
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");

  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerRole, setCustomerRole] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postcodeLoaded, setPostcodeLoaded] = useState(false);
  const detailAddressInputRef = useRef<HTMLInputElement>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const selectedProduct = useMemo(
    () => STORE_PRODUCTS.find((item) => item.id === selectedProductId),
    [selectedProductId]
  );

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (!supabase) {
        if (mounted) {
          setAuthReady(true);
        }
        return;
      }

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (authError) {
        console.warn("Failed to check Supabase session.", authError);
        setAuthReady(true);
        return;
      }

      if (!user) {
        setAuthReady(true);
        return;
      }

      setAuthUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name,company_name,phone_number,role,business_registration_number")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      const firstName = profile?.first_name || getMetadataString(user, "first_name");
      const lastName = profile?.last_name || getMetadataString(user, "last_name");
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

      setCustomerName((prev) => prev || fullName);
      setCustomerEmail((prev) => prev || user.email || "");
      setCompanyName((prev) => prev || profile?.company_name || getMetadataString(user, "company_name"));
      setCustomerPhone((prev) => prev || profile?.phone_number || getMetadataString(user, "phone_number"));
      setCustomerRole((prev) => prev || profile?.role || getMetadataString(user, "role"));
      setBusinessRegistrationNumber(
        (prev) => prev || profile?.business_registration_number || getMetadataString(user, "business_registration_number")
      );

      setAuthReady(true);
    }

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/auth");
    router.refresh();
  }

  function handleOpenPostcodePopup() {
    setError(null);

    const Postcode = window.kakao?.Postcode;
    if (!Postcode) {
      setError("주소 검색 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    new Postcode({
      animation: true,
      hideMapBtn: true,
      oncomplete: (data) => {
        const selectedAddress = composeSelectedAddress(data);
        setZipcode(data.zonecode || "");
        setAddressLine1(selectedAddress || "");

        window.requestAnimationFrame(() => {
          detailAddressInputRef.current?.focus();
        });
      }
    }).open({
      popupKey: "turnkeyhaus-postcode",
      popupTitle: "우편번호 검색"
    });
  }

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    if (!selectedProduct) {
      setError("선택된 상품 정보를 찾을 수 없습니다.");
      return;
    }

    if (!customerName.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }

    const phoneDigits = sanitizeDigits(customerPhone);
    if (phoneDigits.length < 9) {
      setError("전화번호를 정확히 입력해 주세요.");
      return;
    }

    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
    const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();
    if (!storeId || !channelKey) {
      setError("결제창 설정을 확인 중입니다. 바로 결제가 필요하시면 카카오톡 또는 전화 상담으로 요청해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const paymentId = `tkdh-${selectedProduct.id}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const redirectUrl = `${window.location.origin}/store/result`;
      const normalizedBizNo = sanitizeDigits(businessRegistrationNumber);
      const normalizedEmail = customerEmail.trim() || authUser?.email || "";
      const customerId = buildCustomerId({
        phone: customerPhone,
        businessNumber: businessRegistrationNumber,
        email: normalizedEmail
      });
      const address = addressLine1.trim()
        ? {
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim() || "-"
          }
        : undefined;

      sessionStorage.setItem(
        "turnkeyhaus:last-payment",
        JSON.stringify({
          paymentId,
          productId: selectedProduct.id,
          amount: selectedProduct.price,
          productName: selectedProduct.name,
          payMethod,
          companyName: companyName.trim(),
          customerName: customerName.trim(),
          customerPhone: phoneDigits,
          customerEmail: normalizedEmail,
          customerRole: customerRole.trim(),
          zipcode: zipcode.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          businessRegistrationNumber: normalizedBizNo
        })
      );

      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName: selectedProduct.name,
        totalAmount: selectedProduct.price,
        currency: "KRW",
        payMethod,
        customer: {
          customerId,
          fullName: customerName.trim(),
          phoneNumber: phoneDigits,
          email: normalizedEmail || undefined,
          address,
          zipcode: zipcode.trim() || undefined
        },
        products: [
          {
            id: selectedProduct.id,
            name: selectedProduct.name,
            amount: selectedProduct.price,
            quantity: 1,
            code: selectedProduct.galaxiaItemCode
          }
        ],
        storeDetails: {
          businessName: companyName.trim() || undefined,
          businessRegistrationNumber: normalizedBizNo || undefined,
          address: [addressLine1.trim(), addressLine2.trim()].filter(Boolean).join(" ") || undefined,
          zipcode: zipcode.trim() || undefined,
          contactName: customerRole.trim() || undefined,
          phoneNumber: phoneDigits,
          email: normalizedEmail || undefined
        },
        customData: {
          userId: authUser?.id ?? null,
          loginEmail: authUser?.email || normalizedEmail || null,
          companyName: companyName.trim() || null,
          customerRole: customerRole.trim() || null,
          businessRegistrationNumber: normalizedBizNo || null,
          requestedCashReceipt: Boolean(normalizedBizNo),
          address: {
            zipcode: zipcode.trim() || null,
            addressLine1: addressLine1.trim() || null,
            addressLine2: addressLine2.trim() || null
          }
        },
        bypass: {
          galaxia: {
            ITEM_CODE: selectedProduct.galaxiaItemCode
          }
        },
        // SDK 타입 정의 상 필수로 잡히는 필드(실제 카드 결제에서는 미사용)
        alipayPlus: {},
        redirectUrl,
        forceRedirect: true
      });

      if (response?.code !== undefined) {
        setError(response.message ?? "결제 요청 중 오류가 발생했습니다.");
        return;
      }

      if (response?.paymentId) {
        window.location.href = `/store/result?paymentId=${encodeURIComponent(response.paymentId)}`;
      }
    } catch (requestError) {
      console.error(requestError);
      setError("결제 진행 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <Script
        src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={() => setPostcodeLoaded(true)}
      />

      <div className="mb-10 space-y-4 border-b border-black/10 pb-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 서비스 결제 ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">결제 정보 입력</h1>
        <p className="max-w-[72ch] break-keep text-[16px] leading-[1.8] text-black/68">
          결제하실 상품을 선택하고 담당자 정보를 입력해 주세요. 입력하신 정보는 결제 확인, 세금계산서 또는 현금영수증 발급 확인,
          후속 상담 안내에 사용됩니다.
        </p>
        {authUser ? (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-black/58">
            <span className="border border-black/12 bg-black/[0.02] px-2.5 py-1">{authUser.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className={`h-8 border border-black/15 px-3 text-[12px] font-semibold text-black/65 transition-colors hover:bg-black/[0.03] ${focusRing}`}
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </div>

      {!authReady ? (
        <section className="border border-black/15 bg-white p-8 text-[15px] text-black/68">결제 페이지를 준비하는 중입니다...</section>
      ) : null}

      {authReady && !authUser ? (
        <section className="mb-6 border border-black/12 bg-black/[0.02] p-5">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#0B0F0E]">회원가입 없이도 결제할 수 있습니다.</h2>
          <p className="mt-2 text-[14px] leading-[1.75] text-black/62">
            로그인하면 다음 결제 때 담당자 정보가 더 빠르게 채워집니다. 지금 바로 결제가 필요하면 아래 정보만 입력해 진행해 주세요.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/auth?next=/store"
              className={`inline-flex h-10 items-center border border-black/15 bg-white px-4 text-[13px] font-semibold text-black/70 transition-colors hover:bg-black/[0.03] ${focusRing}`}
            >
              로그인하고 결제하기
            </Link>
          </div>
        </section>
      ) : null}

      {authReady ? (
        <div className="grid gap-8 md:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          {STORE_PRODUCTS.map((product) => {
            const active = selectedProductId === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                className={`w-full rounded-none border px-5 py-5 text-left transition-colors ${focusRing} ${
                  active ? "border-[#21c1a2] bg-[#ecfbf7]" : "border-black/15 bg-white hover:bg-black/[0.02]"
                }`}
              >
                <p className="text-[20px] font-semibold tracking-tight text-[#0B0F0E]">{product.name}</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-black/65">{product.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <p className="text-[26px] font-semibold tracking-tight text-[#0B0F0E]">
                    {product.price.toLocaleString("ko-KR")}원
                  </p>
                  <p className="text-[12px] font-semibold tracking-[0.08em] text-black/45">VAT 포함 결제 가능</p>
                </div>
              </button>
            );
          })}
        </section>

        <aside className="border border-black/15 bg-white p-6 md:p-7">
          <h2 className="text-[24px] font-semibold tracking-tight">결제 정보 입력</h2>
          <p className="mt-2 text-[14px] leading-[1.75] text-black/60">
            담당자 확인과 결제 안내를 위해 이름과 전화번호는 꼭 입력해 주세요.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleProcessPayment}>
            <div className="space-y-2">
              <p className="text-[13px] font-semibold tracking-[0.06em] text-black/58">결제수단</p>
              <div className="flex flex-wrap gap-2">
                {PAY_METHOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPayMethod(option.value)}
                    className={`inline-flex h-9 items-center border px-3 text-[13px] font-semibold transition-colors ${focusRing} ${
                      payMethod === option.value
                        ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]"
                        : "border-black/16 text-black/65 hover:bg-black/[0.03]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">상호명</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="티케이디지랩스 주식회사"
                className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">이름*</span>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="홍길동"
                  required
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">직함</span>
                <input
                  value={customerRole}
                  onChange={(event) => setCustomerRole(event.target.value)}
                  placeholder="대표 / 실장 / 담당자"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">전화번호*</span>
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="010-1234-5678"
                  required
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">이메일</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="hello@company.com"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">우편번호</span>
                <input
                  value={zipcode}
                  onChange={(event) => setZipcode(event.target.value)}
                  placeholder="06236"
                  className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block space-y-1.5">
                  <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">주소</span>
                  <input
                    value={addressLine1}
                    onChange={(event) => setAddressLine1(event.target.value)}
                    placeholder="서울특별시 강남구 ..."
                    className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleOpenPostcodePopup}
                  disabled={!postcodeLoaded}
                  className={`h-11 whitespace-nowrap border border-[#21c1a2] px-4 text-[13px] font-semibold text-[#0B0F0E] transition-colors hover:bg-[#ecfbf7] disabled:cursor-not-allowed disabled:border-black/12 disabled:text-black/35 disabled:hover:bg-transparent ${focusRing}`}
                >
                  {postcodeLoaded ? "우편번호 찾기" : "주소 모듈 로딩중"}
                </button>
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">상세주소</span>
              <input
                ref={detailAddressInputRef}
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                placeholder="층/호수 등"
                className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">사업자번호 (현금영수증 요청용)</span>
              <input
                value={businessRegistrationNumber}
                onChange={(event) => setBusinessRegistrationNumber(event.target.value)}
                placeholder="123-45-67890"
                className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <div className="mt-3 rounded-none border border-black/12 bg-black/[0.02] p-4">
              <p className="text-[12px] font-semibold tracking-[0.09em] text-black/55">선택 상품</p>
              <p className="mt-1 text-[17px] font-semibold text-[#0B0F0E]">{selectedProduct?.name}</p>
              <p className="mt-1 text-[24px] font-semibold tracking-tight text-[#0B0F0E]">
                {selectedProduct?.price.toLocaleString("ko-KR")}원
              </p>
            </div>

            {error ? (
              <p className="rounded-none border border-red-200 bg-red-50 px-3 py-2 text-sm leading-[1.6] text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className={`inline-flex h-12 w-full items-center justify-center border border-[#21c1a2] bg-[#21c1a2] text-[15px] font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/10 disabled:text-black/40 ${focusRing}`}
            >
              {loading ? "결제창 여는 중..." : "결제 진행하기"}
            </button>
          </form>

          <div className="mt-5 border-t border-black/10 pt-4 text-[13px] leading-[1.7] text-black/58">
            <p>- 결제 완료 후 담당자가 결제 내역을 확인해 안내드립니다.</p>
            <p>- 사업자번호 입력 시 요청 정보가 저장되며, 실제 발급 가능 여부는 결제수단/PG 정책에 따라 달라질 수 있습니다.</p>
            <div className="mt-2 flex flex-wrap gap-3 text-[13px] font-semibold">
              <Link href="/terms" className={`text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
                서비스 이용약관
              </Link>
              <Link href="/refund" className={`text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
                환불 정책
              </Link>
              <Link href="/privacy" className={`text-[#21c1a2] hover:text-[#1db197] ${focusRing}`}>
                개인정보 처리방침
              </Link>
            </div>
          </div>
        </aside>
      </div>
      ) : null}
    </main>
  );
}
