import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { ORDER_STATUS_CONFIG, getStatusConfig } from "@/shared/lib/constants";
import { getAdminOrders } from "@/entities/order";

export async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tất Cả Đơn Hàng</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Chưa có đơn hàng</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = getStatusConfig(order.status, ORDER_STATUS_CONFIG);
            return (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {order.orderNumber}
                      </CardTitle>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p>
                          <strong>Khách:</strong>{" "}
                          {order.customer.name || order.customer.email}
                        </p>
                        <p>
                          <strong>Shop:</strong> {order.vendor.shopName}
                        </p>
                        <p className="text-muted-foreground">
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
      )}
    </div>
  );
}
