import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/feedback";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { getAdminOrders } from "@/entities/order/api/queries";
import { OrderStatusBadge } from "@/entities/order";

export async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tất Cả Đơn Hàng</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              title="Chưa có đơn hàng"
              description="Đơn hàng sẽ xuất hiện ở đây khi có giao dịch mới"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {order.orderNumber}
                      </CardTitle>
                      <OrderStatusBadge status={order.status} />
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
