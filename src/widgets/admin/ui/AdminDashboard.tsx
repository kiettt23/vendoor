import Link from "next/link";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Store,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib";
import { ROUTES } from "@/shared/lib/constants";
import {
  getAdminDashboardStats,
  getPendingVendorsCount,
  getAdminRecentOrders,
} from "@/entities/vendor/api/queries";
import { OrderStatusBadge } from "@/entities/order";

export async function AdminDashboardPage() {
  const [dashboardStats, pendingVendors, recentOrders] = await Promise.all([
    getAdminDashboardStats(),
    getPendingVendorsCount(),
    getAdminRecentOrders(),
  ]);

  const stats = [
    {
      label: "Người dùng",
      value: dashboardStats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Nhà bán",
      value: dashboardStats.totalVendors,
      icon: Store,
      color: "text-green-600",
    },
    {
      label: "Sản phẩm",
      value: dashboardStats.totalProducts,
      icon: Package,
      color: "text-purple-600",
    },
    {
      label: "Đơn hàng",
      value: dashboardStats.totalOrders,
      icon: ShoppingCart,
      color: "text-orange-600",
    },
    {
      label: "Doanh thu platform",
      value: formatPrice(dashboardStats.platformRevenue),
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingVendors > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-2">
            <p className="text-orange-800">
              <strong>{pendingVendors}</strong> nhà bán đang chờ duyệt
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đơn Hàng Gần Đây</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.ADMIN_ORDERS}>
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              return (
                <Link
                  key={order.id}
                  href={ROUTES.ADMIN_ORDER_DETAIL(order.id)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.name || order.customer.email} →{" "}
                      {order.vendor.shopName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
