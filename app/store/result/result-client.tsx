"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerificationState = "loading" | "success" | "fail";

type VerifyResponse = {
  status: "success" | "fail";
  message?: string;
  data?: {
    paymentId: string;
    paidAmount: number;
    orderName: string;
    productId: string;
    productName: string;
  };
};

type LastPaymentDraft = {
  paymentId?: string;
  payMethod?: string;
  companyName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerRole?: string;
  zipcode?: string;
  addressLine1?: string;
  addressLine2?: string;
  businessRegistrationNumber?: string;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

export default function StoreResultClient() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const failCode = searchParams.get("code");
  const failMessage = searchParams.get("message");

  const [state, setState] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [result, setResult] = useState<VerifyResponse["data"]>();
  const [lastPaymentDraft, setLastPaymentDraft] = useState<LastPaymentDraft | null>(null);

  const decodedFailMessage = useMemo(
    () => (failMessage ? decodeURIComponent(failMessage) : ""),
    [failMessage]
  );

  useEffect(() => {
    const raw = sessionStorage.getItem("turnkeyhaus:last-payment");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as LastPaymentDraft;
      setLastPaymentDraft(parsed);
    } catch {
      setLastPaymentDraft(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
      if (failCode) {
        setState("fail");
        setErrorMessage(decodedFailMessage || "결제가 취소되었거나 실패했습니다.");
        return;
      }

      if (!paymentId) {
        setState("fail");
        setErrorMessage("결제 식별값(paymentId)을 찾을 수 없습니다.");
        return;
      }

      try {
        setState("loading");
        const response = await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
        const payload = (await response.json()) as VerifyResponse;

        if (cancelled) return;

        if (response.ok && payload.status === "success" && payload.data) {
          setResult(payload.data);
          setState("success");
          return;
        }

        setState("fail");
        setErrorMessage(payload.message ?? "결제 검증에 실패했습니다.");
      } catch (error) {
        console.error(error);
        if (cancelled) return;
        setState("fail");
        setErrorMessage("결제 검증 중 오류가 발생했습니다.");
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [decodedFailMessage, failCode, paymentId]);

  return (
    <main className="mx-auto w-full max-w-[760px] px-5 py-16 text-[#0B0F0E] sm:px-6 md:py-24">
      <p className="text-xs font-semibold tracking-[0.14em] text-black/48">[ 결제 결과 ]</p>
      <h1 className="mt-3 text-[34px] font-semibold leading-[1.2] tracking-tight md:text-[44px]">
        {state === "success" ? "결제가 정상 접수되었습니다." : state === "loading" ? "결제 상태를 확인하고 있습니다." : "결제 확인이 필요합니다."}
      </h1>

      <section className="mt-8 border border-black/15 bg-white p-6 md:p-8">
        {state === "loading" ? (
          <p className="text-[16px] leading-[1.85] text-black/70">포트원 결제 내역을 검증 중입니다. 잠시만 기다려 주세요.</p>
        ) : null}

        {state === "success" && result ? (
          <div className="space-y-5">
            <p className="text-[16px] leading-[1.85] text-black/72">
              결제가 완료되었고, 서버 검증까지 정상 처리되었습니다. 담당자가 입력하신 연락처 기준으로 후속 안내를 드립니다.
            </p>

            <dl className="divide-y divide-black/12 border-y border-black/12">
              <div className="grid grid-cols-[110px_1fr] gap-3 py-3 text-[15px]">
                <dt className="text-black/55">결제 번호</dt>
                <dd className="break-all font-semibold text-[#0B0F0E]">{result.paymentId}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 py-3 text-[15px]">
                <dt className="text-black/55">상품명</dt>
                <dd className="font-semibold text-[#0B0F0E]">{result.productName}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 py-3 text-[15px]">
                <dt className="text-black/55">결제 금액</dt>
                <dd className="font-semibold text-[#0B0F0E]">{result.paidAmount.toLocaleString("ko-KR")}원</dd>
              </div>
            </dl>

            {lastPaymentDraft ? (
              <dl className="divide-y divide-black/10 border-y border-black/10 text-[14px]">
                <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                  <dt className="text-black/52">상호명</dt>
                  <dd className="text-[#0B0F0E]">{lastPaymentDraft.companyName || "-"}</dd>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                  <dt className="text-black/52">담당자</dt>
                  <dd className="text-[#0B0F0E]">
                    {[lastPaymentDraft.customerName, lastPaymentDraft.customerRole].filter(Boolean).join(" / ") || "-"}
                  </dd>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                  <dt className="text-black/52">연락처</dt>
                  <dd className="text-[#0B0F0E]">{lastPaymentDraft.customerPhone || "-"}</dd>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                  <dt className="text-black/52">주소</dt>
                  <dd className="text-[#0B0F0E]">
                    {[lastPaymentDraft.zipcode, lastPaymentDraft.addressLine1, lastPaymentDraft.addressLine2]
                      .filter(Boolean)
                      .join(" ") || "-"}
                  </dd>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                  <dt className="text-black/52">사업자번호</dt>
                  <dd className="text-[#0B0F0E]">{lastPaymentDraft.businessRegistrationNumber || "-"}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        ) : null}

        {state === "fail" ? (
          <p className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-[15px] leading-[1.8] text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/store"
          className={`inline-flex h-11 items-center border border-black/18 px-5 text-[14px] font-semibold text-black/75 transition-colors hover:bg-black/[0.03] ${focusRing}`}
        >
          결제 페이지로 돌아가기
        </Link>
        <Link
          href="/#contact"
          className={`inline-flex h-11 items-center border border-[#21c1a2] bg-[#21c1a2] px-5 text-[14px] font-semibold text-[#07211d] transition-colors hover:bg-[#1db197] ${focusRing}`}
        >
          상담 채널로 이동
        </Link>
      </div>
    </main>
  );
}
