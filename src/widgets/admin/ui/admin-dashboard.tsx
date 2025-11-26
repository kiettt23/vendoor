import { Users, ShoppingCart, DollarSign, Package, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { prisma } from "@/shared/lib/db/prisma";
import { formatPrice } from "@/shared/lib";

export async function AdminDashboardPage() {
  const [totalUsers, totalVendors, totalProducts, totalOrders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.vendorProfile.count({ where: { status: "APPROVED" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING"] } },
      _sum: { platformFee: true },
    }),
  ]);

  const stats = [
    { label: "Người dùng", value: totalUsers, icon: Users, color: "text-blue-600" },
    { label: "Nhà bán", value: totalVendors, icon: Store, color: "text-green-600" },
    { label: "Sản phẩm", value: totalProducts, icon: Package, color: "text-purple-600" },
    { label: "Đơn hàng", value: totalOrders, icon: ShoppingCart, color: "text-orange-600" },
    { label: "Doanh thu platform", value: formatPrice(revenue._sum.platformFee || 0), icon: DollarSign, color: "text-primary" },
  ];

  const pendingVendors = await prisma.vendorProfile.count({ where: { status: "PENDING" } });
  const recentOrders = await prisma.order.findMany({
    include: { customer: { select: { name: true, email: true } }, vendor: { select: { shopName: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

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
          <CardContent className="pt-6">
            <p className="text-orange-800"><strong>{pendingVendors}</strong> nhà bán đang chờ duyệt</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Đơn Hàng Gần Đây</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.name || order.customer.email} → {order.vendor.shopName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

