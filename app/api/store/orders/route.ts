import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getAuthenticatedUser } from "@/lib/supabase/admin";
import {
  createOrderNo,
  createPaymentId,
  fetchActiveStoreProduct,
  getPortOnePublicConfig,
  normalizeOrderName,
  type PayMethod
} from "@/lib/store/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateOrderBody = {
  productId?: string;
  payMethod?: PayMethod;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  channelUrl?: string;
  companyName?: string;
  businessRegistrationNumber?: string;
  taxInvoiceRequested?: boolean;
  consents?: {
    terms?: boolean;
    privacy?: boolean;
    refund?: boolean;
    penalty?: boolean;
  };
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function sanitizeText(value: unknown, maxLength = 200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeUrl(value: unknown) {
  const text = sanitizeText(value, 500);
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return text;
}

function normalizePayMethod(value: unknown): PayMethod {
  return value === "TRANSFER" ? "TRANSFER" : "CARD";
}

function buildRedirectUrl(orderNo: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const base = origin.replace(/\/$/, "");
  return `${base}/store/payment/complete?orderNo=${encodeURIComponent(orderNo)}`;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return jsonError("로그인이 필요합니다.", 401);

    const body = (await request.json().catch(() => null)) as CreateOrderBody | null;
    if (!body) return jsonError("요청 본문이 올바르지 않습니다.");

    const productId = sanitizeText(body.productId, 80);
    const product = productId ? await fetchActiveStoreProduct(productId) : null;
    if (!product) return jsonError("판매 중인 상품을 찾을 수 없습니다.", 404);

    const customerName = sanitizeText(body.customerName, 80);
    const customerPhone = sanitizeText(body.customerPhone, 40);
    const customerEmail = sanitizeText(body.customerEmail || user.email || "", 120);
    const channelUrl = sanitizeUrl(body.channelUrl);
    const companyName = sanitizeText(body.companyName, 120);
    const businessRegistrationNumber = sanitizeText(body.businessRegistrationNumber, 40);
    const payMethod = normalizePayMethod(body.payMethod);
    const consents = body.consents ?? {};

    if (!customerName || !customerPhone) {
      return jsonError("담당자명과 전화번호를 입력해 주세요.");
    }

    if (!consents.privacy) {
      return jsonError("개인정보 처리방침 동의가 필요합니다.");
    }

    if (product.price > 0 && !consents.terms) {
      return jsonError("환불 및 이용약관 동의가 필요합니다.");
    }

    if (product.type === "SUBSCRIPTION" && !consents.penalty) {
      return jsonError("운영대행 약정 및 해지 규정 동의가 필요합니다.");
    }

    const supabase = createSupabaseAdminClient();
    const orderNo = createOrderNo();
    const paymentId = product.price > 0 ? createPaymentId(orderNo) : null;
    const productSnapshot = {
      id: product.id,
      type: product.type,
      name: product.name,
      summary: product.summary,
      price: product.price,
      delivery_info: product.delivery_info,
      hero_image_url: product.hero_image_url ?? null,
      detail_image_urls: product.detail_image_urls ?? []
    };

    const { data: order, error: insertError } = await supabase
      .from("store_orders")
      .insert({
        order_no: orderNo,
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_snapshot: productSnapshot,
        amount: product.price,
        currency: "KRW",
        status: product.price === 0 ? "paid" : "pending",
        payment_id: paymentId,
        pay_method: product.price > 0 ? payMethod : null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        channel_url: channelUrl,
        company_name: companyName,
        business_registration_number: businessRegistrationNumber,
        tax_invoice_requested: Boolean(body.taxInvoiceRequested),
        consents: {
          terms: Boolean(consents.terms),
          privacy: Boolean(consents.privacy),
          refund: Boolean(consents.refund || consents.terms),
          penalty: Boolean(consents.penalty),
          consented_at: new Date().toISOString()
        },
        paid_at: product.price === 0 ? new Date().toISOString() : null
      })
      .select("*")
      .single();

    if (insertError) throw new Error(insertError.message);

    if (product.price === 0) {
      await supabase.from("store_entitlements").upsert(
        {
          user_id: user.id,
          product_id: product.id,
          order_id: order.id,
          status: "active",
          granted_at: new Date().toISOString()
        },
        { onConflict: "user_id,product_id,order_id" }
      );

      return NextResponse.json({
        orderNo,
        amount: 0,
        status: "paid"
      });
    }

    const { storeId, channelKey } = getPortOnePublicConfig();
    const orderName = normalizeOrderName(product);

    return NextResponse.json({
      orderNo,
      amount: product.price,
      paymentId,
      status: "pending",
      paymentRequest: {
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount: product.price,
        currency: "CURRENCY_KRW",
        payMethod,
        redirectUrl: buildRedirectUrl(orderNo),
        customer: {
          fullName: customerName,
          phoneNumber: customerPhone,
          email: customerEmail
        },
        products: [
          {
            id: product.id,
            name: product.name,
            amount: product.price,
            quantity: 1,
            tag: product.type === "SUBSCRIPTION" ? "ops_deposit" : "single_payment"
          }
        ],
        customData: {
          orderNo,
          productId: product.id,
          userId: user.id,
          productType: product.type
        }
      }
    });
  } catch (error) {
    console.error("[store/orders] failed", error);
    const message = error instanceof Error ? error.message : "주문 생성 중 문제가 발생했습니다.";
    return jsonError(message, 500);
  }
}
