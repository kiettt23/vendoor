import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StoreOrdersClient from "./_components/StoreOrdersClient";

// ✅ Server Component - Fetch store orders
export default async function StoreOrders() {
  // ✅ Check auth on server
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ✅ Get user's store
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!store) redirect("/create-store");

  // ✅ Fetch orders directly from database
  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              price: true,
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize dates
  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    address: {
      ...order.address,
      createdAt: order.address.createdAt.toISOString(),
    },
  }));

  return <StoreOrdersClient orders={serializedOrders} />;
}
