/**
 * Stripe Checkout Session API
 *
 * Creates a Stripe Checkout session for payment
 *
 * POST /api/checkout/stripe
 * Body: { orderIds: string[], amount: number, customerEmail: string }
 */

import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { stripe } from "@/shared/lib/payment/stripe";
import { auth } from "@/shared/lib";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib";

interface CheckoutRequest {
  orderIds: string[];
  amount: number;
  customerEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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

    // Fetch orders with items
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

    // Create line items from orders
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

    // Add shipping fees
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

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/orders?success=true&session_id={CHECKOUT_SESSION_ID}&orders=${orderIds.join(
        ","
      )}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/checkout?canceled=true`,
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
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Không thể tạo phiên thanh toán" },
      { status: 500 }
    );
  }
}
