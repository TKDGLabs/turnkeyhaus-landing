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

type PayMethod = (typeof PAY_METHOD_OPTIONS)[number]["value"];
type ProductType = "SINGLE" | "SUBSCRIPTION";

type ProductOptionGroup = {
  name: string;
  required?: boolean;
  values: string[];
};

type SellerInfo = {
  sellerName?: string;
  representative?: string;
  businessNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
};

type ProductNotice = {
  productType?: string;
  deliveryMethod?: string;
  servicePeriod?: string;
  tax?: string;
  issuedDocument?: string;
  customerRequiredInfo?: string;
};

type StoreProduct = {
  id: string;
  type: ProductType;
  name: string;
  summary: string;
  price: number;
  delivery_info: string;
  hero_image_url?: string | null;
  detail_image_urls?: string[] | string | null;
  detail_markdown?: string | null;
  cta_label?: string | null;
  product_options?: ProductOptionGroup[] | string | null;
  seller_info?: SellerInfo | string | null;
  product_notice?: ProductNotice | string | null;
  return_policy?: string[] | string | null;
  origin_info?: string | null;
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
  paymentRequest?: Parameters<typeof PortOne.requestPayment>[0];
};

const DEFAULT_SELLER_INFO: Required<SellerInfo> = {
  sellerName: "티케이디지랩스 주식회사",
  representative: "채동우",
  businessNumber: "763-87-03415",
  address: "인천광역시 서구 파랑로 451, 10층 1010호",
  email: "contact@tkdglabs.com",
  phone: "0507-1463-3664"
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
    hero_image_url: raw.hero_image_url ?? null,
    detail_image_urls: raw.detail_image_urls ?? null,
    detail_markdown: raw.detail_markdown ?? null,
    cta_label: raw.cta_label ?? null,
    product_options: raw.product_options ?? null,
    seller_info: raw.seller_info ?? null,
    product_notice: raw.product_notice ?? null,
    return_policy: raw.return_policy ?? null,
    origin_info: raw.origin_info ?? null
  };
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function normalizeImageList(value?: string[] | string | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string" && Boolean(item));
  } catch {
    // 단일 문자열이면 그대로 이미지 1개로 사용합니다.
  }
  return [value];
}

function productCategory(product: StoreProduct) {
  if (product.price === 0) return "무료자료";
  if (product.id.includes("report")) return "PDF 리포트";
  if (product.id.includes("planner")) return "전략 플래너";
  return "착수금";
}

function priceLabel(price: number) {
  return price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;
}

function defaultOptions(product: StoreProduct): ProductOptionGroup[] {
  if (product.price === 0) {
    return [{ name: "제공 방식", required: true, values: ["PDF 다운로드 권한"] }];
  }

  if (product.id.includes("report")) {
    return [
      { name: "상품 구성", required: true, values: ["운영 진단 리포트 PDF"] },
      { name: "제공 방식", required: true, values: ["이메일 발송"] }
    ];
  }

  if (product.id.includes("planner")) {
    return [
      { name: "상품 구성", required: true, values: ["90일 채널 전략 플래너"] },
      { name: "진행 방식", required: true, values: ["온라인/이메일 컨설팅"] }
    ];
  }

  return [
    { name: "착수 범위", required: true, values: ["상담 후 계약 범위 확정"] },
    { name: "결제 목적", required: true, values: ["첫 달 착수금"] }
  ];
}

function getOptionGroups(product: StoreProduct) {
  const parsed = parseJson<ProductOptionGroup[] | null>(product.product_options, null);
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed
      .map((group) => ({
        name: String(group.name || "옵션"),
        required: group.required !== false,
        values: Array.isArray(group.values) ? group.values.filter(Boolean).map(String) : []
      }))
      .filter((group) => group.values.length > 0);
  }
  return defaultOptions(product);
}

