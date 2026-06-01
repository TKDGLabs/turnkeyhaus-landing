"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

type CompleteState = {
  status: "loading" | "success" | "error";
  message: string;
  orderNo?: string;
};

function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const startedRef = useRef(false);
  const [state, setState] = useState<CompleteState>({
    status: "loading",
    message: "결제 결과를 확인하고 있습니다."
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    async function completePayment() {
      const orderNo = searchParams.get("orderNo") || searchParams.get("order_no") || "";
      const paymentId = searchParams.get("paymentId") || searchParams.get("payment_id") || "";
      const code = searchParams.get("code");
      const message = searchParams.get("message");

      if (code) {
        setState({
          status: "error",
          orderNo,
          message: message || "결제가 취소되었거나 실패했습니다."
        });
        return;
      }

      if (!orderNo || !paymentId) {
        setState({
          status: "error",
          orderNo,
          message: "결제 승인 정보를 찾을 수 없습니다. 결제는 되었는데 이 화면이 보이면 문의해 주세요."
        });
        return;
      }

      try {
        const {
          data: { session }
        } = supabase ? await supabase.auth.getSession() : { data: { session: null } };

        const response = await fetch("/api/store/payments/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
          },
          body: JSON.stringify({ orderNo, paymentId })
        });

        // 🚨 Vercel TS strict mode 완벽 방어 코드 🚨
        let payload: any = null;
        try {
          payload = await response.json();
        } catch (_e) {
          payload = null;
        }

        if (!response.ok) {
          throw new Error(payload?.message || "결제 검증에 실패했습니다.");
        }

        setState({
          status: "success",
          orderNo,
          message:
            payload?.status === "awaiting_deposit"
              ? "입금 대기 상태로 주문이 생성되었습니다. 입금 확인 후 서비스가 진행됩니다."
              : "결제가 정상적으로 완료되었습니다."
        });
      } catch (error) {
        setState({
          status: "error",
          orderNo,
          message: error instanceof Error ? error.message : "결제 검증 중 문제가 발생했습니다."
        });
      }
    }

    completePayment();
  }, [searchParams, supabase]);

  const isSuccess = state.status === "success";
  const isLoading = state.status === "loading";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col items-center justify-center px-5 py-20 text-center text-[#0B0F0E]">
      <div className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm md:p-12">
        <div
          className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${
            isLoading ? "bg-black/5 text-black/35" : isSuccess ? "bg-[#E6F8F5] text-[#169B82]" : "bg-red-50 text-red-500"
          }`}
        >
          {isLoading ? "…" : isSuccess ? "✓" : "!"}
        </div>

        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[#21c1a2]">Payment Result</p>
        <h1 className="text-[28px] font-bold tracking-tight md:text-[36px]">
          {isLoading ? "결제 확인 중" : isSuccess ? "결제 완료" : "결제 확인 필요"}
        </h1>
        <p className="mx-auto mt-4 max-w-[48ch] break-keep text-[15px] font-medium leading-relaxed text-black/60">{state.message}</p>

        {state.orderNo && (
          <div className="mt-6 rounded-xl border border-black/10 bg-[#FAFAFA] p-4 text-left">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-black/35">주문번호</p>
            <p className="mt-1 font-mono text-[14px] font-bold text-[#0B0F0E]">{state.orderNo}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/store" className={`flex h-12 flex-1 items-center justify-center rounded-xl border border-black/15 text-[14px] font-bold text-black/60 hover:bg-black/5 ${focusRing}`}>
            스토어로 돌아가기
          </Link>
          <Link href="/contact" className={`flex h-12 flex-1 items-center justify-center rounded-xl bg-[#21c1a2] text-[14px] font-bold text-[#07211d] hover:bg-[#1db197] ${focusRing}`}>
            문의하기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function StorePaymentCompletePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-black/50">결제 결과를 불러오는 중...</div>}>
      <PaymentCompleteContent />
    </Suspense>
  );
}
