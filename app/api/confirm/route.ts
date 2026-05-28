import { NextResponse } from "next/server";
import { verifyStorePayment } from "@/lib/payments/portone";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    const verification = await verifyStorePayment(paymentId);

    if (!verification.ok) {
      return NextResponse.json(
        {
          status: "fail",
          message: verification.message,
          paymentStatus: verification.paymentStatus,
          currency: verification.currency
        },
        { status: verification.status }
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        paymentId,
        paidAmount: verification.data.paidAmount,
        orderName: verification.data.orderName,
        productId: verification.data.product.id,
        productName: verification.data.product.name
      }
    });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return NextResponse.json({ status: "fail", message: "결제 확인 중 문제가 발생했습니다." }, { status: 500 });
  }
}
