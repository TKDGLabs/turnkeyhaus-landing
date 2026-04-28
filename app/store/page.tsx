"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { STORE_PRODUCTS, StoreProductId } from "@/lib/store-products";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

export default function StorePage() {
  const [selectedProductId, setSelectedProductId] = useState<StoreProductId>("tier-1");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => STORE_PRODUCTS.find((item) => item.id === selectedProductId),
    [selectedProductId]
  );

  async function handleProcessPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    if (!selectedProduct) {
      setError("선택된 상품 정보를 찾을 수 없습니다.");
      return;
    }

    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
    const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();
    if (!storeId || !channelKey) {
      setError("결제 환경 변수가 누락되었습니다. NEXT_PUBLIC_PORTONE_STORE_ID / NEXT_PUBLIC_PORTONE_CHANNEL_KEY를 확인해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const paymentId = `tkdh-${selectedProduct.id}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const redirectUrl = `${window.location.origin}/store/result`;

      sessionStorage.setItem(
        "turnkeyhaus:last-payment",
        JSON.stringify({
          paymentId,
          productId: selectedProduct.id,
          amount: selectedProduct.price,
          productName: selectedProduct.name
        })
      );

      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName: selectedProduct.name,
        totalAmount: selectedProduct.price,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          fullName: customerName || undefined,
          phoneNumber: customerPhone || undefined,
          email: customerEmail || undefined
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
    <main className="mx-auto w-full max-w-[1120px] px-5 py-14 text-[#0B0F0E] sm:px-6 md:py-20">
      <div className="mb-10 space-y-4 border-b border-black/10 pb-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 서비스 결제 ]</p>
        <h1 className="text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[48px]">포트원 결제로 바로 결제하기</h1>
        <p className="max-w-[70ch] break-keep text-[16px] leading-[1.8] text-black/68">
          결제 완료 후 자동 검증을 거쳐 접수됩니다. 카드 결제가 완료되면 결과 페이지에서 결제 상태를 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
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
                <p className="mt-4 text-[26px] font-semibold tracking-tight text-[#0B0F0E]">
                  {product.price.toLocaleString("ko-KR")}원
                </p>
              </button>
            );
          })}
        </section>

        <aside className="border border-black/15 bg-white p-6 md:p-7">
          <h2 className="text-[24px] font-semibold tracking-tight">결제 정보 입력</h2>
          <p className="mt-2 text-[14px] leading-[1.75] text-black/60">
            고객 정보는 결제 확인 및 후속 안내 용도로만 사용됩니다.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleProcessPayment}>
            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">이름(선택)</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="홍길동"
                className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">연락처(선택)</span>
              <input
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="010-1234-5678"
                className={`h-11 w-full border border-black/16 px-3 text-[15px] text-[#0B0F0E] placeholder:text-black/35 ${focusRing}`}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-black/58">이메일(선택)</span>
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="hello@company.com"
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
            <p>- 카드 결제 완료 후 서버 검증이 자동 진행됩니다.</p>
            <p>- 환불/취소 기준은 아래 정책 문서를 따릅니다.</p>
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
    </main>
  );
}
