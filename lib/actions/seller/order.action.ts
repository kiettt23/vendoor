"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ActionResponse {
  success: boolean;
  message: string;
}

const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  ORDER_PLACED: "Đơn hàng đã được đặt",
  PROCESSING: "Đơn hàng đang xử lý",
  SHIPPED: "Đơn hàng đã giao cho shipper",
  DELIVERED: "Đơn hàng đã giao thành công",
  CANCELLED: "Đơn hàng đã bị hủy",
};

const VALID_STATUSES: OrderStatus[] = [
  "ORDER_PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Get all orders for the seller's store
export async function getOrders() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get seller's store
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  // Get orders
  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
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
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
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

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // Validate input
    if (!orderId || !status) {
      throw new Error("Order ID and status are required");
    }

    // Validate status value
    if (!VALID_STATUSES.includes(status)) {
      throw new Error("Invalid order status");
    }

    // Get order and verify ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: { userId: true },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.store.userId !== userId) {
      throw new Error("Unauthorized: You don't own this order");
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/store/orders");

    return {
      success: true,
      message: ORDER_STATUS_MESSAGES[status] || "Order status updated!",
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Không thể cập nhật trạng thái đơn hàng"
    );
  }
}
