import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripe } from "@/shared/lib/payment/stripe";
import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import { createLogger } from "@/shared/lib/utils";
import { APP_URL } from "@/shared/lib/constants";

const logger = createLogger("stripe-resume");

interface ResumePaymentRequest {
  orderId: string;
}

/**
 * Resume Stripe payment cho order PENDING_PAYMENT
 * Customer có thể quay lại thanh toán nếu trước đó chưa hoàn tất
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const body: ResumePaymentRequest = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        customerId: session.user.id,
        status: "PENDING_PAYMENT",
      },
      include: {
        items: true,
        vendor: { select: { shopName: true } },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng hoặc đơn hàng đã được thanh toán" },
        { status: 404 }
      );
    }

    if (order.payment?.method !== "STRIPE") {
      return NextResponse.json(
        { error: "Đơn hàng không sử dụng phương thức thanh toán Stripe" },
        { status: 400 }
      );
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: `${item.productName}${item.variantName ? ` - ${item.variantName}` : ""}`,
          description: `Đơn hàng: ${order.orderNumber} - ${order.vendor.shopName}`,
        },
        unit_amount: Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    if (order.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Phí vận chuyển",
            description: order.orderNumber,
          },
          unit_amount: Math.round(order.shippingFee),
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${APP_URL}/orders/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/orders/${orderId}?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        orderIds: orderId,
      },
      locale: "vi",
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    logger.error("Stripe resume payment error:", error);
    return NextResponse.json(
      { error: "Không thể tạo phiên thanh toán" },
      { status: 500 }
    );
  }
}
