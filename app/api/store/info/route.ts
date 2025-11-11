import { NextResponse } from "next/server";
import { requireAuth } from "@/features/auth/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAuth();
    const userId = user.id;

    const store = await prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        username: true,
        description: true,
        logo: true,
        email: true,
        contact: true,
        address: true,
        status: true,
        isActive: true,
      },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, store });
  } catch (error) {
    console.error("Get store info error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
