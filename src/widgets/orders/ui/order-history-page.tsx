import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { ORDER_STATUS_CONFIG, getStatusConfig } from "@/shared/lib/constants";
import { getCustomerOrders } from "@/entities/order";

export async function OrderHistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const orders = await getCustomerOrders();

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Chưa có đơn hàng</h1>
        <p className="text-muted-foreground mb-8">Bạn chưa có đơn hàng nào</p>
        <Button size="lg" asChild>
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
          const status = getStatusConfig(order.status, ORDER_STATUS_CONFIG);
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
                        {order.itemCount > 2 &&
                          ` +${order.itemCount - 2} sản phẩm`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(order.createdAt)}
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
