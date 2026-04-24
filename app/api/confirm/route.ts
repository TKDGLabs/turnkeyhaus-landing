import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { paymentId, amount } = await request.json();

    // 1. Vercel Environments에 저장한 시크릿 키를 가져옵니다.
    const apiSecret = process.env.PORTONE_API_SECRET;

    // 2. 포트원 V2 API를 통해 실제 결제 내역을 조회합니다.
    const response = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      method: "GET",
      headers: {
        "Authorization": `PortOne ${apiSecret}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: "포트원 결제 조회 실패" }, { status: response.status });
    }

    const payment = await response.json();

    // 3. 결제 상태와 금액을 이중 검증합니다.
    if (payment.status === "PAID" && payment.amount.total === amount) {
      return NextResponse.json({ status: "success", data: payment });
    } else {
      return NextResponse.json({ status: "fail", message: "결제 금액 불일치 또는 미결제" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return NextResponse.json({ message: "서버 내부 오류" }, { status: 500 });
  }
}
