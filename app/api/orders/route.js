import { metadata } from "@/app/layout";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { orderService } from "@/core/services/orderService";
import { cartService } from "@/core/services/cartService";
import { handleError } from "@/errors/errorHandler";
import { UnauthorizedError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/AppError";
import { validateData } from "@/core/validation/validateData";
import { createOrderSchema } from "@/core/validations/schemas";

const APP_ID = "vendoor";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const body = await request.json();

    // ✨ Validation với Zod - tự động check tất cả rules
    // Nếu data không hợp lệ, sẽ throw ValidationError
    const { addressId, items, couponCode, paymentMethod } = validateData(
      createOrderSchema,
      body
    );

    const isPlusMember = has({ plan: "plus" });

    // Create orders using service
    const orders = await orderService.createOrder(
      userId,
      { cart: items, couponCode, address: addressId, paymentMethod },
      isPlusMember
    );

    // Handle Stripe payment
    if (paymentMethod === "STRIPE") {
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const origin = request.headers.get("origin");

      // Calculate total amount
      const fullAmount = orders.reduce((sum, order) => sum + order.total, 0);
      const orderIds = orders.map((o) => o.id);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: "Order",
              },
              unit_amount: Math.round(fullAmount * 100),
            },
            quantity: 1,
          },
        ],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        success_url: `${origin}/loading?nextUrl=orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
          orderIds: orderIds.join(","),
          userId,
          appId: APP_ID,
        },
      });

      return NextResponse.json({ session });
    }

    // Clear cart for COD orders
    await cartService.clearCart(userId);

    return NextResponse.json({ message: "Orders Placed Successfully" });
  } catch (error) {
    return handleError(error, "Orders POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const orders = await orderService.getUserOrders(userId);

    return NextResponse.json({ orders });
  } catch (error) {
    return handleError(error, "Orders GET");
  }
}
