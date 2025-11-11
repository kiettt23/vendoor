import { formatPrice } from "@/lib/utils/format/currency";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/features/auth/server";
import { redirect } from "next/navigation";
import StoreDashboardClient from "./_components/StoreDashboardClient";

// ✅ Server Component - Fetch store dashboard data
export default async function Dashboard() {
  // ✅ Check auth on server
  const user = await requireAuth();
  const userId = user.id;

  // ✅ Get user's store
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!store) redirect("/create-store");

  // ✅ Fetch dashboard data directly from database
  const [products, orders, ratings] = await Promise.all([
    prisma.product.count({
      where: { storeId: store.id },
    }),
    prisma.order.findMany({
      where: { storeId: store.id },
      select: {
        total: true,
      },
    }),
    prisma.rating.findMany({
      where: {
        product: {
          storeId: store.id,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            name: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0);

  // ✅ Pass only serializable data (no React components)
  const stats = {
    totalProducts: products,
    totalEarnings: formatPrice(totalEarnings),
    totalOrders: orders.length,
    totalRatings: ratings.length,
  };

  return <StoreDashboardClient stats={stats} ratings={ratings} />;
}
