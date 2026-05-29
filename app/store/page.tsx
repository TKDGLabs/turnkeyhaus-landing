"use client";

import type { User } from "@supabase/supabase-js";
import * as PortOne from "@portone/browser-sdk/v2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const PRODUCT_IMAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET || "product-images";

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
  sort_order?: number | null;
  hero_image_url?: string | null;
  detail_image_urls?: string[] | string | null;
  detail_markdown?: string | null;
  cta_label?: string | null;
};

type CreateOrderResponse = {
  orderNo: string;
  amount: number;
  paymentId?: string;
  status?: string;
  paymentRequest?: {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: "CURRENCY_KRW";
    payMethod: PayMethod;
    redirectUrl: string;
    forceRedirect?: boolean;
    customer?: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
    };
    products?: Array<{
      id: string;
      name: string;
      amount: number;
      quantity: number;
      tag?: string;
    }>;
    customData?: Record<string, unknown>;
  };
};

const FULL_PRODUCTS: StoreProduct[] = [
  { id: "tier-ebook", type: "SINGLE", name: "브랜드 유튜브 구축 전자책", summary: "유튜브를 처음 시작하는 전문직/기업 필수 가이드\n문의가 들어오는 채널 세팅의 3가지 핵심 원칙", price: 0, delivery_info: "무료 신청 즉시 다운로드 권한 제공" },
  { id: "tier-report", type: "SINGLE", name: "운영 진단 리포트 (1회성)", summary: "현재 채널 및 경쟁 채널 3곳 정밀 분석\n검색 유입을 위한 주제 20개 추출 및 검증\n즉시 적용 가능한 썸네일/제목 교정 가이드", price: 490000, delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송" },
  { id: "tier-planner", type: "SINGLE", name: "90일 채널 전략 플래너 (특가)", summary: "단기 성과를 위한 3개월 채널 로드맵 기획\n시즌 이슈 및 검색량 기반 핵심 키워드 매칭\n기존 업로드 영상 구조 피드백 및 코칭", price: 297000, delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅" },
  { id: "tier-basic", type: "SUBSCRIPTION", name: "유튜브 운영대행 [베이직]", summary: "콘텐츠 기획 및 연출 (6편)\n롱폼 편집 10분 이내 (2편)\n숏폼 신규/재편집 (12편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 3800000, delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제" },
  { id: "tier-standard", type: "SUBSCRIPTION", name: "유튜브 운영대행 [스탠다드]", summary: "콘텐츠 기획 및 연출 (7편)\n롱폼 편집 10분 이내 (3편)\n숏폼 신규/재편집 (16편)\n현장 촬영 1회차 (PD 2인/3CAM)", price: 4400000, delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제" },
  { id: "tier-premium", type: "SUBSCRIPTION", name: "유튜브 운영대행 [프리미엄]", summary: "콘텐츠 기획 및 연출 (12편)\n롱폼 편집 10분 이내 (4편)\n숏폼 신규/재편집 (28편)\n현장 촬영 2회차 (PD 2인/3CAM)", price: 5000000, delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제" }
];

function normalizeProduct(raw: Partial<StoreProduct>): StoreProduct {
  return {
    id: String(raw.id ?? ""),
    type: raw.type === "SUBSCRIPTION" ? "SUBSCRIPTION" : "SINGLE",
    name: String(raw.name ?? ""),
    summary: String(raw.summary ?? ""),
    price: Number(raw.price ?? 0),
    delivery_info: String(raw.delivery_info ?? ""),
    sort_order: raw.sort_order,
    hero_image_url: raw.hero_image_url ?? null,
    detail_image_urls: raw.detail_image_urls ?? null,
    detail_markdown: raw.detail_markdown ?? null,
    cta_label: raw.cta_label ?? null
  };
}

function usePublicAssetUrl(pathOrUrl?: string | null) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  return useMemo(() => {
    if (!pathOrUrl) return null;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    if (!supabase) return null;
    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(pathOrUrl);
    return data.publicUrl;
  }, [pathOrUrl, supabase]);
}

function ProductHeroImage({ product }: { product: StoreProduct }) {
  const imageUrl = usePublicAssetUrl(product.hero_image_url);

  if (!imageUrl) {
    return (
      <div className="flex h-28 w-full items-center justify-center rounded-xl border border-black/5 bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-[0.14em] text-black/25 sm:h-32">
        Turnkeyhaus
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${product.name} 대표 이미지`}
      className="h-28 w-full rounded-xl border border-black/5 object-cover sm:h-32"
      loading="lazy"
    />
  );
}

export default function StorePage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [products, setProducts] = useState<StoreProduct[]>(FULL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(FULL_PRODUCTS[1].id);

  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPenalty, setAgreedToPenalty] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [taxInvoiceRequested, setTaxInvoiceRequested] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");

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
        const { data, error: dbError } = await supabase
          .from("store_products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!dbError && data && data.length > 0 && isMounted) {
          const normalizedProducts = data.map((item) => normalizeProduct(item as Partial<StoreProduct>));
          setProducts(normalizedProducts);
          if (!normalizedProducts.some((item) => item.id === selectedProductId)) {
            setSelectedProductId(normalizedProducts[0].id);
          }
        }

        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setAuthUser(user);
          setCustomerEmail(user.email || "");

          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
          if (profile && isMounted) {
            const profileName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
            setCustomerName(profileName || profile.full_name || "");
            setCustomerPhone(profile.phone_number || profile.phone || "");
            setCompanyName(profile.company_name || "");
            setBusinessRegistrationNumber(profile.biz_reg_no || "");
          }
        }
      } catch (err) {
        console.error("백그라운드 로딩 에러:", err);
      }
    }

    loadBackgroundData();
    return () => {
      isMounted = false;
    };
  }, [selectedProductId, supabase]);

  useEffect(() => {
    setAgreedToTerms(false);
    setAgreedToPenalty(false);
    setAgreedToPrivacy(false);
  }, [selectedProductId]);

  async function createStoreOrder(): Promise<CreateOrderResponse> {
    if (!supabase) throw new Error("Supabase 연결 정보가 설정되어 있지 않습니다.");

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setShowAuthModal(true);
      throw new Error("로그인이 필요합니다.");
    }

    const response = await fetch("/api/store/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        productId: selectedProduct?.id,
        payMethod,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        channelUrl: channelUrl.trim(),
        companyName: companyName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        taxInvoiceRequested,
        consents: {
          terms: agreedToTerms,
          privacy: agreedToPrivacy,
          refund: agreedToTerms,
          penalty: selectedProduct?.type === "SUBSCRIPTION" ? agreedToPenalty : false
        }
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || "주문 생성에 실패했습니다.");
    }

    return payload as CreateOrderResponse;
  }

  async function completePortOnePayment(orderNo: string, paymentId: string) {
    if (!supabase) throw new Error("Supabase 연결 정보가 설정되어 있지 않습니다.");

    const {
      data: { session }
    } = await supabase.auth.getSession();

    const response = await fetch("/api/store/payments/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
      },
      body: JSON.stringify({ orderNo, paymentId })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || "결제 검증에 실패했습니다.");
    }

    return payload;
  }

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processLoading) return;

    setError(null);

    if (!authUser) return setShowAuthModal(true);
    if (!selectedProduct) return setError("상품을 선택해 주세요.");
    if (!customerName.trim() || !customerPhone.trim()) return setError("이름과 전화번호를 입력해 주세요.");
    if (!agreedToPrivacy) return setError("개인정보 처리방침에 동의해 주세요.");
    if (!agreedToTerms) return setError("무형 서비스 환불 규정에 동의해 주세요.");
    if (selectedProduct.type === "SUBSCRIPTION" && !agreedToPenalty) {
      return setError("운영대행 약정 및 해지 규정에 동의하셔야 진행할 수 있습니다.");
    }

    setProcessLoading(true);

    try {
      const order = await createStoreOrder();

      if (order.amount === 0 || order.status === "paid") {
        alert("무료 자료 신청이 완료되었습니다. 다운로드 권한이 부여되었습니다.");
        router.refresh();
        return;
      }

      if (!order.paymentRequest || !order.paymentId) {
        throw new Error("결제 요청 정보가 생성되지 않았습니다.");
      }

      const portOneResponse = await PortOne.requestPayment(order.paymentRequest);

      // 모바일 리디렉션 방식에서는 여기까지 돌아오지 않고 redirectUrl로 이동할 수 있습니다.
      if (!portOneResponse) return;

      if (portOneResponse.code !== undefined) {
        throw new Error(portOneResponse.message || "결제가 취소되었거나 실패했습니다.");
      }

      await completePortOnePayment(order.orderNo, portOneResponse.paymentId);
      router.push(`/store/payment/complete?orderNo=${encodeURIComponent(order.orderNo)}&paymentId=${encodeURIComponent(portOneResponse.paymentId)}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "결제 진행 중 문제가 발생했습니다.";
      if (message !== "로그인이 필요합니다.") setError(message);
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#21c1a2]">[ Store & Plan ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">서비스 및 플랜 결제</h1>
        <p className="max-w-[72ch] break-keep text-[16px] leading-[1.8] text-black/68">
          단건 리포트와 플래너는 카드로 바로 결제할 수 있습니다. 월간 운영대행은 상담 및 계약 범위 확인 후 착수금 결제로 진행됩니다.
        </p>
        {authUser ? (
          <div className="flex items-center gap-2 pt-2 text-[13px]">
            <span className="rounded bg-black/5 px-2.5 py-1.5">{authUser.email}</span>
            <button onClick={handleSignOut} className={`h-8 rounded border border-black/15 px-3 text-[12px] font-semibold text-black/65 hover:bg-black/5 ${focusRing}`}>
              로그아웃
            </button>
          </div>
        ) : (
          <div className="pt-2 text-[13px] font-medium text-black/40">로그인하지 않은 상태입니다. 결제 시 가입 팝업이 표출됩니다.</div>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {products.map((product) => {
            const active = selectedProductId === product.id;
            const isSub = product.type === "SUBSCRIPTION";
            const isFree = product.price === 0;
            const bullets = product.summary.split("\n").filter((text) => text.trim() !== "");

            return (
              <div
                key={product.id}
                className={`w-full cursor-pointer text-left transition-all duration-300 ${focusRing} ${
                  active
                    ? `rounded-2xl p-6 shadow-sm ring-2 md:p-8 ${isSub ? "bg-[#FAFAFA] ring-[#0B0F0E]" : "bg-[#FAFAFA] ring-[#21c1a2]"}`
                    : "rounded-2xl border border-black/10 bg-white p-6 hover:border-[#21c1a2]/40 hover:bg-[#FAFAFA]/50 md:p-8"
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="grid gap-4 md:gap-6 sm:grid-cols-[160px_1fr]">
                  <div className="space-y-4">
                    <ProductHeroImage product={product} />
                    <div>
                      <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-widest md:text-[12px] ${isSub ? "text-[#0B0F0E]" : "text-[#21c1a2]"}`}>
                        {isSub ? "OPS DEPOSIT" : isFree ? "FREE ASSET" : "SINGLE PAYMENT"}
                      </p>
                      <p className="text-[22px] font-bold tracking-tight text-[#0B0F0E] md:text-[26px]">{isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}</p>
                      <p className="mt-1 text-[12px] font-semibold tracking-[0.08em] text-black/45">{isSub ? "첫 달 착수금 / VAT 포함" : "VAT 포함"}</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-[20px] font-bold tracking-tight text-[#0B0F0E] md:text-[22px]">{product.name}</h3>
                      {active && <span className={`${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#21c1a2] text-[#07211d]"} rounded px-2.5 py-1 text-[11px] font-bold`}>선택됨</span>}
                    </div>

                    <ul className="mb-5 grid gap-2.5 text-[13px] font-medium text-black/70 md:text-[14px]">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isSub ? "bg-[#0B0F0E]" : "bg-black/30"}`} />
                          <span className="break-keep text-left">{bullet.trim()}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="inline-block rounded-lg border border-black/10 bg-white p-3 text-[12px] text-black/60">
                        <span className="mr-2 font-bold text-black">제공 방식:</span> {product.delivery_info}
                      </div>
                      <Link
                        href={`/store/${product.id}`}
                        className={`inline-flex items-center border-b border-transparent text-[13px] font-bold transition-colors hover:border-[#21c1a2] ${isSub ? "text-[#0B0F0E]" : "text-[#21c1a2]"}`}
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

        <aside className="h-fit w-full lg:sticky lg:top-32">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-[22px] font-bold tracking-tight">결제 정보 입력</h2>
            <form className="mt-6 space-y-6" onSubmit={handleProcessPayment}>
              {selectedProduct && selectedProduct.price > 0 && (
                <div className="space-y-2">
                  <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-black/58">결제수단</p>
                  <div className="flex flex-wrap gap-2">
                    {PAY_METHOD_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPayMethod(option.value)}
                        className={`inline-flex h-10 items-center rounded-lg border px-4 text-[14px] font-bold transition-colors ${focusRing} ${
                          payMethod === option.value ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/15 text-black/65 hover:bg-black/5"
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
                  <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required={!!authUser} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-[12px] font-bold text-black/50">이메일 (결제 내역 수신용)</span>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[12px] font-bold text-black/50">유튜브 채널 URL / 참고 링크</span>
                <input value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="https://www.youtube.com/@..." className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-[12px] font-bold text-black/50">회사/상호명</span>
                  <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[12px] font-bold text-black/50">사업자등록번호</span>
                  <input value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} placeholder="000-00-00000" className={`h-11 w-full rounded-lg border border-black/15 px-3 text-[15px] ${focusRing}`} />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/5 bg-[#FAFAFA] p-4">
                <input type="checkbox" checked={taxInvoiceRequested} onChange={(e) => setTaxInvoiceRequested(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#21c1a2]" />
                <div className="text-[13px] font-medium leading-relaxed text-black/70">
                  <p>세금계산서 또는 현금영수증 발급 안내가 필요합니다. (선택)</p>
                </div>
              </label>

              <AnimatePresence>
                {selectedProduct?.type === "SUBSCRIPTION" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden rounded-lg border border-[#FEB2B2] border-l-4 border-l-[#E53E3E] bg-[#FFF5F5] p-5">
                    <h4 className="text-[14px] font-bold text-[#C53030]">운영대행 약정 및 해지 규정</h4>
                    <p className="break-keep text-[13px] font-medium leading-relaxed text-[#742A2A]">
                      운영대행 플랜은 상담 및 계약 범위 확인 후 착수됩니다. 계약 확정 후에는 배정 인력과 일정 확보 비용이 발생하므로, 별도 계약서와 환불 정책을 기준으로 정산됩니다.
                    </p>
                    <label className="flex cursor-pointer items-start gap-2 pt-2">
                      <input type="checkbox" required checked={agreedToPenalty} onChange={(e) => setAgreedToPenalty(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#E53E3E]" />
                      <span className="text-[13px] font-bold text-[#C53030]">운영대행 약정 및 해지 규정을 확인했습니다. (필수)</span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/5 bg-[#FAFAFA] p-4">
                <input type="checkbox" required={!!authUser} checked={agreedToPrivacy} onChange={(e) => setAgreedToPrivacy(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#21c1a2]" />
                <div className="text-[13px] font-medium leading-relaxed text-black/70">
                  <p>
                    <Link href="/privacy" target="_blank" className="font-bold underline hover:text-[#21c1a2]">
                      개인정보 처리방침
                    </Link>
                    에 동의합니다. (필수)
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/5 bg-[#FAFAFA] p-4">
                <input type="checkbox" required={!!authUser} checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#21c1a2]" />
                <div className="text-[13px] font-medium leading-relaxed text-black/70">
                  <p>
                    무형 서비스 특성상 작업 착수 또는 리포트 전송 이후에는 환불이 제한될 수 있음을 확인했습니다.{" "}
                    <Link href="/refund" target="_blank" className="font-bold underline hover:text-[#21c1a2]">
                      환불 정책 보기
                    </Link>
                    (필수)
                  </p>
                </div>
              </label>

              {error && <p className="animate-pulse text-center text-[13px] font-bold text-red-500">{error}</p>}

              <div className="pt-2">
                <button type="submit" disabled={processLoading || !selectedProduct} className={`inline-flex h-14 w-full items-center justify-center rounded-xl ${selectedProduct?.type === "SUBSCRIPTION" ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"} text-[16px] font-bold ${selectedProduct?.type === "SUBSCRIPTION" ? "text-white" : "text-[#07211d]"} transition-transform hover:scale-[1.02] disabled:opacity-50 ${focusRing}`}>
                  {processLoading ? "처리 중..." : selectedProduct ? selectedProduct.cta_label || `${selectedProduct.price === 0 ? "무료 다운로드 받기" : `${selectedProduct.price.toLocaleString("ko-KR")}원 결제하기`}` : "상품을 선택해주세요"}
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mx-5 w-full max-w-sm space-y-4 rounded-2xl border border-black/10 bg-white p-7 text-center shadow-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-500">!</div>
              <h3 className="text-[18px] font-bold text-[#0B0F0E]">결제 전 안내</h3>
              <p className="break-keep text-[14px] leading-relaxed text-black/60">결제는 회원가입 후 가능합니다.</p>
              <div className="flex gap-2 pt-3">
                <button onClick={() => setShowAuthModal(false)} className="h-11 flex-1 rounded-xl border border-black/15 text-[14px] font-semibold text-black/55 hover:bg-black/5">
                  돌아가기
                </button>
                <Link href="/auth?next=/store&mode=signup" className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#21c1a2] text-[14px] font-bold text-[#07211d] hover:bg-[#1db197]">
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
