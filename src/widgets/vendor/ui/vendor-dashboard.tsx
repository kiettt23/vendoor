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
import { Badge } from "@/shared/ui/badge";
import { prisma } from "@/shared/lib/db/prisma";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { formatPrice } from "@/shared/lib";

export async function VendorDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, shopName: true },
  });
  if (!vendorProfile) return null;

  const [totalProducts, totalOrders, pendingOrders, orders] = await Promise.all(
    [
      prisma.product.count({
        where: { vendorId: session.user.id, isActive: true },
      }),
      prisma.order.count({ where: { vendorId: vendorProfile.id } }),
      prisma.order.count({
        where: { vendorId: vendorProfile.id, status: "PENDING" },
      }),
      prisma.order.findMany({
        where: { vendorId: vendorProfile.id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]
  );

  const totalRevenue = await prisma.order.aggregate({
    where: {
      vendorId: vendorProfile.id,
      status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
    },
    _sum: { vendorEarnings: true },
  });

  const stats = [
    {
      label: "Sản phẩm",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Đơn hàng",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      label: "Chờ xử lý",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Doanh thu",
      value: formatPrice(totalRevenue._sum.vendorEarnings || 0),
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{vendorProfile.shopName}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đơn Hàng Gần Đây</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendor/orders">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có đơn hàng
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/vendor/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <Badge variant="outline">{order.status}</Badge>
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
