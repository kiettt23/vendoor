import prisma from "@/server/db/prisma";
import next from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      sig || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    const handlePaymentIntent = async (
      paymentIntentId: string,
      isPaid: boolean
    ) => {
      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const metadata = session.data[0].metadata || {};
      const { orderIds, userId, appId } = metadata as {
        orderIds: string;
        userId: string;
        appId: string;
      };

      if (appId !== "vendoor") {
        return NextResponse.json({ received: true, message: "Invalid appId" });
      }
      const orderIdsArray = orderIds.split(",");

      if (isPaid) {
        // mark order as paid
        await Promise.all(
          orderIdsArray.map(
            async (orderId: string) =>
              await prisma.order.update({
                where: { id: orderId },
                data: { isPaid: true },
              })
          )
        );
        // delete cart from user
        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        });
      } else {
        // delete orders from db
        await Promise.all(
          orderIdsArray.map(
            async (orderId: string) =>
              await prisma.order.delete({
                where: { id: orderId },
              })
          )
        );
      }
    };

    switch (event.type) {
      case "payment_intent.succeeded": {
        await handlePaymentIntent(event.data.object.id, true);
        break;
      }

      case "payment_intent.canceled": {
        await handlePaymentIntent(event.data.object.id, false);
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
