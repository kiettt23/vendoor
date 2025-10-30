import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/auth/authSeller";
import { NextResponse } from "next/server";
import { orderService } from "@/core/services/orderService";
import { productService } from "@/core/services/productService";
import { ratingService } from "@/core/services/ratingService";
import { handleError } from "@/errors/errorHandler";
import { getCacheOrFetch } from "@/infra/cache";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    // Cache key per store
    // TTL: 5 minutes (dashboard data should be relatively fresh)
    const cacheKey = `store:${storeId}:dashboard`;

    const dashboardData = await getCacheOrFetch(
      cacheKey,
      async () => {
        // Fetch all data (3 DB queries)
        const orders = await orderService.getStoreOrders(storeId);
        const products = await productService.getProducts({ storeId });
        const ratings = await ratingService.getRatingsByStoreId(storeId);

        return {
          ratings,
          totalOrders: orders.length,
          totalEarnings: Math.round(
            orders.reduce((acc, order) => acc + order.total, 0)
          ),
          totalProducts: products.length,
        };
      },
      300 // 5 minutes
    );

    return NextResponse.json({ dashboardData });
  } catch (error) {
    return handleError(error, "Store Dashboard");
  }
}
