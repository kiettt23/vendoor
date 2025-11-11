import prisma from "@/lib/prisma";
import { requireAuth } from "@/features/auth/index.server";
import { redirect } from "next/navigation";
import ManageProductsClient from "./_components/ManageProductsClient";

// ✅ Server Component - Fetch store products
export default async function StoreManageProducts() {
  // ✅ Check auth on server
  const user = await requireAuth();
  const userId = user.id;

  // ✅ Get user's store
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!store) redirect("/create-store");

  // ✅ Fetch products directly from database
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ManageProductsClient products={products} />;
}
