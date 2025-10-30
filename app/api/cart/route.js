import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cartService } from "@/core/services/cartService";
import { handleError } from "@/errors/errorHandler";
import { validateData } from "@/core/validations/validate";
import { saveCartSchema } from "@/core/validations/schemas";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();

    // ✨ Validate cart: quantity phải > 0
    const { cart } = validateData(saveCartSchema, body);

    await cartService.saveCart(userId, cart);

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    return handleError(error, "Cart POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const cart = await cartService.getCart(userId);

    return NextResponse.json({ cart });
  } catch (error) {
    return handleError(error, "Cart GET");
  }
}
