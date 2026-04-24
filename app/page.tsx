<ContactCTA />

      {/* 여기부터 아래까지 기존 footer를 교체하세요 */}
      <footer className="border-t border-black/15 bg-white text-black/65">
        <div className={`${shell} py-10 text-xs flex flex-col md:flex-row md:justify-between gap-8`}>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#0B0F0E]">{content.footer.companyName}</div>
            {content.footer.lines.map((line) => (
              <div key={line.label}>
                {line.label}: {line.value}
              </div>
            ))}
          </div>
          
          {/* 결제 심사용 필수 정책 링크 영역 추가 */}
          <div className="flex flex-wrap gap-4 font-semibold text-black/60 md:text-right md:justify-end">
            <Link href="/terms" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              개인정보처리방침
            </Link>
            <Link href="/refund" className="hover:text-[#21c1a2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]">
              환불 정책
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
