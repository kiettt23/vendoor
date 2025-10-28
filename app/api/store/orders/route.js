import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/auth/authSeller";
import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/orderService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";
import { getCacheOrFetch, invalidateCaches } from "@/lib/cache";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { orderId, status } = await request.json();

    const updatedOrder = await orderService.updateOrderStatus(orderId, status, storeId);

    // Invalidate caches after order status update
    await invalidateCaches([
      `store:orders:${storeId}`, // Store's order list
      `user:orders:${updatedOrder.userId}`, // User's order list
      `store:${storeId}:dashboard`, // Store dashboard
    ]);

    return NextResponse.json({ message: "Order Status updated" });
  } catch (error) {
    return handleError(error, "Store Orders POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Cache key per store
    // TTL: 2 minutes (orders update frequently)
    const cacheKey = `store:orders:${storeId}`;
    const orders = await getCacheOrFetch(
      cacheKey,
      () => orderService.getStoreOrders(storeId),
      120 // 2 minutes
    );

    return NextResponse.json({ orders });
  } catch (error) {
    return handleError(error, "Store Orders GET");
  }
}
