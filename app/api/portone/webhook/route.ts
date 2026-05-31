import { NextResponse } from "next/server";
import { Webhook } from "@portone/server-sdk";
import { verifyStorePayment } from "@/lib/payments/portone";

export const runtime = "nodejs";

function getWebhookSecrets() {
  const secrets = new Set<string>();

  const directSecrets = [
    process.env.PORTONE_WEBHOOK_SECRET,
    process.env.PORTONE_WEBHOOK_SECRET_TEST
  ];
  directSecrets.forEach((secret) => {
    if (secret?.trim()) secrets.add(secret.trim());
  });

  const csvSecrets = process.env.PORTONE_WEBHOOK_SECRETS?.split(",") ?? [];
  csvSecrets.forEach((secret) => {
    if (secret.trim()) secrets.add(secret.trim());
  });

  return [...secrets];
}

function toHeaderRecord(headers: Headers) {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

type PaymentWebhookData = {
  paymentId?: string;
};

function getPaymentIdFromWebhook(data: unknown) {
  if (!data || typeof data !== "object") return undefined;
  const candidate = (data as PaymentWebhookData).paymentId;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : undefined;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ ok: false, message: "empty webhook payload" }, { status: 400 });
    }

    const secrets = getWebhookSecrets();
    if (secrets.length === 0) {
      return NextResponse.json(
        { ok: false, message: "webhook secret not configured" },
        { status: 500 }
      );
    }

    const headers = toHeaderRecord(request.headers);

    let webhook:
      | Awaited<ReturnType<typeof Webhook.verify>>
      | undefined;
    for (const secret of secrets) {
      try {
        webhook = await Webhook.verify(secret, rawBody, headers);
        break;
      } catch {
        continue;
      }
    }

    if (!webhook) {
      return NextResponse.json({ ok: false, message: "invalid webhook signature" }, { status: 400 });
    }

    const paymentId = getPaymentIdFromWebhook((webhook as { data?: unknown }).data);

    if (paymentId) {
      // 웹훅 payload 자체를 신뢰하지 않고 결제 조회로 상태/금액/상품을 다시 확인합니다.
      const verification = await verifyStorePayment(paymentId);
      if (verification.ok === false) {
        console.warn("PortOne webhook payment verification skipped:", {
          paymentId,
          message: verification.message,
          paymentStatus: verification.paymentStatus
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PortOne Webhook Error:", error);
    return NextResponse.json({ ok: false, message: "internal error" }, { status: 500 });
  }
}
