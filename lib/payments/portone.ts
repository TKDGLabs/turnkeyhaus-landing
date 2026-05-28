import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getStoreProductById, type StoreProduct, type StoreProductId } from "@/lib/store-products";

const PAYMENT_ID_PREFIX = "tkd";
const SIGNATURE_LENGTH = 10;

export type PortOnePayment = {
  paymentId?: string;
  orderName?: string;
  status?: string;
  currency?: string;
  amount?: {
    total?: number;
  };
};

export type VerifiedStorePayment = {
  paymentId: string;
  paidAmount: number;
  orderName: string;
  product: StoreProduct;
  payment: PortOnePayment;
};

export type StorePaymentVerificationResult =
  | { ok: true; data: VerifiedStorePayment }
  | { ok: false; status: number; message: string; paymentStatus?: string; currency?: string };

function getPaymentIdSecret() {
  return process.env.PORTONE_PAYMENT_ID_SECRET?.trim() || process.env.PORTONE_API_SECRET?.trim() || "";
}

function getPortOneApiSecret() {
  return process.env.PORTONE_API_SECRET?.trim() || "";
}

function signPaymentIdPayload(payload: string) {
  const secret = getPaymentIdSecret();
  if (!secret) {
    throw new Error("PORTONE_PAYMENT_ID_SECRET or PORTONE_API_SECRET is required.");
  }

  return createHmac("sha256", secret).update(payload).digest("base64url").slice(0, SIGNATURE_LENGTH);
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function createStorePaymentId(productId: StoreProductId) {
  const timestamp = Date.now().toString(36);
  const nonce = randomUUID().replace(/-/g, "").slice(0, 8);
  const signature = signPaymentIdPayload(`${productId}.${timestamp}.${nonce}`);

  return `${PAYMENT_ID_PREFIX}-${productId}-${timestamp}-${nonce}-${signature}`;
}

export function parseStorePaymentId(paymentId: string) {
  const parts = paymentId.split("-");
  if (parts.length < 6 || parts[0] !== PAYMENT_ID_PREFIX) return null;

  const signature = parts.at(-1);
  const nonce = parts.at(-2);
  const timestamp = parts.at(-3);
  const productId = parts.slice(1, -3).join("-");

  if (!signature || !nonce || !timestamp || !productId) return null;

  const expectedSignature = signPaymentIdPayload(`${productId}.${timestamp}.${nonce}`);
  if (!safeEqual(signature, expectedSignature)) return null;

  return { productId, timestamp, nonce };
}

export async function fetchPortOnePayment(paymentId: string): Promise<PortOnePayment> {
  const apiSecret = getPortOneApiSecret();
  if (!apiSecret) {
    throw new Error("PORTONE_API_SECRET is required.");
  }

  const response = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: {
      Authorization: `PortOne ${apiSecret}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const failed = await response.text();
    console.error("Payment lookup failed:", failed.slice(0, 300));
    throw new Error(`PortOne payment lookup failed with ${response.status}.`);
  }

  return (await response.json()) as PortOnePayment;
}

export async function verifyStorePayment(paymentId: string): Promise<StorePaymentVerificationResult> {
  if (!paymentId.trim()) {
    return { ok: false, status: 400, message: "결제 정보를 확인할 수 없습니다." };
  }

  let parsedPaymentId: ReturnType<typeof parseStorePaymentId>;
  try {
    parsedPaymentId = parseStorePaymentId(paymentId);
  } catch (error) {
    console.error("Payment ID verification is not configured:", error);
    return { ok: false, status: 500, message: "결제 확인 설정을 점검 중입니다. 담당자에게 문의해 주세요." };
  }

  if (!parsedPaymentId) {
    return { ok: false, status: 400, message: "유효하지 않은 결제 요청입니다." };
  }

  const product = getStoreProductById(parsedPaymentId.productId);
  if (!product) {
    return { ok: false, status: 400, message: "등록되지 않은 상품 결제입니다." };
  }

  let payment: PortOnePayment;
  try {
    payment = await fetchPortOnePayment(paymentId);
  } catch {
    return { ok: false, status: 502, message: "결제 내역을 확인하지 못했습니다. 담당자에게 문의해 주세요." };
  }

  const paidAmount = payment.amount?.total;

  if (payment.status !== "PAID") {
    return {
      ok: false,
      status: 400,
      message: "결제 완료 상태가 아닙니다.",
      paymentStatus: payment.status ?? "UNKNOWN"
    };
  }

  if (typeof paidAmount !== "number") {
    return { ok: false, status: 400, message: "결제 금액 정보를 확인할 수 없습니다." };
  }

  if (paidAmount !== product.price) {
    return { ok: false, status: 400, message: "등록된 상품 금액과 일치하지 않는 결제입니다." };
  }

  if (payment.currency && payment.currency !== "KRW") {
    return {
      ok: false,
      status: 400,
      message: "지원하지 않는 통화 결제입니다.",
      currency: payment.currency
    };
  }

  return {
    ok: true,
    data: {
      paymentId,
      paidAmount,
      orderName: payment.orderName ?? product.name,
      product,
      payment
    }
  };
}
