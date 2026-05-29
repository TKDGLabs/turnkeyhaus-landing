import { NextResponse } from "next/server";
import { Webhook } from "@portone/server-sdk";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { syncPortOnePaymentToOrder } from "@/lib/store/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function collectWebhookSecrets() {
  const secrets = [
    process.env.PORTONE_WEBHOOK_SECRET,
    process.env.PORTONE_WEBHOOK_SECRET_TEST,
    ...(process.env.PORTONE_WEBHOOK_SECRETS?.split(",") ?? [])
  ]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  return Array.from(new Set(secrets));
}

async function verifyWebhookPayload(payload: string, request: Request) {
  const secrets = collectWebhookSecrets();

  if (secrets.length === 0) {
    // 로컬 개발 환경용. 프로덕션에서는 PORTONE_WEBHOOK_SECRET을 반드시 설정하세요.
    return JSON.parse(payload) as Record<string, unknown>;
  }

  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? ""
  };

  let lastError: unknown = null;

  for (const secret of secrets) {
    try {
      return (await Webhook.verify(secret, payload, headers)) as Record<string, unknown>;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Invalid PortOne webhook signature");
}

function getNestedString(value: unknown, path: string[]) {
  let current: unknown = value;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) return null;
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : null;
}

function extractPaymentId(webhook: Record<string, unknown>) {
  return (
    getNestedString(webhook, ["data", "paymentId"]) ||
    getNestedString(webhook, ["data", "payment", "id"]) ||
    getNestedString(webhook, ["data", "payment", "paymentId"]) ||
    getNestedString(webhook, ["data", "customData", "paymentId"]) ||
    null
  );
}

function extractOrderNo(webhook: Record<string, unknown>) {
  return (
    getNestedString(webhook, ["data", "customData", "orderNo"]) ||
    getNestedString(webhook, ["data", "orderNo"]) ||
    null
  );
}

export async function POST(request: Request) {
  const payload = await request.text();

  try {
    const webhook = await verifyWebhookPayload(payload, request);
    const eventType = typeof webhook.type === "string" ? webhook.type : "unknown";
    const paymentId = extractPaymentId(webhook);
    const orderNo = extractOrderNo(webhook);

    const supabase = createSupabaseAdminClient();
    await supabase.from("store_payment_events").insert({
      order_no: orderNo,
      payment_id: paymentId,
      event_type: `webhook:${eventType}`,
      payload: webhook
    });

    if (!paymentId) {
      return NextResponse.json({ received: true, ignored: "missing_payment_id" });
    }

    const result = await syncPortOnePaymentToOrder({
      orderNo: orderNo ?? undefined,
      paymentId,
      eventType: `webhook:${eventType}`
    });

    return NextResponse.json({ received: true, result });
  } catch (error) {
    console.error("[store/payments/webhook] failed", error);
    return NextResponse.json(
      {
        received: false,
        message: error instanceof Error ? error.message : "웹훅 처리 중 문제가 발생했습니다."
      },
      { status: 400 }
    );
  }
}
