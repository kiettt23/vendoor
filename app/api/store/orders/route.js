import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/auth/authSeller";
import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/orderService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { orderId, status } = await request.json();

    await orderService.updateOrderStatus(orderId, status, storeId);

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

    const orders = await orderService.getStoreOrders(storeId);

    return NextResponse.json({ orders });
  } catch (error) {
    return handleError(error, "Store Orders GET");
  }
}
