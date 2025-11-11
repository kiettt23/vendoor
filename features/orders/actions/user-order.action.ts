"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import type { Coupon, CouponActionResponse } from "@/types";
import {
  orderSchema,
  couponCodeSchema,
  type OrderFormData,
  type CouponCodeFormData,
} from "@/lib/validations";
import { APP_CONFIG } from "@/configs/app";

interface OrderResponse {
  success: boolean;
  message: string;
  session?: any;
  order?: any;
}

// Get all orders for the current user
export async function getOrders() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      // Only show paid orders (COD or successful Stripe payments)
      OR: [
        { paymentMethod: "COD" },
        { AND: [{ paymentMethod: "STRIPE" }, { isPaid: true }] },
      ],
    },
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

  // Parse coupon JSON for each order
  const ordersWithParsedCoupon = orders.map((order) => {
    let parsedCoupon = order.coupon;

    // Handle both string (old orders) and object (Prisma default)
    if (typeof order.coupon === "string") {
      try {
        parsedCoupon = JSON.parse(order.coupon);
      } catch (e) {
        console.error("Failed to parse coupon:", e);
        parsedCoupon = null;
      }
    }

    // If coupon is empty object {}, set to null for cleaner UI
    if (
      parsedCoupon &&
      typeof parsedCoupon === "object" &&
      Object.keys(parsedCoupon).length === 0
    ) {
      parsedCoupon = null;
    }

    return {
      ...order,
      coupon: parsedCoupon,
    };
  });

  return ordersWithParsedCoupon;
}

// Alias for backward compatibility
export { getOrders as getUserOrders };

// Apply a coupon code
export async function applyCoupon(code: string): Promise<CouponActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
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

    // Check if user has any orders (for forNewUser check)
    const userOrderCount = await prisma.order.count({
      where: { userId: user.id },
    });

    const isNewUser = userOrderCount === 0;

    // TODO: Implement Plus membership feature
    // Option 1: Add `isPlusMember` field to User model
    // Option 2: Create separate Membership table
    const isPlusMember = false; // Temporary: Always false until membership is implemented

    // Check forNewUser restriction
    if (coupon.forNewUser && !isNewUser) {
      return {
        success: false,
        error: "Mã giảm giá này chỉ dành cho người dùng mới",
      };
    }

    // Check forMember restriction
    if (coupon.forMember && !isPlusMember) {
      return {
        success: false,
        error: "Mã giảm giá này chỉ dành cho thành viên Plus",
      };
    }

    // Check if public or user-specific
    if (!coupon.isPublic) {
      // User already retrieved from getCurrentUser()
      // No need to query again
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
    const user = await getCurrentUser();
    if (!user) {
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

    if (!address || address.userId !== user.id) {
      throw new Error("Địa chỉ không hợp lệ");
    }

    // Calculate total and collect all items in a single order
    let totalPrice = 0;
    const allItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }> = [];
    let mainStoreId = "";

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

      // Use first product's store as main store
      if (!mainStoreId) {
        mainStoreId = product.storeId;
      }

      allItems.push({
        productId,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    // Apply coupon if provided
    let coupon = null;
    if (couponCode) {
      const couponResult = await applyCoupon(couponCode);
      coupon = couponResult.coupon;
    }

    // Apply coupon discount
    let finalTotal = totalPrice;
    if (coupon) {
      finalTotal = finalTotal - (finalTotal * coupon.discount) / 100;
    }

    // Create single order for all items
    const order = await prisma.order.create({
      data: {
        total: finalTotal,
        userId: user.id,
        storeId: mainStoreId,
        addressId,
        paymentMethod,
        isPaid: paymentMethod === "STRIPE",
        isCouponUsed: !!coupon,
        coupon: coupon || null,
        orderItems: {
          create: allItems,
        },
      },
    });

    const createdOrders = [order];

    // Handle Stripe payment
    if (paymentMethod === "STRIPE") {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

      // Get base URL from Better Auth config (server-side only)
      const baseUrl = process.env.BETTER_AUTH_URL;
      const successUrl = `${baseUrl}/orders?success=true`;
      const cancelUrl = `${baseUrl}/cart?canceled=true`;

      // Calculate total amount with coupon and shipping
      // TODO: Implement Plus membership feature
      const isPlusMember = false; // Temporary: Always false until membership is implemented

      let subtotal = 0;
      for (const item of items) {
        subtotal += item.price * item.quantity;
      }

      // Apply discount
      const discountAmount = coupon ? (coupon.discount / 100) * subtotal : 0;

      // Add shipping fee (free for Plus members)
      const shippingFee = isPlusMember ? 0 : APP_CONFIG.SHIPPING_FEE;

      // Calculate final total
      const finalTotal = subtotal + shippingFee - discountAmount;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name:
                  "Tổng đơn hàng" +
                  (coupon ? ` (Mã giảm giá: ${coupon.code})` : ""),
              },
              unit_amount: Math.round(finalTotal),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderIds: createdOrders.map((order) => order.id).join(","),
          userId: user.id,
          appId: "vendoor",
        },
      });

      return {
        success: true,
        message: "Redirecting to payment...",
        session,
      };
    }

    // Clear cart for COD orders only (Stripe cart cleared via webhook)
    await prisma.user.update({
      where: { id: user.id },
      data: { cart: {} },
    });

    revalidatePath("/cart");
    revalidatePath("/orders");

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
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized: Please sign in");
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
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
