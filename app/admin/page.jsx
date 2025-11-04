import OrdersAreaChart from "@/components/features/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
} from "lucide-react";
import { vi, formatPrice } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// ✅ Server Component - Fetch dashboard data directly from DB
export default async function AdminDashboard() {
  // ✅ Check auth on server
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ✅ Fetch dashboard data directly from database
  const [products, orders, stores] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({
      include: {
        orderItems: true,
      },
    }),
    prisma.store.count(),
  ]);

  // ✅ Calculate revenue from order.total (not totalAmount)
  const revenue = orders.reduce((total, order) => total + order.total, 0);

  const dashboardData = {
    products,
    revenue,
    orders: orders.length,
    stores,
    allOrders: orders,
  };

  const dashboardCardsData = [
    {
      title: vi.admin.totalProducts,
      value: dashboardData.products,
      icon: ShoppingBasketIcon,
    },
    {
      title: vi.admin.revenue,
      value: formatPrice(dashboardData.revenue),
      icon: CircleDollarSignIcon,
    },
    {
      title: vi.admin.totalOrders,
      value: dashboardData.orders,
      icon: TagsIcon,
    },
    { title: "Tổng cửa hàng", value: dashboardData.stores, icon: StoreIcon },
  ];

  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">{vi.admin.dashboard}</h1>

      {/* Cards */}
      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-slate-700">
                {card.value}
              </b>
            </div>
            <card.icon
              size={50}
              className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <OrdersAreaChart allOrders={dashboardData.allOrders} />
    </div>
  );
}
