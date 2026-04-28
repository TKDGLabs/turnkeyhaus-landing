import { Suspense } from "react";
import StoreResultClient from "./result-client";

export default function StoreResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[760px] px-5 py-16 text-[#0B0F0E] sm:px-6 md:py-24">
          <p className="text-[16px] leading-[1.85] text-black/70">결제 상태를 확인하고 있습니다. 잠시만 기다려 주세요.</p>
        </main>
      }
    >
      <StoreResultClient />
    </Suspense>
  );
}

