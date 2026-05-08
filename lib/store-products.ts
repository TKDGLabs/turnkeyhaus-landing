export type StoreProductId = "tier-1" | "tier-2" | "tier-3";

export type StoreProduct = {
  id: StoreProductId;
  name: string;
  summary: string;
  price: number;
  galaxiaItemCode: string;
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "tier-1",
    name: "운영 진단 리포트",
    summary: "현재 채널 + 경쟁 채널 3개 + 주제 20개 + 3개월 검증 운영표",
    price: 490_000,
    galaxiaItemCode: "TKDH001"
  },
  {
    id: "tier-2",
    name: "Managed Starter 운영 착수금",
    summary: "3개월 운영 시작 전 업종/촬영환경 확인 후 계약 범위에 맞춰 정산되는 착수금",
    price: 1_500_000,
    galaxiaItemCode: "TKDH002"
  },
  {
    id: "tier-3",
    name: "인하우스 시스템 구축 진단",
    summary: "장비·인력·워크플로우·템플릿·채용 실무평가 기준을 확인하는 프로젝트 사전 진단",
    price: 500_000,
    galaxiaItemCode: "TKDH003"
  }
];

export function getStoreProductById(productId: string) {
  return STORE_PRODUCTS.find((item) => item.id === productId);
}

export function getStoreProductByAmount(amount: number) {
  return STORE_PRODUCTS.find((item) => item.price === amount);
}
