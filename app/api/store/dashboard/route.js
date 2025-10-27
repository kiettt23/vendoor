import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/orderService";
import { productService } from "@/lib/services/productService";
import { ratingService } from "@/lib/services/ratingService";
import { handleError } from "@/lib/errors/errorHandler";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    const orders = await orderService.getStoreOrders(storeId);
    const products = await productService.getProducts({ storeId });
    const ratings = await ratingService.getRatingsByStoreId(storeId);

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + order.total, 0)
      ),
      totalProducts: products.length,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    return handleError(error, "Store Dashboard");
  }
}
