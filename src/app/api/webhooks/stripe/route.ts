import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { stripe } from "@/shared/lib/payment/stripe";
import { prisma } from "@/shared/lib/db";
import { createLogger } from "@/shared/lib/utils";
import type Stripe from "stripe";

const logger = createLogger("stripe-webhook");

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
  } catch (error) {
    logger.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      logger.info("Payment successful:", {
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

        // Revalidate order pages để UI update
        revalidatePath("/orders");
        for (const orderId of orderIds) {
          revalidatePath(`/orders/${orderId}`);
        }

        logger.info(`Updated ${orderIds.length} orders to PENDING status`);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      logger.warn("Checkout session expired:", session.id);

      const orderIds = session.metadata?.orderIds?.split(",") || [];
      if (orderIds.length > 0) {
        logger.info(`Checkout expired for orders: ${orderIds.join(", ")}`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logger.error("Payment failed:", paymentIntent.id);
      break;
    }

    default:
      logger.debug(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
