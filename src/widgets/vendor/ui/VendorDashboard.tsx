import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { formatPrice, formatDate } from "@/shared/lib";
import { ROUTES } from "@/shared/lib/constants";
import { getVendorDashboardData } from "@/entities/vendor/api/queries";
import { OrderStatusBadge } from "@/entities/order";
import type { OrderStatus } from "@/entities/order";

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

interface VendorDashboardPageProps {
  userId: string;
}

export async function VendorDashboardPage({
  userId,
}: VendorDashboardPageProps) {
  const data = await getVendorDashboardData(userId);
  if (!data) return null;

  const { vendorProfile, stats, recentOrders } = data;

  const statItems = [
    {
      label: "Sản phẩm",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Đơn hàng",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      label: "Chờ xử lý",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{vendorProfile.shopName}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Đơn Hàng Gần Đây</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.VENDOR_ORDERS}>
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có đơn hàng
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order: RecentOrder) => (
                <Link
                  key={order.id}
                  href={`/vendor/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{order.orderNumber}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-semibold text-sm sm:text-base">{formatPrice(order.total)}</p>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
