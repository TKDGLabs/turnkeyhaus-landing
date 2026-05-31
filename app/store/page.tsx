"use client";

import type { User } from "@supabase/supabase-js";
import * as PortOne from "@portone/browser-sdk/v2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const PRODUCT_IMAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET || "product-images";

const PAY_METHOD_OPTIONS = [
  { value: "CARD", label: "카드" },
  { value: "TRANSFER", label: "계좌이체" }
] as const;

const CATEGORY_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "free", label: "무료자료" },
  { value: "report", label: "진단·리포트" },
  { value: "planner", label: "전략 플래너" },
  { value: "ops", label: "운영대행" }
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];
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

type PortOnePaymentResult = {
  paymentId?: string;
  code?: string;
  message?: string;
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
  {
    id: "tier-ebook",
    type: "SINGLE",
    name: "브랜드 유튜브 구축 전자책",
    summary: "유튜브를 처음 시작하는 전문직/기업 필수 가이드\n문의가 들어오는 채널 세팅의 3가지 핵심 원칙",
    price: 0,
    delivery_info: "무료 신청 즉시 다운로드 권한 제공"
  },
  {
    id: "tier-report",
    type: "SINGLE",
    name: "운영 진단 리포트",
    summary: "현재 채널 및 경쟁 채널 3곳 정밀 분석\n검색 유입을 위한 주제 20개 추출 및 검증\n즉시 적용 가능한 썸네일/제목 교정 가이드",
    price: 490000,
    delivery_info: "결제 완료 후 3영업일 이내 PDF 이메일 발송"
  },
  {
    id: "tier-planner",
    type: "SINGLE",
    name: "90일 채널 전략 플래너",
    summary: "단기 성과를 위한 3개월 채널 로드맵 기획\n시즌 이슈 및 검색량 기반 핵심 키워드 매칭\n기존 업로드 영상 구조 피드백 및 코칭",
    price: 297000,
    delivery_info: "결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅"
  },
  {
    id: "tier-basic",
    type: "SUBSCRIPTION",
    name: "운영대행 베이직 착수금",
    summary: "콘텐츠 기획 및 연출 6편\n롱폼 편집 10분 이내 2편\n숏폼 신규/재편집 12편\n현장 촬영 1회차",
    price: 3800000,
    delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제"
  },
  {
    id: "tier-standard",
    type: "SUBSCRIPTION",
    name: "운영대행 스탠다드 착수금",
    summary: "콘텐츠 기획 및 연출 7편\n롱폼 편집 10분 이내 3편\n숏폼 신규/재편집 16편\n현장 촬영 1회차",
    price: 4400000,
    delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제"
  },
  {
    id: "tier-premium",
    type: "SUBSCRIPTION",
    name: "운영대행 프리미엄 착수금",
    summary: "콘텐츠 기획 및 연출 12편\n롱폼 편집 10분 이내 4편\n숏폼 신규/재편집 28편\n현장 촬영 2회차",
    price: 5000000,
    delivery_info: "상담 및 계약 범위 확인 후 첫 달 착수금 결제"
  }
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

function productCategory(product: StoreProduct): CategoryValue {
  if (product.price === 0) return "free";
  if (product.id.includes("report")) return "report";
  if (product.id.includes("planner")) return "planner";
  if (product.type === "SUBSCRIPTION") return "ops";
  return "report";
}

function productBadge(product: StoreProduct) {
  const category = productCategory(product);
  if (category === "free") return "무료자료";
  if (category === "report") return "PDF 리포트";
  if (category === "planner") return "전략상품";
  return "착수금";
}

function productTagline(product: StoreProduct) {
  const category = productCategory(product);
  if (category === "free") return "입문 가이드";
  if (category === "report") return "3영업일 제공";
  if (category === "planner") return "90일 로드맵";
  return "상담 후 진행";
}

function productInitial(product: StoreProduct) {
  const category = productCategory(product);
  if (category === "free") return "EBOOK";
  if (category === "report") return "REPORT";
  if (category === "planner") return "PLAN";
  return "OPS";
}

function priceLabel(price: number) {
  return price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;
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

function ProductThumb({ product, selected }: { product: StoreProduct; selected: boolean }) {
  const imageUrl = usePublicAssetUrl(product.hero_image_url);
  const category = productCategory(product);
  const accent = category === "ops" ? "from-[#0B0F0E] to-[#2C3A36]" : category === "planner" ? "from-[#21c1a2] to-[#B8FFE4]" : category === "report" ? "from-[#DDF8F3] to-white" : "from-[#F2FFF9] to-white";

  if (imageUrl) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F5F5]">
        <img src={imageUrl} alt={`${product.name} 대표 이미지`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {selected ? <div className="absolute inset-0 ring-4 ring-inset ring-[#21c1a2]" /> : null}
      </div>
    );
  }

  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${accent} p-5`}>
      <div className="absolute right-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-black text-[#0B0F0E] shadow-sm">{productBadge(product)}</div>
      <div className="flex h-full flex-col justify-end">
        <p className={`text-[12px] font-black tracking-[0.18em] ${category === "ops" ? "text-white/55" : "text-black/35"}`}>TURNKEYHAUS</p>
        <p className={`mt-2 text-[34px] font-black leading-none tracking-tight ${category === "ops" ? "text-white" : "text-[#0B0F0E]"}`}>{productInitial(product)}</p>
        <p className={`mt-3 text-[13px] font-bold ${category === "ops" ? "text-white/68" : "text-black/55"}`}>{productTagline(product)}</p>
      </div>
      {selected ? <div className="absolute inset-0 ring-4 ring-inset ring-[#21c1a2]" /> : null}
    </div>
  );
}

function ProductCard({ product, selected, onSelect }: { product: StoreProduct; selected: boolean; onSelect: () => void }) {
  const bullets = product.summary.split("\n").filter(Boolean);
  const category = productCategory(product);

  return (
    <article className="group min-w-0">
      <button type="button" onClick={onSelect} className={`block w-full rounded-3xl text-left transition-all hover:-translate-y-0.5 ${focusRing}`}>
        <ProductThumb product={product} selected={selected} />
        <div className="pt-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${category === "ops" ? "bg-[#0B0F0E] text-white" : "bg-[#E6F8F5] text-[#12846F]"}`}>{productBadge(product)}</span>
            <span className="truncate text-[11px] font-bold text-black/35">{productTagline(product)}</span>
          </div>
          <h3 className="line-clamp-2 min-h-[2.8em] break-keep text-[15px] font-black leading-[1.4] tracking-tight text-[#0B0F0E] md:text-[16px]">{product.name}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.9em] break-keep text-[12px] font-medium leading-[1.45] text-black/52">{bullets.slice(0, 2).join(" · ")}</p>
          <div className="mt-2 flex items-end gap-1.5">
            {product.price > 0 && <span className="pb-0.5 text-[12px] font-bold text-red-500">VAT 포함</span>}
            <span className="text-[22px] font-black tracking-tight text-[#0B0F0E]">{priceLabel(product.price)}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] font-bold text-black/38">{product.delivery_info}</p>
        </div>
      </button>
      <div className="mt-2 flex items-center gap-2">
        <Link href={`/store/${product.id}`} className={`text-[12px] font-black text-black/45 underline-offset-4 hover:text-[#21c1a2] hover:underline ${focusRing}`}>상세보기</Link>
        {selected ? <span className="rounded-full bg-[#21c1a2] px-2 py-0.5 text-[11px] font-black text-[#07211d]">선택됨</span> : null}
      </div>
    </article>
  );
}

