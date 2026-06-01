import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getAuthenticatedUser } from "@/lib/supabase/admin";
import { syncPortOnePaymentToOrder } from "@/lib/store/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CompleteBody = {
  orderNo?: string;
  paymentId?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function sanitizeText(value: unknown, maxLength = 200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    // 🚨 Vercel 에러 해결: 깐깐한 타입 검사를 우회하는 안전한 try-catch 블록으로 변경
    let body: CompleteBody | null = null;
    try {
      body = await request.json();
    } catch (_error: unknown) {
      body = null;
    }

    if (!body) return jsonError("요청 본문이 올바르지 않습니다.");

    const orderNo = sanitizeText(body.orderNo, 80);
    const paymentId = sanitizeText(body.paymentId, 160);

    if (!orderNo || !paymentId) return jsonError("orderNo와 paymentId가 필요합니다.");

    const supabase = createSupabaseAdminClient();
    const user = await getAuthenticatedUser(request);

    const { data: order, error: orderError } = await supabase
      .from("store_orders")
      .select("id, user_id, order_no, payment_id")
      .eq("order_no", orderNo)
      .maybeSingle();

    if (orderError) throw new Error(orderError.message);
    if (!order) return jsonError("주문 정보를 찾을 수 없습니다.", 404);

    if (user && order.user_id !== user.id) {
      return jsonError("본인의 주문만 결제 완료 처리할 수 있습니다.", 403);
    }

    if (order.payment_id && order.payment_id !== paymentId) {
      return jsonError("결제 ID가 주문 정보와 일치하지 않습니다.", 400);
    }

    const result = await syncPortOnePaymentToOrder({
      orderNo,
      paymentId,
      eventType: "browser_complete"
    });

    if (!["paid", "awaiting_deposit"].includes(result.status)) {
      return jsonError(`결제가 아직 완료되지 않았습니다. 현재 상태: ${result.status}`, 409);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[store/payments/complete] failed", error);
    const message = error instanceof Error ? error.message : "결제 검증 중 문제가 발생했습니다.";
    return jsonError(message, 500);
  }
}
