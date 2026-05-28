import { NextResponse } from "next/server";
import { createStorePaymentId } from "@/lib/payments/portone";
import { getStoreProductById } from "@/lib/store-products";

export const runtime = "nodejs";

const PAY_METHODS = new Set(["CARD", "TRANSFER", "MOBILE", "GIFT_CERTIFICATE", "EASY_PAY"]);

type PaymentDraftBody = {
  productId?: string;
  payMethod?: string;
  companyName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerRole?: string;
  zipcode?: string;
  addressLine1?: string;
  addressLine2?: string;
  businessRegistrationNumber?: string;
  userId?: string | null;
  loginEmail?: string | null;
};

function sanitizeDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildCustomerId({
  phone,
  businessNumber,
  email
}: {
  phone: string;
  businessNumber: string;
  email: string;
}) {
  const businessDigits = sanitizeDigits(businessNumber);
  if (businessDigits) return `biz-${businessDigits}`.slice(0, 20);

  const phoneDigits = sanitizeDigits(phone);
  if (phoneDigits) return `hp-${phoneDigits.slice(-11)}`.slice(0, 20);

  const emailSlug = email.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (emailSlug) return `em-${emailSlug.slice(0, 16)}`.slice(0, 20);

  return `guest-${Date.now().toString().slice(-8)}`;
}

function getRequestOrigin(request: Request) {
  const urlOrigin = new URL(request.url).origin;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return urlOrigin;

  const protocol = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function getPublicPortOneConfig() {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();

  if (!storeId || !channelKey) return null;
  return { storeId, channelKey };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentDraftBody;
    const productId = trimString(body.productId);
    const payMethod = trimString(body.payMethod) || "CARD";
    const product = getStoreProductById(productId);

    if (!product) {
      return NextResponse.json({ status: "fail", message: "선택된 상품 정보를 찾을 수 없습니다." }, { status: 400 });
    }

    if (!PAY_METHODS.has(payMethod)) {
      return NextResponse.json({ status: "fail", message: "지원하지 않는 결제수단입니다." }, { status: 400 });
    }

    const customerName = trimString(body.customerName);
    const customerPhone = sanitizeDigits(trimString(body.customerPhone));
    const customerEmail = trimString(body.customerEmail);

    if (!customerName) {
      return NextResponse.json({ status: "fail", message: "이름을 입력해 주세요." }, { status: 400 });
    }

    if (customerPhone.length < 9) {
      return NextResponse.json({ status: "fail", message: "전화번호를 정확히 입력해 주세요." }, { status: 400 });
    }

    const portOneConfig = getPublicPortOneConfig();
    if (!portOneConfig || !process.env.PORTONE_API_SECRET?.trim()) {
      return NextResponse.json(
        { status: "fail", message: "결제창 설정을 확인 중입니다. 담당자에게 문의해 주세요." },
        { status: 500 }
      );
    }

    const paymentId = createStorePaymentId(product.id);
    const origin = getRequestOrigin(request);
    const companyName = trimString(body.companyName);
    const customerRole = trimString(body.customerRole);
    const zipcode = trimString(body.zipcode);
    const addressLine1 = trimString(body.addressLine1);
    const addressLine2 = trimString(body.addressLine2);
    const businessRegistrationNumber = sanitizeDigits(trimString(body.businessRegistrationNumber));
    const userId = trimString(body.userId);
    const loginEmail = trimString(body.loginEmail) || customerEmail;
    const customerId = buildCustomerId({
      phone: customerPhone,
      businessNumber: businessRegistrationNumber,
      email: customerEmail
    });
    const address = addressLine1
      ? {
          addressLine1,
          addressLine2: addressLine2 || "-"
        }
      : undefined;

    return NextResponse.json({
      status: "success",
      data: {
        paymentId,
        request: {
          ...portOneConfig,
          paymentId,
          orderName: product.name,
          totalAmount: product.price,
          currency: "KRW",
          payMethod,
          customer: {
            customerId,
            fullName: customerName,
            phoneNumber: customerPhone,
            email: customerEmail || undefined,
            address,
            zipcode: zipcode || undefined
          },
          products: [
            {
              id: product.id,
              name: product.name,
              amount: product.price,
              quantity: 1,
              code: product.galaxiaItemCode
            }
          ],
          storeDetails: {
            businessName: companyName || undefined,
            businessRegistrationNumber: businessRegistrationNumber || undefined,
            address: [addressLine1, addressLine2].filter(Boolean).join(" ") || undefined,
            zipcode: zipcode || undefined,
            contactName: customerRole || undefined,
            phoneNumber: customerPhone,
            email: customerEmail || undefined
          },
          customData: {
            userId: userId || null,
            loginEmail: loginEmail || null,
            productId: product.id,
            companyName: companyName || null,
            customerRole: customerRole || null,
            businessRegistrationNumber: businessRegistrationNumber || null,
            requestedCashReceipt: Boolean(businessRegistrationNumber),
            address: {
              zipcode: zipcode || null,
              addressLine1: addressLine1 || null,
              addressLine2: addressLine2 || null
            }
          },
          bypass: {
            galaxia: {
              ITEM_CODE: product.galaxiaItemCode
            }
          },
          alipayPlus: {},
          noticeUrls: [`${origin}/api/portone/webhook`],
          redirectUrl: `${origin}/store/result`,
          forceRedirect: true
        }
      }
    });
  } catch (error) {
    console.error("Payment Draft Error:", error);
    return NextResponse.json({ status: "fail", message: "결제 요청을 준비하는 중 문제가 발생했습니다." }, { status: 500 });
  }
}
