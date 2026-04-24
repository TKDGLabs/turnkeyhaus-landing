'use client';

import React, { useState } from 'react';
import Script from 'next/script';

const products = [
  { id: 'tier-1', name: '구조 세팅형 (월 정기결제)', price: 3800000 },
  { id: 'tier-2', name: '구조 성장형 (월 정기결제)', price: 4800000 },
  { id: 'tier-3', name: '단건 기획/촬영 프로젝트', price: 1500000 }
];

export default function StorePage() {
  const [checkoutItem, setCheckoutItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // 1. 포트원 V2 라이브러리 확인
    const PortOne = (window as any).PortOne;
    if (!PortOne) {
      alert('결제 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      setLoading(false);
      return;
    }

    try {
      // 2. 포트원 V2 결제 요청
      const paymentId = `order_${new Date().getTime()}`;
      const response = await PortOne.requestPayment({
        storeId: "여기에_포트원_관리자콘솔에서_확인한_Store_ID_입력", // 예: store-1234-5678
        channelKey: "여기에_채널_키_입력", // 관리자 콘솔 -> 결제연동에서 확인 가능
        paymentId: paymentId,
        orderName: checkoutItem.name,
        totalAmount: checkoutItem.price,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          fullName: "비회원 고객",
          phoneNumber: "010-0000-0000",
          email: "contact@tkdglabs.com",
        },
      });

      // 결제창에서 오류가 난 경우
      if (response.code !== undefined) {
        alert(`결제 실패: ${response.message}`);
        setLoading(false);
        return;
      }

      // 3. 우리 서버 API(/api/confirm)로 결제 검증 요청
      const validation = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: response.paymentId,
          amount: checkoutItem.price
        }),
      });

      const result = await validation.json();

      if (result.status === 'success') {
        alert('결제 및 검증이 완료되었습니다!');
        window.location.href = '/store?status=success';
      } else {
        alert(`검증 실패: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('결제 진행 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-20 text-[#0B0F0E]">
      {/* 포트원 V2 SDK 로드 */}
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="lazyOnload" />
      
      <h1 className="text-3xl font-bold mb-10 text-center">서비스 결제 (PortOne V2)</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-black/15 p-6 rounded-xl flex flex-col shadow-sm">
            <h2 className="text-lg font-bold mb-4">{product.name}</h2>
            <div className="text-xl font-bold text-[#21c1a2] mb-6">
              {product.price.toLocaleString()}원
            </div>
            <button 
              onClick={() => setCheckoutItem(product)}
              className="w-full py-3 bg-[#0B0F0E] text-white font-semibold rounded-lg hover:bg-black/80"
            >
              선택하기
            </button>
          </div>
        ))}
      </div>

      {checkoutItem && (
        <div className="mt-12 p-8 border border-[#21c1a2] rounded-2xl bg-[#21c1a2]/5">
          <h2 className="text-xl font-bold mb-4">주문 확인: {checkoutItem.name}</h2>
          <p className="mb-6 text-black/70">비회원 결제로 진행됩니다. 아래 버튼을 눌러 결제를 완료해주세요.</p>
          <button 
            onClick={handleProcessPayment}
            disabled={loading}
            className="w-full py-4 bg-[#21c1a2] text-white font-bold text-lg rounded-xl hover:bg-[#1db197] disabled:bg-gray-400"
          >
            {loading ? '처리 중...' : `${checkoutItem.price.toLocaleString()}원 결제하기`}
          </button>
        </div>
      )}
    </main>
  );
}
}
