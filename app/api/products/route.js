import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";
import { handleError } from "@/lib/errors/errorHandler";
import { getCacheOrFetch } from "@/lib/cache";

export async function GET(request) {
  try {
    // Cache key for all products
    const cacheKey = "products:all";

    // Get from cache or fetch from database
    // TTL: 5 minutes (300 seconds)
    const products = await getCacheOrFetch(
      cacheKey,
      () => productService.getProducts(),
      300
    );

    return NextResponse.json({ products });
  } catch (error) {
    return handleError(error, "Products GET");
  }
}
