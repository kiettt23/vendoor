import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripe } from "@/shared/lib/payment/stripe";
import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import { createLogger } from "@/shared/lib/utils";
import { APP_URL } from "@/shared/lib/constants";

const logger = createLogger("stripe-checkout");

interface CheckoutRequest {
  orderIds: string[];
  amount: number;
  customerEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const body: CheckoutRequest = await request.json();
    const { orderIds, customerEmail } = body;

    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json({ error: "Không có đơn hàng" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        customerId: session.user.id,
      },
      include: {
        items: true,
        vendor: { select: { shopName: true } },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const lineItems = orders.flatMap((order) =>
      order.items.map((item) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name: `${item.productName}${
              item.variantName ? ` - ${item.variantName}` : ""
            }`,
            description: `Đơn hàng: ${order.orderNumber} - ${order.vendor.shopName}`,
          },
          unit_amount: Math.round(item.price), // VND không có decimal
        },
        quantity: item.quantity,
      }))
    );

    const totalShipping = orders.reduce((sum, o) => sum + o.shippingFee, 0);
    if (totalShipping > 0) {
      lineItems.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Phí vận chuyển",
            description: `${orders.length} đơn hàng`,
          },
          unit_amount: Math.round(totalShipping),
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${APP_URL}/orders?success=true&session_id={CHECKOUT_SESSION_ID}&orders=${orderIds.join(
        ","
      )}`,
      cancel_url: `${APP_URL}/checkout?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        userId: session.user.id,
        orderIds: orderIds.join(","),
      },
      locale: "vi",
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    logger.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Không thể tạo phiên thanh toán" },
      { status: 500 }
    );
  }
}
