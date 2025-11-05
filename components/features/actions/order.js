"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function applyCoupon(code) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    if (!code) {
      return { success: false, error: "Vui lòng nhập mã giảm giá" };
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
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
      // Check if user is eligible (new user or member)
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

      // Additional checks for forNewUser, forMember can be added here
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

export async function createOrder(orderData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    const { addressId, items, paymentMethod, couponCode } = orderData;

    // Validate
    if (!addressId || !items || items.length === 0) {
      throw new Error("Thiếu thông tin đơn hàng");
    }

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new Error("Địa chỉ không hợp lệ");
    }

    // Calculate total for each store
    const storeOrders = {};
    for (const item of items) {
      // Support both item.id and item.productId
      const productId = item.productId || item.id;

      if (!productId) {
        throw new Error("Thiếu thông tin sản phẩm trong giỏ hàng");
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { price: true, storeId: true, inStock: true },
      });

      if (!product || !product.inStock) {
        throw new Error(`Sản phẩm không còn hàng`);
      }

      if (!storeOrders[product.storeId]) {
        storeOrders[product.storeId] = {
          items: [],
          total: 0,
        };
      }

      storeOrders[product.storeId].items.push({
        productId: productId,
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
      // Import Stripe only when needed
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        success_url: `${process.env.NEXT_PUBLIC_URL}/orders?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart?canceled=true`,
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

export async function cancelOrder(orderId) {
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
    if (order.status === "Shipped" || order.status === "Delivered") {
      throw new Error("Không thể hủy đơn hàng đã giao hoặc đang vận chuyển");
    }

    // Update order status
    const canceledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Cancelled" },
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
