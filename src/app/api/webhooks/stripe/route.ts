/**
 * Stripe Webhook Handler
 *
 * Handles Stripe events like successful payments
 *
 * POST /api/webhooks/stripe
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/shared/lib/payment/stripe";
import { prisma } from "@/shared/lib";
import Stripe from "stripe";

// Disable body parsing, we need raw body for webhook verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ Payment successful:", {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });

      // Update order status to PENDING (paid)
      const orderIds = session.metadata?.orderIds?.split(",") || [];
      if (orderIds.length > 0) {
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            status: "PENDING", // Đã thanh toán, chờ xử lý
          },
        });

        // Update payment status
        const orders = await prisma.order.findMany({
          where: { id: { in: orderIds } },
          select: { paymentId: true },
        });

        const paymentIds = [
          ...new Set(orders.map((o) => o.paymentId).filter(Boolean)),
        ];
        if (paymentIds.length > 0) {
          await prisma.payment.updateMany({
            where: { id: { in: paymentIds as string[] } },
            data: {
              status: "COMPLETED",
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
            },
          });
        }

        console.log(`Updated ${orderIds.length} orders to PENDING status`);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("⏰ Checkout session expired:", session.id);

      // Revert order status to CANCELLED or keep as PENDING_PAYMENT
      const orderIds = session.metadata?.orderIds?.split(",") || [];
      if (orderIds.length > 0) {
        // Có thể giữ PENDING_PAYMENT hoặc cancel
        console.log(`Checkout expired for orders: ${orderIds.join(", ")}`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
