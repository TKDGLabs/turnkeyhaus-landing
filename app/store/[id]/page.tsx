"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";
const PRODUCT_IMAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET || "product-images";

type ProductType = "SINGLE" | "SUBSCRIPTION";

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
    hero_image_url: raw.hero_image_url ?? null,
    detail_image_urls: raw.detail_image_urls ?? null,
    detail_markdown: raw.detail_markdown ?? null,
    cta_label: raw.cta_label ?? null
  };
}

function normalizeImageList(value?: string[] | string | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string" && Boolean(item));
  } catch {
    // text[]이 아닌 문자열 하나로 들어온 경우 아래에서 단일 이미지로 처리합니다.
  }
  return [value];
}

function renderDetailText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className="break-keep text-[15px] font-medium leading-[1.85] text-black/66">
        {paragraph}
      </p>
    ));
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

function StoreImage({ path, alt, className }: { path?: string | null; alt: string; className: string }) {
  const imageUrl = usePublicAssetUrl(path);

  if (!imageUrl) {
    return (
      <div className={`${className} flex items-center justify-center border border-black/5 bg-[#FAFAFA] text-[12px] font-bold uppercase tracking-[0.16em] text-black/25`}>
        Turnkeyhaus
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} loading="lazy" />;
}

function PolicyCards({ product }: { product: StoreProduct }) {
  const isSub = product.type === "SUBSCRIPTION";
  const isFree = product.price === 0;

  const cards = isFree
    ? [
        ["01", "제공 방식", "무료 신청 완료 후 해당 계정에 자료 다운로드 권한이 부여됩니다."],
        ["02", "사용 범위", "자료는 신청자 내부 검토 용도로 제공되며, 무단 재배포는 금지됩니다."],
        ["03", "문의 연결", "자료를 바탕으로 추가 상담이 필요한 경우 문의 페이지를 통해 상담을 요청할 수 있습니다."]
      ]
    : isSub
      ? [
          ["01", "상담 후 착수", "운영대행은 결제 전 상담과 계약 범위 확인을 거쳐 착수합니다."],
          ["02", "범위 확정", "촬영 횟수, 산출물 편수, 일정, 추가비용은 별도 계약서 또는 견적서 기준으로 확정됩니다."],
          ["03", "정산 기준", "착수 이후 취소·해지·환불은 실제 투입 인력과 일정 확보 비용을 기준으로 정산됩니다."]
        ]
      : [
          ["01", "자료 확인", "구매 후 채널 URL과 참고 자료를 확인한 뒤 분석 또는 플래닝 작업을 시작합니다."],
          ["02", "제공 일정", product.delivery_info || "결제 완료 후 안내된 일정에 따라 산출물을 제공합니다."],
          ["03", "환불 기준", "무형 서비스 특성상 작업 착수 또는 산출물 전송 이후에는 환불이 제한될 수 있습니다."]
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(([number, title, description]) => (
        <div key={number} className="rounded-xl border border-black/10 bg-white p-5">
          <p className="mb-2 text-[12px] font-bold text-[#21c1a2]">{number}</p>
          <h4 className="mb-2 text-[15px] font-bold text-[#0B0F0E]">{title}</h4>
          <p className="break-keep text-[13px] font-medium leading-relaxed text-black/58">{description}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const productId = params.id;

  const [product, setProduct] = useState<StoreProduct | null>(
    FULL_PRODUCTS.find((item) => item.id === productId) || null
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
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
      } catch (err) {
        console.error(err);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [supabase, productId]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B0F0E]">상품을 찾을 수 없습니다.</h1>
        <button onClick={() => router.push("/store")} className="font-bold text-[#21c1a2] hover:underline">
          스토어 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isSub = product.type === "SUBSCRIPTION";
  const isFree = product.price === 0;
  const bulletPoints = product.summary.split("\n").filter((text) => text.trim() !== "");
  const detailImages = normalizeImageList(product.detail_image_urls);
  const detailText =
    product.detail_markdown ||
    (isSub
      ? "운영대행은 상담과 계약 범위 확정 후 착수되는 월간 운영 패키지입니다. 정확한 제공 범위는 상담 및 계약서 기준으로 확정됩니다."
      : isFree
        ? "브랜드 유튜브를 처음 시작하는 전문직·기업 담당자가 채널 방향과 기본 세팅을 빠르게 잡을 수 있도록 만든 자료입니다."
        : "구매 후 채널 URL과 참고 자료를 바탕으로 분석 또는 전략 플래닝을 진행합니다.");

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <nav className="mb-8 flex items-center gap-2 text-[13px] font-bold text-black/40">
        <Link href="/store" className="transition-colors hover:text-[#21c1a2]">
          Store
        </Link>
        <span>&gt;</span>
        <span className="text-[#0B0F0E]">{product.name}</span>
      </nav>

      <div className="grid items-start gap-12 lg:grid-cols-[1fr_400px]">
        <section className="space-y-12">
          <div className="space-y-6 border-b border-black/10 pb-10">
            <span className={`inline-block rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${isSub ? "bg-[#0B0F0E] text-white" : "bg-[#E6F8F5] text-[#169B82]"}`}>
              {isSub ? "OPS DEPOSIT" : isFree ? "FREE ASSET" : "SINGLE PROJECT"}
            </span>

            <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
              <div className="space-y-4">
                <h1 className="break-keep text-[32px] font-bold leading-[1.2] tracking-tight text-[#0B0F0E] md:text-[42px]">{product.name}</h1>
                <p className="max-w-[54ch] break-keep text-[16px] font-medium leading-[1.75] text-black/60 md:text-[18px]">
                  {bulletPoints[0] || product.delivery_info}
                </p>
              </div>
              <StoreImage path={product.hero_image_url} alt={`${product.name} 대표 이미지`} className="h-56 w-full rounded-2xl object-cover" />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[22px] font-bold text-[#0B0F0E]">상세 제공 내역</h3>

            <div className="space-y-4 rounded-2xl border border-black/5 bg-[#FAFAFA] p-6 md:p-8">
              {bulletPoints.map((bullet, i) => {
                const [title, ...rest] = bullet.split("(");
                const amount = rest.length > 0 ? `(${rest.join("(")}` : "";

                return (
                  <div key={i} className="flex items-start justify-between gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isSub ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"}`} />
                      <span className="break-keep text-[15px] font-bold text-black/80">{title.trim()}</span>
                    </div>
                    {amount && <span className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-bold ${isSub ? "bg-black/10 text-black" : "bg-[#E6F8F5] text-[#21c1a2]"}`}>{amount}</span>}
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <h3 className="text-[22px] font-bold text-[#0B0F0E]">상품 설명</h3>
              <div className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 md:p-8">{renderDetailText(detailText)}</div>
            </div>

            {detailImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[22px] font-bold text-[#0B0F0E]">상세 이미지</h3>
                <div className="grid gap-4">
                  {detailImages.map((image, index) => (
                    <StoreImage key={`${image}-${index}`} path={image} alt={`${product.name} 상세 이미지 ${index + 1}`} className="max-h-[720px] w-full rounded-2xl border border-black/5 object-cover" />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 border-t border-black/10 pt-8">
              <h3 className="text-[20px] font-bold text-[#0B0F0E]">서비스 운영 기준</h3>
              <PolicyCards product={product} />
            </div>
          </div>
        </section>

        <aside className="w-full lg:sticky lg:top-32">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-xl shadow-black/[0.03]">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-widest text-black/40">{isSub ? "첫 달 착수금" : "결제 금액"}</p>
            <div className="mb-8 flex items-end gap-2 border-b border-black/10 pb-6">
              <span className="text-[36px] font-bold leading-none tracking-tight text-[#0B0F0E]">
                {isFree ? "무료" : `${product.price.toLocaleString("ko-KR")}원`}
              </span>
              {!isFree && <span className="mb-1.5 text-[14px] font-semibold text-black/40">(VAT 포함)</span>}
            </div>

            <div className="mb-8 space-y-5">
              <div>
                <p className="mb-1 text-[12px] font-bold text-black/40">서비스 제공 및 정산</p>
                <p className="break-keep text-[14px] font-bold text-[#0B0F0E]">{product.delivery_info}</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/store")}
              className={`h-14 w-full rounded-xl ${isSub ? "bg-[#0B0F0E]" : "bg-[#21c1a2]"} text-[16px] font-bold ${isSub ? "text-white" : "text-[#07211d]"} shadow-md transition-transform hover:scale-[1.02] ${focusRing}`}
            >
              {product.cta_label || (isFree ? "무료로 다운로드 받기" : "약관 확인 및 결제하러 가기")}
            </button>
            <p className="mt-4 text-center text-[12px] font-medium text-black/40">안전한 거래를 위해 회원가입 및 약관 동의가 필요합니다.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
