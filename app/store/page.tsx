"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const PRODUCT_IMAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET || "product-images";

const CATEGORY_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "free", label: "무료자료" },
  { value: "report", label: "진단·리포트" },
  { value: "planner", label: "전략 플래너" },
  { value: "ops", label: "운영대행" }
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];
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

function ProductThumb({ product }: { product: StoreProduct }) {
  const imageUrl = usePublicAssetUrl(product.hero_image_url);
  const category = productCategory(product);
  const accent = category === "ops" ? "from-[#0B0F0E] to-[#24302C]" : category === "planner" ? "from-[#21c1a2] to-[#B8FFE4]" : category === "report" ? "from-[#E8F8F5] to-white" : "from-[#F4FFF9] to-white";

  if (imageUrl) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F5F5]">
        <img src={imageUrl} alt={`${product.name} 대표 이미지`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
    );
  }

  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${accent} p-5`}>
      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0B0F0E] shadow-sm">{productBadge(product)}</div>
      <div className="flex h-full flex-col justify-end">
        <p className={`text-[12px] font-semibold tracking-[0.18em] ${category === "ops" ? "text-white/55" : "text-black/35"}`}>TURNKEYHAUS</p>
        <p className={`mt-2 text-[30px] font-bold leading-none tracking-tight ${category === "ops" ? "text-white" : "text-[#0B0F0E]"}`}>{productInitial(product)}</p>
        <p className={`mt-3 text-[13px] font-medium ${category === "ops" ? "text-white/68" : "text-black/55"}`}>{productTagline(product)}</p>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const bullets = product.summary.split("\n").filter(Boolean);
  const category = productCategory(product);

  return (
    <Link href={`/store/${product.id}`} className={`group block min-w-0 rounded-3xl transition-all hover:-translate-y-0.5 ${focusRing}`}>
      <ProductThumb product={product} />
      <div className="pt-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${category === "ops" ? "bg-[#0B0F0E] text-white" : "bg-[#E6F8F5] text-[#12846F]"}`}>{productBadge(product)}</span>
          <span className="truncate text-[11px] font-medium text-black/35">{productTagline(product)}</span>
        </div>
        <h3 className="line-clamp-2 min-h-[2.8em] break-keep text-[15px] font-semibold leading-[1.4] tracking-tight text-[#0B0F0E] md:text-[16px]">{product.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[2.9em] break-keep text-[12px] font-medium leading-[1.45] text-black/52">{bullets.slice(0, 2).join(" · ")}</p>
        <div className="mt-2 flex flex-wrap items-end gap-1.5">
          {product.price > 0 && <span className="pb-0.5 text-[12px] font-semibold text-red-500">VAT 포함</span>}
          <span className="text-[21px] font-bold tracking-tight text-[#0B0F0E]">{priceLabel(product.price)}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-black/38">{product.delivery_info}</p>
      </div>
    </Link>
  );
}

export default function StorePage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [products, setProducts] = useState<StoreProduct[]>(FULL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("all");

  const visibleProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => productCategory(product) === activeCategory);
  }, [activeCategory, products]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("store_products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          setProducts(data.map((item) => normalizeProduct(item as Partial<StoreProduct>)));
        }
      } catch (err) {
        console.error("스토어 상품 로딩 에러:", err);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <main className="min-h-screen bg-white text-[#0B0F0E]">
      <section className="border-b border-black/10 bg-[#F7F8F7]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-5 py-8 sm:px-6 md:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#0B0F0E] p-7 text-white md:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#21c1a2]">Turnkeyhaus Store</p>
            <h1 className="mt-4 max-w-[13ch] break-keep text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[50px]">채널 운영 상품을 확인하세요.</h1>
            <p className="mt-5 max-w-[58ch] break-keep text-[15px] font-medium leading-[1.75] text-white/68 md:text-[17px]">
              무료 자료, 유료 진단 리포트, 90일 플래너, 운영대행 착수금을 상품별 상세페이지에서 확인하고 결제할 수 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["카드결제", "PDF 산출물", "채널 진단", "운영대행 착수금"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/76">{item}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            <Link href="/store/tier-report" className={`rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${focusRing}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#21c1a2]">Best</p>
              <h2 className="mt-3 break-keep text-[22px] font-bold leading-tight">운영 진단 리포트</h2>
              <p className="mt-2 text-[13px] font-medium text-black/45">3영업일 이내 PDF 제공</p>
              <p className="mt-5 text-[25px] font-bold">490,000원</p>
            </Link>
            <Link href="/store/tier-planner" className={`rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${focusRing}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#21c1a2]">Special</p>
              <h2 className="mt-3 break-keep text-[22px] font-bold leading-tight">90일 채널 전략 플래너</h2>
              <p className="mt-2 text-[13px] font-medium text-black/45">3개월 로드맵·피드백</p>
              <p className="mt-5 text-[25px] font-bold">297,000원</p>
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
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${focusRing} ${activeCategory === category.value ? "border-[#21c1a2] bg-[#21c1a2] text-[#07211d]" : "border-black/10 bg-white text-black/55 hover:bg-black/[0.03]"}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#21c1a2]">오늘 선택 가능한 상품</p>
            <h2 className="mt-2 text-[24px] font-bold tracking-tight md:text-[30px]">{activeCategory === "all" ? "전체 상품" : CATEGORY_OPTIONS.find((item) => item.value === activeCategory)?.label}</h2>
          </div>
          <p className="text-[13px] font-medium text-black/38">총 {visibleProducts.length}개</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
