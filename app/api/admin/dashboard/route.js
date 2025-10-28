import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/lib/auth/authAdmin";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const orders = await prisma.order.count();
    const stores = await prisma.store.count();
    const products = await prisma.product.count();

    const allOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
    });

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    const dashboardData = {
      orders,
      stores,
      products,
      revenue: totalRevenue.toFixed(2),
      allOrders,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    return handleError(error, "Admin Dashboard");
  }
}
