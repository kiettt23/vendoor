import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import CartClient from "./CartClient";

// ✅ Server Component - Fetch cart products
export default async function Cart() {
  const { userId } = await auth();

  if (!userId) {
    // Not logged in - show empty cart (client will handle localStorage)
    return <CartClient products={[]} />;
  }

  // ✅ Fetch user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart || !cart.items || Object.keys(cart.items).length === 0) {
    return <CartClient products={[]} />;
  }

  // ✅ Get product IDs from cart
  const productIds = Object.keys(cart.items);

  // ✅ Fetch products in cart
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      store: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return <CartClient products={products} />;
}
