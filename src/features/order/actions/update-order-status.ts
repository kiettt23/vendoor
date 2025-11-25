"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("OrderActions");

// ============================================
// UPDATE ORDER STATUS (VENDOR)
// ============================================

/**
 * Update order status by vendor
 *
 * **Features:**
 * - Security: Only vendor who owns the order can update
 * - Validation: Status transition rules
 * - Tracking number required for SHIPPED status
 * - Vendor note support
 *
 * **Status Flow:**
 * PENDING → PROCESSING → SHIPPED → DELIVERED
 * Any status (except DELIVERED) → CANCELLED
 *
 * **Returns:**
 * - Success/error message
 * - Updated order data
 */

export interface UpdateOrderStatusInput {
  orderId: string;
  newStatus: OrderStatus;
  trackingNumber?: string;
  vendorNote?: string;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [], // Cannot be updated by vendor (payment pending)
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [], // Final state - cannot change
  CANCELLED: [], // Final state - cannot change
  REFUNDED: [], // Final state - cannot change
};

export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<
  { success: true; message: string } | { success: false; error: string }
> {
  try {
    const { orderId, newStatus, trackingNumber, vendorNote } = input;

    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check VENDOR role
    if (!session.user.roles?.includes("VENDOR")) {
      return {
        success: false,
        error: "Chỉ vendor mới có thể cập nhật đơn hàng",
      };
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!vendorProfile) {
      return {
        success: false,
        error: "Vendor profile không tồn tại",
      };
    }

    // Get current order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        vendorId: vendorProfile.id, // Security: Only vendor's own orders
      },
      select: {
        id: true,
        status: true,
        orderNumber: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Đơn hàng không tồn tại hoặc bạn không có quyền cập nhật",
      };
    }

    // Validate status transition
    const allowedTransitions = VALID_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Không thể chuyển từ ${order.status} sang ${newStatus}`,
      };
    }

    // Validate tracking number for SHIPPED status
    if (newStatus === "SHIPPED" && !trackingNumber) {
      return {
        success: false,
        error:
          "Vui lòng nhập mã vận đơn khi chuyển sang trạng thái Đã gửi hàng",
      };
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        ...(trackingNumber && { trackingNumber }),
        ...(vendorNote && { vendorNote }),
        updatedAt: new Date(),
      },
    });

    // Revalidate paths
    revalidatePath(`/vendor/orders/${orderId}`);
    revalidatePath("/vendor/orders");

    return {
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng ${order.orderNumber}`,
    };
  } catch (error) {
    logger.error("Action failed", error);
    return {
      success: false,
      error: "Không thể cập nhật trạng thái đơn hàng",
    };
  }
}
