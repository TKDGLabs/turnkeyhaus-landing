export type StoreProductId = "tier-1" | "tier-2" | "tier-3";

export type StoreProduct = {
  id: StoreProductId;
  name: string;
  summary: string;
  price: number;
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "tier-1",
    name: "구조 세팅형 (월 운영 시작)",
    summary: "채널 구조 진단 + 월간 편성/제작 운영",
    price: 3_800_000
  },
  {
    id: "tier-2",
    name: "구조 성장형 (월 운영 확장)",
    summary: "세팅형 포함 + 성과 고도화 루프 강화",
    price: 4_800_000
  },
  {
    id: "tier-3",
    name: "단건 기획/촬영 프로젝트",
    summary: "캠페인성 단건 콘텐츠 제작",
    price: 1_500_000
  }
];

export function getStoreProductById(productId: string) {
  return STORE_PRODUCTS.find((item) => item.id === productId);
}

export function getStoreProductByAmount(amount: number) {
  return STORE_PRODUCTS.find((item) => item.price === amount);
}

