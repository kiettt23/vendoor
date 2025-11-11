import { getSession } from "@/features/auth/server";
import prisma from "@/lib/prisma";
import CartClient from "./_components/CartClient";

// ✅ Server Component - Fetch cart products
export default async function Cart() {
  const { user } = await getSession();

  if (!user) {
    // Not logged in - show empty cart (client will handle localStorage)
    return <CartClient products={[]} />;
  }

  const userId = user.id;

  // ✅ Fetch user's cart from User.cart (Json field)
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { cart: true },
  });

  if (!dbUser || !dbUser.cart || Object.keys(dbUser.cart).length === 0) {
    return <CartClient products={[]} />;
  }

  // ✅ Get product IDs from cart
  const productIds = Object.keys(dbUser.cart);

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
