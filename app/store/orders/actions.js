"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId, status) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate input
    if (!orderId || !status) {
      throw new Error("Order ID and status are required");
    }

    // 3. Validate status value
    const validStatuses = [
      "ORDER_PLACED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    // 4. Get order and verify ownership
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

    // 5. Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // 6. Refresh the page data
    revalidatePath("/store/orders");

    // 7. Return success with status message
    const statusMessages = {
      ORDER_PLACED: "Đơn hàng đã được đặt",
      PROCESSING: "Đơn hàng đang xử lý",
      SHIPPED: "Đơn hàng đã giao cho shipper",
      DELIVERED: "Đơn hàng đã giao thành công",
      CANCELLED: "Đơn hàng đã bị hủy",
    };

    return {
      success: true,
      message: statusMessages[status] || "Order status updated!",
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
