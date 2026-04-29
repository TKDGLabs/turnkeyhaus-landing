import { NextResponse } from "next/server";
import { getStoreProductByAmount } from "@/lib/store-products";

type PortOnePayment = {
  paymentId?: string;
  orderName?: string;
  status?: string;
  currency?: string;
  amount?: {
    total?: number;
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";

    if (!paymentId) {
      return NextResponse.json({ status: "fail", message: "결제 정보를 확인할 수 없습니다." }, { status: 400 });
    }

    const apiSecret = process.env.PORTONE_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json(
        { status: "fail", message: "결제 확인 설정을 점검 중입니다. 담당자에게 문의해 주세요." },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
      method: "GET",
      headers: {
        "Authorization": `PortOne ${apiSecret}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const failed = await response.text();
      console.error("Payment lookup failed:", failed.slice(0, 300));
      return NextResponse.json(
        { status: "fail", message: "결제 내역을 확인하지 못했습니다. 담당자에게 문의해 주세요." },
        { status: response.status }
      );
    }

    const payment = (await response.json()) as PortOnePayment;
    const paidAmount = payment.amount?.total;
    const matchedProduct = typeof paidAmount === "number" ? getStoreProductByAmount(paidAmount) : undefined;

    if (payment.status !== "PAID") {
      return NextResponse.json(
        { status: "fail", message: "결제 완료 상태가 아닙니다.", paymentStatus: payment.status ?? "UNKNOWN" },
        { status: 400 }
      );
    }

    if (typeof paidAmount !== "number") {
      return NextResponse.json({ status: "fail", message: "결제 금액 정보를 확인할 수 없습니다." }, { status: 400 });
    }

    if (!matchedProduct) {
      return NextResponse.json(
        { status: "fail", message: "등록된 상품 금액과 일치하지 않는 결제입니다." },
        { status: 400 }
      );
    }

    if (payment.currency && !payment.currency.endsWith("KRW")) {
      return NextResponse.json(
        { status: "fail", message: "지원하지 않는 통화 결제입니다.", currency: payment.currency },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        paymentId,
        paidAmount,
        orderName: payment.orderName ?? matchedProduct.name,
        productId: matchedProduct.id,
        productName: matchedProduct.name
      }
    });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return NextResponse.json({ status: "fail", message: "결제 확인 중 문제가 발생했습니다." }, { status: 500 });
  }
}
