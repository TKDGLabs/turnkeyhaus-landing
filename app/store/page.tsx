'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// PG사 심사용 임시 상품 데이터 (나중에 DB로 교체할 수 있습니다)
const products = [
  {
    id: 'tier-1',
    name: '구조 세팅형 (월 정기결제)',
    price: 3800000,
    description: '채널 포지셔닝 설계 및 기본 전환 동선 세팅',
    features: ['월 1회 촬영', '채널 포지셔닝 설계', '롱폼/숏폼 구조화'],
  },
  {
    id: 'tier-2',
    name: '구조 성장형 (월 정기결제)',
    price: 4800000,
    description: 'SEO 기반 콘텐츠 설계 및 숏폼 자산화',
    features: ['월 1~2회 촬영', 'SEO 기반 콘텐츠 설계', '월간 운영 분석 리포트'],
  },
  {
    id: 'tier-3',
    name: '단건 기획/촬영 프로젝트',
    price: 1500000,
    description: '단발성 브랜딩 영상 기획 및 촬영',
    features: ['사전 기획 회의', '현장 디렉팅', '최종본 편집 및 납품'],
  }
];

export default function StorePage() {
  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price);

  const handlePaymentClick = (productName: string) => {
    alert(`${productName} 결제 모듈 연동 대기 중입니다. (PG 심사용)`);
    // 추후 여기에 토스페이먼츠/포트원 결제창 띄우는 코드가 들어갑니다.
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-20 text-[#0B0F0E]">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">서비스 결제 및 상품 안내</h1>
        <p className="text-black/60">티케이디지랩스의 콘텐츠 제작 및 채널 운영대행 상품입니다.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-black/15 bg-white p-6 rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-black/60 mb-6 h-10">{product.description}</p>
            
            <div className="text-2xl font-bold text-[#21c1a2] mb-6">
              {formatPrice(product.price)}원 <span className="text-sm font-normal text-black/50">(VAT 별도)</span>
            </div>

            <ul className="text-sm text-black/70 space-y-2 mb-8 flex-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>

            <button 
              onClick={() => handlePaymentClick(product.name)}
              className="w-full py-3.5 bg-[#0B0F0E] text-white font-semibold rounded-lg hover:bg-black/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]"
            >
              결제하기
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-black/10 pt-8 text-center text-sm text-black/60">
        <p>상품 및 결제 관련 문의: 0507-1463-3664 | contact@tkdglabs.com</p>
      </div>
    </main>
  );
}