function defaultNotice(product: StoreProduct): Required<ProductNotice> {
  const isService = product.type === "SUBSCRIPTION";
  return {
    productType: isService ? "월간 유튜브 운영대행 착수금" : product.price === 0 ? "디지털 무료 자료" : "디지털 리포트/컨설팅 상품",
    deliveryMethod: product.delivery_info || "결제 또는 신청 완료 후 안내",
    servicePeriod: isService ? "별도 상담 및 계약서 기준" : product.id.includes("planner") ? "결제 익일부터 3개월" : "결제 완료 후 안내 일정 기준",
    tax: product.price > 0 ? "VAT 포함" : "무료 상품",
    issuedDocument: "결제 내역 및 필요 시 세금계산서/현금영수증 안내",
    customerRequiredInfo: "담당자명, 연락처, 이메일, 채널 URL 또는 참고 링크"
  };
}

function defaultReturnPolicy(product: StoreProduct) {
  if (product.type === "SUBSCRIPTION") {
    return [
      "운영대행은 상담 및 계약 범위 확인 후 착수됩니다.",
      "착수 전에는 결제 취소가 가능하나, 착수 후에는 실제 투입 인력·일정 확보·제작 진행분을 기준으로 정산됩니다.",
      "세부 해지·환불 기준은 별도 계약서와 환불 정책을 우선 적용합니다."
    ];
  }

  if (product.price === 0) {
    return ["무료 자료는 신청 후 다운로드 권한이 부여됩니다.", "자료의 무단 재배포, 재판매, 공개 공유는 금지됩니다."];
  }

  return [
    "결제 후 작업 착수 전에는 취소 요청이 가능합니다.",
    "분석·기획 작업 착수 또는 PDF/자료 전송 이후에는 무형 서비스 특성상 환불이 제한될 수 있습니다.",
    "오입력, 중복 결제 등 결제 오류는 확인 후 취소 처리합니다."
  ];
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

function StoreImage({ path, alt, className, fallbackLabel }: { path?: string | null; alt: string; className: string; fallbackLabel: string }) {
  const imageUrl = usePublicAssetUrl(path);

  if (!imageUrl) {
    return (
      <div className={`${className} flex flex-col justify-end border border-black/5 bg-gradient-to-br from-[#F3FAF8] to-white p-6`}>
        <p className="text-[12px] font-semibold tracking-[0.18em] text-black/30">TURNKEYHAUS</p>
        <p className="mt-2 text-[34px] font-bold leading-none tracking-tight text-[#0B0F0E]">{fallbackLabel}</p>
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} loading="lazy" />;
}

function InfoTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="divide-y divide-black/8 rounded-2xl border border-black/10 bg-white">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 px-4 py-3 text-[13px] sm:grid-cols-[150px_1fr] sm:gap-4">
          <dt className="font-semibold text-black/42">{label}</dt>
          <dd className="break-keep font-medium leading-relaxed text-black/72">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const productId = params.id;

  const [product, setProduct] = useState<StoreProduct | null>(FULL_PRODUCTS.find((item) => item.id === productId) || null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("CARD");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [taxInvoiceRequested, setTaxInvoiceRequested] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedOps, setAgreedOps] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProductAndUser() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("store_products")
          .select("*")
          .eq("id", productId)
          .eq("is_active", true)
          .maybeSingle();

        if (!error && data && isMounted) {
          setProduct(normalizeProduct(data as Partial<StoreProduct>));
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
        console.error("상품 상세 로딩 에러:", err);
      }
    }

    loadProductAndUser();
    return () => {
      isMounted = false;
    };
  }, [productId, supabase]);

  const optionGroups = useMemo(() => (product ? getOptionGroups(product) : []), [product]);

  useEffect(() => {
    if (!product) return;
    const defaults = Object.fromEntries(optionGroups.map((group) => [group.name, group.values[0] || ""]));
    setSelectedOptions(defaults);
    setError(null);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-5 text-center">
        <h1 className="text-2xl font-bold text-[#0B0F0E]">상품을 찾을 수 없습니다.</h1>
        <button onClick={() => router.push("/store")} className="font-semibold text-[#21c1a2] hover:underline">
          스토어 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isOps = product.type === "SUBSCRIPTION";
  const isFree = product.price === 0;
  const bulletPoints = product.summary.split("\n").filter((text) => text.trim() !== "");
  const detailImages = normalizeImageList(product.detail_image_urls);
  const seller = { ...DEFAULT_SELLER_INFO, ...parseJson<SellerInfo>(product.seller_info, {}) };
  const notice = { ...defaultNotice(product), ...parseJson<ProductNotice>(product.product_notice, {}) };
  const returnPolicy = parseJson<string[] | null>(product.return_policy, null) ?? defaultReturnPolicy(product);
  const originInfo = product.origin_info || "디지털 콘텐츠·용역 서비스 상품으로 원산지 표시 대상이 아니며, 제작 및 서비스 제공지는 대한민국입니다.";
  const detailText =
    product.detail_markdown ||
    (isOps
      ? "운영대행은 상담과 계약 범위 확정 후 착수되는 월간 운영 패키지입니다. 정확한 제공 범위는 상담 및 계약서 기준으로 확정됩니다."
      : isFree
        ? "브랜드 유튜브를 처음 시작하는 전문직·기업 담당자가 채널 방향과 기본 세팅을 빠르게 잡을 수 있도록 만든 자료입니다."
        : "구매 후 채널 URL과 참고 자료를 바탕으로 분석 또는 전략 플래닝을 진행합니다.");

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
        productId: product.id,
        payMethod,
        selectedOptions,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        channelUrl: channelUrl.trim(),
        companyName: companyName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        taxInvoiceRequested,
        consents: {
          terms: agreedTerms,
          privacy: agreedPrivacy,
          refund: agreedTerms,
          penalty: isOps ? agreedOps : false
        }
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.message || "주문 생성에 실패했습니다.");
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
    if (!response.ok) throw new Error(payload?.message || "결제 검증에 실패했습니다.");
    return payload;
  }

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processLoading) return;
    setError(null);

    if (!authUser) return setShowAuthModal(true);
    if (!customerName.trim() || !customerPhone.trim()) return setError("담당자명과 전화번호를 입력해 주세요.");
    if (!agreedPrivacy) return setError("개인정보 처리방침에 동의해 주세요.");
    if (!agreedTerms) return setError("환불 및 서비스 제공 기준을 확인해 주세요.");
    if (isOps && !agreedOps) return setError("운영대행 착수 및 해지 기준을 확인해 주세요.");

    setProcessLoading(true);
    try {
      const order = await createStoreOrder();

      if (order.amount === 0 || order.status === "paid") {
        alert("무료 자료 신청이 완료되었습니다. 다운로드 권한이 부여되었습니다.");
        router.refresh();
        return;
      }

      if (!order.paymentRequest || !order.paymentId) throw new Error("결제 요청 정보가 생성되지 않았습니다. PortOne 환경변수를 확인해 주세요.");

      const portOneResponse = (await PortOne.requestPayment(order.paymentRequest)) as PortOnePaymentResult | undefined;
      if (!portOneResponse) return;
      if (portOneResponse.code !== undefined) throw new Error(portOneResponse.message || "결제가 취소되었거나 실패했습니다.");
      if (!portOneResponse.paymentId) throw new Error("결제 ID를 확인할 수 없습니다.");

      await completePortOnePayment(order.orderNo, portOneResponse.paymentId);
      router.push(`/store/payment/complete?orderNo=${encodeURIComponent(order.orderNo)}&paymentId=${encodeURIComponent(portOneResponse.paymentId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "결제 진행 중 문제가 발생했습니다.";
      if (message !== "로그인이 필요합니다.") setError(message);
    } finally {
      setProcessLoading(false);
    }
  }

  return (
    <main className="bg-white text-[#0B0F0E]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-6 md:py-12">
        <nav className="mb-6 flex items-center gap-2 text-[13px] font-medium text-black/40">
          <Link href="/store" className="hover:text-[#21c1a2]">스토어</Link>
          <span>/</span>
          <span className="text-black/65">{product.name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <StoreImage path={product.hero_image_url} alt={`${product.name} 대표 이미지`} fallbackLabel={productCategory(product).toUpperCase()} className="aspect-square w-full rounded-3xl object-cover" />

              <div className="flex flex-col justify-center rounded-3xl border border-black/10 bg-[#FAFAFA] p-6 md:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#21c1a2]">{productCategory(product)}</p>
                <h1 className="mt-3 break-keep text-[30px] font-bold leading-[1.18] tracking-tight md:text-[42px]">{product.name}</h1>
                <p className="mt-4 break-keep text-[15px] font-medium leading-[1.8] text-black/62 md:text-[17px]">{bulletPoints[0] || product.delivery_info}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {bulletPoints.slice(0, 4).map((point) => (
                    <span key={point} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-black/58">{point}</span>
                  ))}
                </div>
              </div>
            </div>

            <section className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
              <h2 className="text-[22px] font-bold">상품 상세</h2>
              <div className="space-y-4">{detailText.split(/\n{2,}/).map((paragraph) => <p key={paragraph} className="break-keep text-[15px] font-medium leading-[1.85] text-black/66">{paragraph}</p>)}</div>
              {detailImages.length > 0 && (
                <div className="grid gap-4 pt-4">
                  {detailImages.map((image, index) => (
                    <StoreImage key={`${image}-${index}`} path={image} alt={`${product.name} 상세 이미지 ${index + 1}`} fallbackLabel="DETAIL" className="max-h-[760px] w-full rounded-2xl border border-black/5 object-cover" />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-5 rounded-3xl border border-black/10 bg-[#FAFAFA] p-6 md:p-8">
              <h2 className="text-[22px] font-bold">상품 정보 고시</h2>
              <InfoTable rows={[
                ["상품 유형", notice.productType],
                ["제공 방식", notice.deliveryMethod],
                ["서비스 기간", notice.servicePeriod],
                ["과세 여부", notice.tax],
                ["증빙 서류", notice.issuedDocument],
                ["구매자 입력 정보", notice.customerRequiredInfo]
              ]} />
            </section>

            <section className="space-y-5 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
              <h2 className="text-[22px] font-bold">판매자 정보</h2>
              <InfoTable rows={[
                ["상호", seller.sellerName],
                ["대표자", seller.representative],
                ["사업자등록번호", seller.businessNumber],
                ["주소", seller.address],
                ["이메일", seller.email],
                ["전화", seller.phone]
              ]} />
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
                <h2 className="text-[22px] font-bold">교환 및 반품 규정</h2>
                <ul className="space-y-3">
                  {returnPolicy.map((item) => (
                    <li key={item} className="flex gap-3 break-keep text-[14px] font-medium leading-[1.75] text-black/65"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#21c1a2]" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
                <h2 className="text-[22px] font-bold">원산지 표시 정보</h2>
                <p className="break-keep text-[14px] font-medium leading-[1.75] text-black/65">{originInfo}</p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-8">
            <form onSubmit={handleProcessPayment} className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/35">구매 선택</p>
              <h2 className="mt-2 break-keep text-[21px] font-bold leading-tight">{product.name}</h2>
              <div className="mt-4 flex flex-wrap items-end gap-1.5 border-b border-black/10 pb-5">
                {product.price > 0 && <span className="pb-1 text-[13px] font-semibold text-red-500">VAT 포함</span>}
                <span className="text-[32px] font-bold tracking-tight">{priceLabel(product.price)}</span>
              </div>

              <div className="mt-5 space-y-4">
                {optionGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <label className="text-[12px] font-semibold text-black/45">{group.name}{group.required !== false ? "*" : ""}</label>
                    <select
                      value={selectedOptions[group.name] || group.values[0] || ""}
                      onChange={(event) => setSelectedOptions((prev) => ({ ...prev, [group.name]: event.target.value }))}
                      className={`h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-[14px] font-medium ${focusRing}`}
                    >
                      {group.values.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </div>
                ))}

                {product.price > 0 && (
                  <div className="space-y-2">
                    <p className="text-[12px] font-semibold text-black/45">결제수단</p>
                    <div className="grid grid-cols-2 gap-2">
                      {PAY_METHOD_OPTIONS.map((option) => (
                        <button key={option.value} type="button" onClick={() => setPayMethod(option.value)} className={`h-10 rounded-xl border text-[13px] font-semibold transition-colors ${focusRing} ${payMethod === option.value ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/10 text-black/55 hover:bg-black/[0.03]"}`}>{option.label}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="담당자명*" className={`h-11 rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                  <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="전화번호*" className={`h-11 rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                </div>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="이메일" className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />
                <input value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="채널 URL / 참고 링크" className={`h-11 w-full rounded-xl border border-black/15 px-3 text-[14px] ${focusRing}`} />

                <details className="rounded-2xl border border-black/10 bg-[#FAFAFA] p-3">
                  <summary className="cursor-pointer text-[12px] font-semibold text-black/55">사업자 정보 / 세금계산서</summary>
                  <div className="mt-3 space-y-2">
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="회사/상호명" className={`h-10 w-full rounded-xl border border-black/15 px-3 text-[13px] ${focusRing}`} />
                    <input value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} placeholder="사업자등록번호" className={`h-10 w-full rounded-xl border border-black/15 px-3 text-[13px] ${focusRing}`} />
                    <label className="flex items-start gap-2 text-[12px] font-medium text-black/55"><input type="checkbox" checked={taxInvoiceRequested} onChange={(e) => setTaxInvoiceRequested(e.target.checked)} className="mt-0.5 h-4 w-4" />세금계산서/현금영수증 안내가 필요합니다.</label>
                  </div>
                </details>

                {isOps && <label className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-[12px] font-medium leading-relaxed text-red-700"><input type="checkbox" checked={agreedOps} onChange={(e) => setAgreedOps(e.target.checked)} className="mt-0.5 h-4 w-4" />운영대행은 상담 및 계약 범위 확인 후 착수되며, 착수 후 취소/환불은 별도 계약 기준으로 정산됨을 확인했습니다.</label>}

                <label className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-black/58"><input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="mt-0.5 h-4 w-4" /><span><Link href="/privacy" target="_blank" className="underline">개인정보 처리방침</Link>에 동의합니다.</span></label>
                <label className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-black/58"><input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="mt-0.5 h-4 w-4" /><span><Link href="/refund" target="_blank" className="underline">환불 및 제공 기준</Link>을 확인했습니다.</span></label>

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] font-semibold leading-relaxed text-red-600">{error}</p>}

                <button type="submit" disabled={processLoading} className={`w-full rounded-2xl ${isOps ? "bg-[#0B0F0E] text-white" : "bg-[#21c1a2] text-[#07211d]"} px-4 py-4 text-[15px] font-bold transition-transform hover:scale-[1.01] disabled:opacity-45 ${focusRing}`}>
                  {processLoading ? "처리 중..." : product.cta_label || (isFree ? "무료 다운로드 신청" : `${priceLabel(product.price)} 결제하기`)}
                </button>
              </div>
            </form>
          </aside>
        </section>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-xl font-bold text-amber-600">!</div>
            <h3 className="text-[20px] font-bold">로그인이 필요합니다</h3>
            <p className="mt-3 break-keep text-[14px] font-medium leading-relaxed text-black/55">상품 결제와 무료 자료 권한 부여는 회원가입 후 진행됩니다.</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowAuthModal(false)} className={`h-11 rounded-xl border border-black/15 text-[14px] font-semibold text-black/55 ${focusRing}`}>닫기</button>
              <Link href={`/auth?next=/store/${product.id}&mode=signup`} className={`flex h-11 items-center justify-center rounded-xl bg-[#21c1a2] text-[14px] font-bold text-[#07211d] ${focusRing}`}>회원가입</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
