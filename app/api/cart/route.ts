import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Update user cart
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await request.json();
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert user - create if not exists, update if exists
    await prisma.user.upsert({
      where: { id: userId },
      update: { cart },
      create: {
        id: userId,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        cart,
      },
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert user - ensure user exists
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        cart: {},
      },
    });

    return NextResponse.json({ cart: user.cart || {} });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get cart" },
      { status: 400 }
    );
  }
}
