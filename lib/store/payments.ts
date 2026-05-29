import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PayMethod = "CARD" | "TRANSFER";
export type StoreProductType = "SINGLE" | "SUBSCRIPTION";

export type StoreProductRecord = {
  id: string;
  type: StoreProductType;
  name: string;
  summary: string | null;
  price: number;
  delivery_info: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  hero_image_url?: string | null;
  detail_image_urls?: string[] | null;
  detail_markdown?: string | null;
  cta_label?: string | null;
};

type StoreOrderRecord = {
  id: string;
  order_no: string;
  user_id: string;
  product_id: string;
  product_name: string;
  amount: number;
  status: string;
  payment_id: string | null;
};

type PortOnePayment = {
  id?: string;
  paymentId?: string;
  status?: string;
  amount?: {
    total?: number;
    paid?: number;
    cancelled?: number;
  };
  orderName?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: unknown;
  method?: unknown;
  customer?: unknown;
  [key: string]: unknown;
};

export function getPortOnePublicConfig() {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();

  if (!storeId || !channelKey) {
    throw new Error("Missing NEXT_PUBLIC_PORTONE_STORE_ID or NEXT_PUBLIC_PORTONE_CHANNEL_KEY");
  }

  return { storeId, channelKey };
}

export function getPortOneApiSecret() {
  const secret = process.env.PORTONE_API_SECRET?.trim();
  if (!secret) throw new Error("Missing PORTONE_API_SECRET");
  return secret;
}

export function createOrderNo() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  return `TKH-${datePart}-${randomPart}`;
}

export function createPaymentId(orderNo: string) {
  return `tkh-${orderNo.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

export function normalizeOrderName(product: Pick<StoreProductRecord, "id" | "name" | "type">) {
  const textEncoder = new TextEncoder();
  if (textEncoder.encode(product.name).length <= 40) return product.name;

  if (product.id === "tier-report") return "운영 진단 리포트";
  if (product.id === "tier-planner") return "90일 채널 전략 플래너";
  if (product.id === "tier-ebook") return "브랜드 유튜브 전자책";
  if (product.type === "SUBSCRIPTION") return "유튜브 운영대행 착수금";

  return "턴키하우스 서비스";
}

export async function fetchActiveStoreProduct(productId: string): Promise<StoreProductRecord | null> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("store_products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as StoreProductRecord | null;
}

export async function fetchPortOnePayment(paymentId: string): Promise<PortOnePayment> {
  const response = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: {
      Authorization: `PortOne ${getPortOneApiSecret()}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`PortOne payment lookup failed: ${response.status} ${message}`);
  }

  return (await response.json()) as PortOnePayment;
}

function readPortOneTotalAmount(payment: PortOnePayment): number | null {
  const total = payment.amount?.total ?? payment.amount?.paid;
  return typeof total === "number" && Number.isFinite(total) ? total : null;
}

function readPortOnePaidAt(payment: PortOnePayment): string | null {
  return typeof payment.paidAt === "string" ? payment.paidAt : null;
}

function orderStatusFromPortOneStatus(status?: string) {
  switch (status) {
    case "PAID":
      return "paid";
    case "VIRTUAL_ACCOUNT_ISSUED":
      return "awaiting_deposit";
    case "FAILED":
      return "failed";
    case "CANCELLED":
    case "PARTIAL_CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}

async function recordPaymentEvent(params: {
  orderId?: string | null;
  orderNo?: string | null;
  paymentId?: string | null;
  eventType: string;
  payload: unknown;
}) {
  const supabase = createSupabaseAdminClient();

  await supabase.from("store_payment_events").insert({
    order_id: params.orderId ?? null,
    order_no: params.orderNo ?? null,
    payment_id: params.paymentId ?? null,
    event_type: params.eventType,
    payload: params.payload
  });
}

async function grantPaidEntitlement(order: StoreOrderRecord) {
  const supabase = createSupabaseAdminClient();

  await supabase.from("store_entitlements").upsert(
    {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      status: "active",
      granted_at: new Date().toISOString()
    },
    { onConflict: "user_id,product_id,order_id" }
  );
}

export async function syncPortOnePaymentToOrder(params: {
  orderNo?: string;
  paymentId: string;
  eventType?: string;
}) {
  const supabase = createSupabaseAdminClient();

  let query = supabase.from("store_orders").select("*");
  if (params.orderNo) {
    query = query.eq("order_no", params.orderNo);
  } else {
    query = query.eq("payment_id", params.paymentId);
  }

  const { data: orderData, error: orderError } = await query.maybeSingle();

  if (orderError) throw new Error(orderError.message);
  if (!orderData) throw new Error("주문 정보를 찾을 수 없습니다.");

  const order = orderData as StoreOrderRecord;

  if (order.payment_id && order.payment_id !== params.paymentId) {
    await recordPaymentEvent({
      orderId: order.id,
      orderNo: order.order_no,
      paymentId: params.paymentId,
      eventType: "payment_id_mismatch",
      payload: { expected: order.payment_id, received: params.paymentId }
    });
    throw new Error("주문 결제 ID와 포트원 결제 ID가 일치하지 않습니다.");
  }

  const payment = await fetchPortOnePayment(params.paymentId);
  const paidAmount = readPortOneTotalAmount(payment);
  const portOneStatus = typeof payment.status === "string" ? payment.status : "UNKNOWN";

  await recordPaymentEvent({
    orderId: order.id,
    orderNo: order.order_no,
    paymentId: params.paymentId,
    eventType: params.eventType ?? `portone_${portOneStatus.toLowerCase()}`,
    payload: payment
  });

  if (paidAmount !== order.amount) {
    await supabase
      .from("store_orders")
      .update({
        status: "amount_mismatch",
        updated_at: new Date().toISOString()
      })
      .eq("id", order.id);

    throw new Error("결제 금액이 주문 금액과 일치하지 않습니다.");
  }

  const nextStatus = orderStatusFromPortOneStatus(portOneStatus);
  const paidAt = readPortOnePaidAt(payment);

  await supabase.from("store_payments").upsert(
    {
      order_id: order.id,
      order_no: order.order_no,
      user_id: order.user_id,
      payment_id: params.paymentId,
      status: portOneStatus,
      amount: paidAmount,
      payment_method: payment.paymentMethod ?? payment.method ?? null,
      raw_response: payment,
      paid_at: paidAt
    },
    { onConflict: "payment_id" }
  );

  await supabase
    .from("store_orders")
    .update({
      status: nextStatus,
      payment_id: params.paymentId,
      paid_at: nextStatus === "paid" ? paidAt ?? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", order.id);

  if (nextStatus === "paid") {
    await grantPaidEntitlement(order);
  }

  return {
    orderNo: order.order_no,
    paymentId: params.paymentId,
    status: nextStatus,
    amount: paidAmount
  };
}
