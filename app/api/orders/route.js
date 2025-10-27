import { metadata } from "@/app/layout";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const SHIPPING_FEE = 5;
const APP_ID = "vendoor";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const { addressId, items, couponCode, paymentMethod } =
      await request.json();

    // Check if all required fields are present
    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_ORDER_DETAILS },
        { status: 400 }
      );
    }

    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });
      if (!coupon) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COUPON_NOT_FOUND },
          { status: 400 }
        );
      }
    }

    // Check if coupon is applicable for new users
    if (couponCode && coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COUPON_FOR_NEW_USERS },
          { status: 400 }
        );
      }
    }

    const isPlusMember = has({ plan: "plus" });

    // Check if coupon is applicable for members
    if (couponCode && coupon.forMember) {
      if (!isPlusMember) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COUPON_FOR_MEMBERS },
          { status: 400 }
        );
      }
    }

    // Group orders by storeId using a Map
    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({ ...item, price: product.price });
    }

    let orderIds = [];
    let fullAmount = 0;

    let isShippingFeeAdded = false;

    // Create orders for each seller
    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      if (couponCode) {
        total -= (total * coupon.discount) / 100;
      }
      if (!isPlusMember && !isShippingFeeAdded) {
        total += SHIPPING_FEE;
        isShippingFeeAdded = true;
      }

      fullAmount += parseFloat(total.toFixed(2));

      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          total: parseFloat(total.toFixed(2)),
          paymentMethod,
          isCouponUsed: coupon ? true : false,
          coupon: coupon ? coupon : {},
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      orderIds.push(order.id);
    }

    if (paymentMethod === "STRIPE") {
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const origin = await request.headers.get("origin");

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
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Current time + 30 minutes
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

    // Clear the cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json({ message: "Orders Placed Successfully" });
  } catch (error) {
    console.error("[Orders POST] Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// Get all orders for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] },
        ],
      },
      include: { orderItems: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[Orders GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
