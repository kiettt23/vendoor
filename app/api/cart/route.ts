import prisma from "@/lib/prisma";
import { requireAuth } from "@/features/auth/index.server";
import { NextResponse } from "next/server";

// Update user cart
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const userId = user.id;

    const { cart } = await request.json();

    // Update user cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart },
    });

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update cart",
      },
      { status: 400 }
    );
  }
}

// Get user cart
export async function GET(request: Request) {
  try {
    const authUser = await requireAuth();

    // Fetch user with cart from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { cart: true },
    });

    return NextResponse.json({ cart: user?.cart || {} });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get cart" },
      { status: 400 }
    );
  }
}
