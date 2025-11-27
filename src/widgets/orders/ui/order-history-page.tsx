import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { prisma } from "@/shared/lib/db/prisma";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { formatPrice } from "@/shared/lib";

const statusMap: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "default" },
  PROCESSING: { label: "Đang xử lý", variant: "default" },
  SHIPPED: { label: "Đang giao", variant: "default" },
  DELIVERED: { label: "Đã giao", variant: "outline" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "secondary" },
};

export async function OrderHistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      vendor: { select: { shopName: true } },
      items: { select: { productName: true, quantity: true }, take: 2 },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Chưa có đơn hàng</h1>
        <p className="text-muted-foreground mb-6">Bạn chưa có đơn hàng nào</p>
        <Button asChild>
          <Link href="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Đơn Hàng Của Tôi</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusMap[order.status] || {
            label: order.status,
            variant: "secondary" as const,
          };
          return (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {order.orderNumber}
                    </CardTitle>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.vendor.shopName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        {order.items
                          .map((i) => `${i.productName} x${i.quantity}`)
                          .join(", ")}
                        {order._count.items > 2 &&
                          ` +${order._count.items - 2} sản phẩm`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {formatPrice(order.total)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
