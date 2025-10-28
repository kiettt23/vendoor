import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cartService } from "@/lib/services/cartService";
import { handleError } from "@/lib/errors/errorHandler";
import { validateData } from "@/lib/validations/validate";
import { saveCartSchema } from "@/lib/validations/schemas";
import { getCacheOrFetch, deleteCache } from "@/lib/cache";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();

    // ✨ Validate cart: quantity phải > 0
    const { cart } = validateData(saveCartSchema, body);

    await cartService.saveCart(userId, cart);

    // Invalidate cart cache after update
    await deleteCache(`cart:${userId}`);

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    return handleError(error, "Cart POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // Cache key per user
    // TTL: 1 minute (cart updates frequently)
    const cacheKey = `cart:${userId}`;
    const cart = await getCacheOrFetch(
      cacheKey,
      () => cartService.getCart(userId),
      60 // 1 minute
    );

    return NextResponse.json({ cart });
  } catch (error) {
    return handleError(error, "Cart GET");
  }
}