export default function StorePage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [products, setProducts] = useState<StoreProduct[]>(FULL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(FULL_PRODUCTS[1].id);
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("all");

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

  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedProductId), [products, selectedProductId]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => productCategory(product) === activeCategory);
  }, [activeCategory, products]);

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
        console.error("스토어 데이터 로딩 에러:", err);
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
    setError(null);
  }, [selectedProductId]);

  async function createStoreOrder(): Promise<CreateOrderResponse> {
    if (!supabase) throw new Error("Supabase 연결 정보가 설정되어 있지 않습니다. Vercel 환경변수를 확인해 주세요.");

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
    if (!customerName.trim() || !customerPhone.trim()) return setError("담당자명과 전화번호를 입력해 주세요.");
    if (!agreedToPrivacy) return setError("개인정보 처리방침에 동의해 주세요.");
    if (!agreedToTerms) return setError("환불 및 서비스 제공 기준에 동의해 주세요.");
    if (selectedProduct.type === "SUBSCRIPTION" && !agreedToPenalty) {
      return setError("운영대행 착수 및 해지 기준을 확인해 주세요.");
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
        throw new Error("결제 요청 정보가 생성되지 않았습니다. PortOne 환경변수를 확인해 주세요.");
      }

      const portOneResponse = (await PortOne.requestPayment(order.paymentRequest as Parameters<typeof PortOne.requestPayment>[0])) as PortOnePaymentResult | undefined;

      if (!portOneResponse) return;

      if (portOneResponse.code !== undefined) {
        throw new Error(portOneResponse.message || "결제가 취소되었거나 실패했습니다.");
      }

      if (!portOneResponse.paymentId) {
        throw new Error("결제 ID를 확인할 수 없습니다.");
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
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <section className="border-b border-black/10 bg-[#F7F8F7]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-5 py-8 sm:px-6 md:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#0B0F0E] p-7 text-white md:p-10">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#21c1a2]">Turnkeyhaus Store</p>
            <h1 className="mt-4 max-w-[12ch] break-keep text-[38px] font-black leading-[1.05] tracking-tight sm:text-[54px]">채널 운영 상품을 바로 확인하세요.</h1>
            <p className="mt-5 max-w-[56ch] break-keep text-[15px] font-medium leading-[1.75] text-white/68 md:text-[17px]">
              무료 자료, 유료 진단 리포트, 90일 플래너, 운영대행 착수금까지 한 화면에서 고르고 결제할 수 있게 정리했습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['카드결제', 'PDF 산출물', '채널 진단', '운영대행 착수금'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[12px] font-bold text-white/76">{item}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            <Link href="/store/tier-report" className={`rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${focusRing}`}>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#21c1a2]">Best</p>
              <h2 className="mt-3 break-keep text-[24px] font-black leading-tight">운영 진단 리포트</h2>
              <p className="mt-2 text-[13px] font-bold text-black/45">3영업일 이내 PDF 제공</p>
              <p className="mt-5 text-[26px] font-black">490,000원</p>
            </Link>
            <Link href="/store/tier-planner" className={`rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${focusRing}`}>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#21c1a2]">Special</p>
              <h2 className="mt-3 break-keep text-[24px] font-black leading-tight">90일 채널 전략 플래너</h2>
              <p className="mt-2 text-[13px] font-bold text-black/45">3개월 로드맵·피드백</p>
              <p className="mt-5 text-[26px] font-black">297,000원</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-x-auto border-b border-black/10 pb-4">
          <div className="flex min-w-max gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-full border px-4 py-2 text-[13px] font-black transition-colors ${focusRing} ${activeCategory === category.value ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/10 bg-white text-black/55 hover:bg-black/[0.03]"}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#21c1a2]">오늘 선택 가능한 상품</p>
                <h2 className="mt-2 text-[24px] font-black tracking-tight md:text-[30px]">{activeCategory === "all" ? "전체 상품" : CATEGORY_OPTIONS.find((item) => item.value === activeCategory)?.label}</h2>
              </div>
              <p className="text-[13px] font-bold text-black/38">총 {visibleProducts.length}개</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} selected={selectedProductId === product.id} onSelect={() => setSelectedProductId(product.id)} />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:p-6">
              <div className="mb-5 rounded-2xl bg-[#FAFAFA] p-4">
                <p className="text-[12px] font-black uppercase tracking-[0.14em] text-black/35">선택한 상품</p>
                <h3 className="mt-2 break-keep text-[20px] font-black leading-tight">{selectedProduct?.name ?? "상품을 선택해 주세요"}</h3>
                {selectedProduct ? (
                  <div className="mt-3 flex items-end gap-1.5">
                    {selectedProduct.price > 0 && <span className="pb-0.5 text-[12px] font-bold text-red-500">VAT 포함</span>}
                    <span className="text-[28px] font-black tracking-tight">{priceLabel(selectedProduct.price)}</span>
                  </div>
                ) : null}
                {selectedProduct?.delivery_info ? <p className="mt-2 break-keep text-[12px] font-bold leading-relaxed text-black/45">{selectedProduct.delivery_info}</p> : null}
              </div>

              {authUser ? (
                <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-black/10 px-3 py-2 text-[12px] font-bold text-black/55">
                  <span className="truncate">{authUser.email}</span>
                  <button type="button" onClick={handleSignOut} className={`shrink-0 text-black/35 hover:text-black ${focusRing}`}>로그아웃</button>
                </div>
              ) : (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-amber-800">결제는 회원가입/로그인 후 진행됩니다.</div>
              )}

              <form className="space-y-4" onSubmit={handleProcessPayment}>
                {selectedProduct && selectedProduct.price > 0 && (
                  <div className="space-y-2">
                    <p className="text-[12px] font-black text-black/45">결제수단</p>
                    <div className="grid grid-cols-2 gap-2">
                      {PAY_METHOD_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPayMethod(option.value)}
                          className={`h-10 rounded-xl border text-[13px] font-black transition-colors ${focusRing} ${payMethod === option.value ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/10 text-black/55 hover:bg-black/[0.03]"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <label className="block space-y-1.5">
                    <span className="text-[12px] font-black text-black/45">담당자명*</span>
                    <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[12px] font-black text-black/45">전화번호*</span>
                    <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-[12px] font-black text-black/45">이메일</span>
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[12px] font-black text-black/45">채널 URL / 참고 링크</span>
                  <input value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="https://www.youtube.com/@..." className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                </label>

                <details className="rounded-2xl border border-black/10 bg-[#FAFAFA] p-3">
                  <summary className="cursor-pointer text-[12px] font-black text-black/55">사업자 정보 / 세금계산서</summary>
                  <div className="mt-3 space-y-2">
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="회사/상호명" className={`h-10 w-full rounded-xl border border-black/15 px-3 text-[13px] ${focusRing}`} />
                    <input value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} placeholder="사업자등록번호" className={`h-10 w-full rounded-xl border border-black/15 px-3 text-[13px] ${focusRing}`} />
                    <label className="flex items-start gap-2 text-[12px] font-bold text-black/55">
                      <input type="checkbox" checked={taxInvoiceRequested} onChange={(e) => setTaxInvoiceRequested(e.target.checked)} className="mt-0.5 h-4 w-4" />
                      세금계산서/현금영수증 안내가 필요합니다.
                    </label>
                  </div>
                </details>

                {selectedProduct?.type === "SUBSCRIPTION" && (
                  <label className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-[12px] font-bold leading-relaxed text-red-700">
                    <input type="checkbox" checked={agreedToPenalty} onChange={(e) => setAgreedToPenalty(e.target.checked)} className="mt-0.5 h-4 w-4" />
                    운영대행은 상담 및 계약 범위 확인 후 착수되며, 착수 후 취소/환불은 별도 계약 기준으로 정산됨을 확인했습니다.
                  </label>
                )}

                <label className="flex items-start gap-2 text-[12px] font-bold leading-relaxed text-black/58">
                  <input type="checkbox" checked={agreedToPrivacy} onChange={(e) => setAgreedToPrivacy(e.target.checked)} className="mt-0.5 h-4 w-4" />
                  <span><Link href="/privacy" target="_blank" className="underline">개인정보 처리방침</Link>에 동의합니다.</span>
                </label>

                <label className="flex items-start gap-2 text-[12px] font-bold leading-relaxed text-black/58">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-0.5 h-4 w-4" />
                  <span><Link href="/refund" target="_blank" className="underline">환불 및 제공 기준</Link>을 확인했습니다.</span>
                </label>

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] font-black leading-relaxed text-red-600">{error}</p>}

                <button type="submit" disabled={processLoading || !selectedProduct} className={`h-13 w-full rounded-2xl ${selectedProduct?.type === "SUBSCRIPTION" ? "bg-[#0B0F0E] text-white" : "bg-[#21c1a2] text-[#07211d]"} px-4 py-4 text-[15px] font-black transition-transform hover:scale-[1.01] disabled:opacity-45 ${focusRing}`}>
                  {processLoading ? "처리 중..." : selectedProduct ? selectedProduct.cta_label || (selectedProduct.price === 0 ? "무료 다운로드 신청" : `${priceLabel(selectedProduct.price)} 결제하기`) : "상품을 선택해 주세요"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-xl font-black text-amber-600">!</div>
            <h3 className="text-[20px] font-black">로그인이 필요합니다</h3>
            <p className="mt-3 break-keep text-[14px] font-medium leading-relaxed text-black/55">상품 결제와 무료 자료 권한 부여는 회원가입 후 진행됩니다.</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowAuthModal(false)} className={`h-11 rounded-xl border border-black/15 text-[14px] font-black text-black/55 ${focusRing}`}>닫기</button>
              <Link href="/auth?next=/store&mode=signup" className={`flex h-11 items-center justify-center rounded-xl bg-[#21c1a2] text-[14px] font-black text-[#07211d] ${focusRing}`}>회원가입</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
