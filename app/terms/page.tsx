import React from 'react';

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-20 text-[#0B0F0E]">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      <div className="space-y-8 text-sm leading-relaxed text-black/80">
        <p>
          본 약관은 <strong>티케이디지랩스 주식회사</strong>(이하 "회사")가 제공하는 브랜딩 콘텐츠 제작 및 유튜브 채널 운영대행 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정합니다.
        </p>

        <section>
          <h2 className="text-lg font-bold mb-2 text-[#0B0F0E]">제1조 (결제 및 요금 체계)</h2>
          <p>
            1. 서비스 이용 요금은 <strong>단건 결제</strong>와 <strong>정기결제(구독형)</strong> 방식으로 구분됩니다.<br />
            2. 구체적인 결제 금액은 서비스의 범위, 작업 난이도 및 투입 인력 등에 따라 <strong>클라이언트별 개별 계약(또는 별도 합의된 견적서)에 따라 상이하게 책정</strong>됩니다.<br />
            3. 회원은 회사와 합의한 결제 일자 및 방식에 따라 요금을 지급해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2 text-[#0B0F0E]">제2조 (정기결제 서비스의 특약)</h2>
          <p>
            1. 정기결제는 회원이 등록한 결제 수단을 통해 매월 자동 청구되는 방식입니다.<br />
            2. <strong>계약기간 준수 의무:</strong> 개별 계약을 통해 약정 기간을 설정한 경우, 회원은 해당 기간을 준수해야 합니다.<br />
            3. <strong>중도 해지 및 위약금:</strong> 약정된 계약기간을 미준수하여 해지를 요청할 경우, <strong>계약서상 명시된 위약금 또는 잔여 기간에 대한 손해배상금을 전액 결제한 후</strong>에만 정기결제를 해지할 수 있습니다.<br />
            4. <strong>임의 취소 권한:</strong> 회사는 클라이언트와 별도의 서면 계약을 체결하지 않고 발생한 정기결제 건이나 서비스 목적에 부합하지 않는 결제 건에 대하여 <strong>사전 통지 없이 임의로 결제를 취소하고 환불 처리</strong>를 할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2 text-[#0B0F0E]">제3조 (서비스 이용 및 제한)</h2>
          <p>
            1. 회사는 결제가 확인된 시점부터 계약된 서비스를 개시합니다.<br />
            2. 회원이 요금을 체납하거나 약관을 위반하는 경우, 회사는 서비스 제공을 일시 중단하거나 계약을 해지할 수 있으며 이로 인한 손해에 대해서는 회사가 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2 text-[#0B0F0E]">제4조 (기타 사항)</h2>
          <p>
            본 약관에 명시되지 않은 사항은 회사와 클라이언트 간에 체결한 개별 계약서의 내용을 우선하며, 계약서에도 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.
          </p>
        </section>
        
        <p className="pt-10 text-xs text-black/50">공고일자: 2026년 04월 24일 / 시행일자: 2026년 04월 24일</p>
      </div>
    </main>
  );
}
