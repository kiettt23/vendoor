"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Coupon, CouponActionResponse } from "@/types";
import {
  orderSchema,
  couponCodeSchema,
  type OrderFormData,
  type CouponCodeFormData,
} from "@/lib/validations";

interface OrderResponse {
  success: boolean;
  message: string;
  session?: any;
  order?: any;
}

// Get all orders for the current user
export async function getOrders() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
        },
      },
      address: true,
      store: {
        select: {
          name: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

// Alias for backward compatibility
export { getOrders as getUserOrders };

// Apply a coupon code
export async function applyCoupon(code: string): Promise<CouponActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // ✅ Validate using Zod schema (Single Source of Truth)
    const validation = couponCodeSchema.safeParse({ code });
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.error.issues[0]?.message || "Mã giảm giá không hợp lệ",
      };
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: validation.data.code.toUpperCase() },
    });

    if (!coupon) {
      return { success: false, error: "Mã giảm giá không tồn tại" };
    }

    // Check expiration
    if (new Date(coupon.expiresAt) < new Date()) {
      return { success: false, error: "Mã giảm giá đã hết hạn" };
    }

    // Check if public or user-specific
    if (!coupon.isPublic) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        return {
          success: false,
          error: "Bạn không đủ điều kiện sử dụng mã này",
        };
      }
    }

    return {
      success: true,
      coupon,
    };
  } catch (error) {
    console.error("Error applying coupon:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể áp dụng mã giảm giá",
    };
  }
}

// Create a new order
export async function createOrder(
  orderData: OrderFormData
): Promise<OrderResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Vui lòng đăng nhập" };
    }

    // ✅ Validate using Zod schema (Single Source of Truth)
    const validation = orderSchema.safeParse(orderData);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ",
      };
    }

    const { addressId, items, paymentMethod, couponCode } = validation.data;

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new Error("Địa chỉ không hợp lệ");
    }

    // Calculate total for each store
    const storeOrders: Record<
      string,
      {
        items: Array<{ productId: string; quantity: number; price: number }>;
        total: number;
      }
    > = {};

    for (const item of items) {
      const productId = item.productId;

      if (!productId) {
        return {
          success: false,
          message: "Thiếu thông tin sản phẩm trong giỏ hàng",
        };
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { price: true, storeId: true, inStock: true },
      });

      if (!product || !product.inStock) {
        throw new Error("Sản phẩm không còn hàng");
      }

      if (!storeOrders[product.storeId]) {
        storeOrders[product.storeId] = {
          items: [],
          total: 0,
        };
      }

      storeOrders[product.storeId].items.push({
        productId,
        quantity: item.quantity,
        price: product.price,
      });

      storeOrders[product.storeId].total += product.price * item.quantity;
    }

    // Apply coupon if provided
    let coupon = null;
    if (couponCode) {
      const couponResult = await applyCoupon(couponCode);
      coupon = couponResult.coupon;
    }

    // Create orders for each store
    const createdOrders = [];
    for (const [storeId, orderInfo] of Object.entries(storeOrders)) {
      let total = orderInfo.total;

      // Apply coupon discount
      if (coupon) {
        total = total - (total * coupon.discount) / 100;
      }

      const order = await prisma.order.create({
        data: {
          total,
          userId,
          storeId,
          addressId,
          paymentMethod,
          isPaid: paymentMethod === "STRIPE",
          isCouponUsed: !!coupon,
          coupon: coupon ? JSON.stringify(coupon) : {},
          orderItems: {
            create: orderInfo.items,
          },
        },
      });

      createdOrders.push(order);
    }

    // Clear user cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    revalidatePath("/cart");
    revalidatePath("/orders");

    // Handle Stripe payment
    if (paymentMethod === "STRIPE") {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

      // Get base URL with protocol
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const successUrl = baseUrl.startsWith("http")
        ? `${baseUrl}/orders?success=true`
        : `https://${baseUrl}/orders?success=true`;
      const cancelUrl = baseUrl.startsWith("http")
        ? `${baseUrl}/cart?canceled=true`
        : `https://${baseUrl}/cart?canceled=true`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "vnd",
            product_data: {
              name: item.name || "Product",
            },
            unit_amount: Math.round(item.price),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return {
        success: true,
        message: "Redirecting to payment...",
        session,
      };
    }

    return {
      success: true,
      message: "Đặt hàng thành công!",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể đặt hàng"
    );
  }
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<OrderResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new Error("Không tìm thấy đơn hàng hoặc bạn không có quyền hủy");
    }

    // Only allow cancel if order is not shipped
    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      throw new Error("Không thể hủy đơn hàng đã giao hoặc đang vận chuyển");
    }

    // Update order status
    const canceledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/orders");

    return {
      success: true,
      message: "Đã hủy đơn hàng thành công!",
      order: canceledOrder,
    };
  } catch (error) {
    console.error("Error canceling order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể hủy đơn hàng"
    );
  }
}
