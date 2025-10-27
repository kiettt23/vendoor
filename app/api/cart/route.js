import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cartService } from "@/lib/services/cartService";
import { handleError } from "@/lib/errors/errorHandler";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cart } = await request.json();

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
