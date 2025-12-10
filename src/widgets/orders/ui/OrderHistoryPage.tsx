import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyOrders } from "@/shared/ui/feedback";
import { getSession } from "@/shared/lib/auth/session";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { getCustomerOrders } from "@/entities/order/api/queries";
import { OrderStatusBadge } from "@/entities/order";

export async function OrderHistoryPage() {
  const session = await getSession();
  if (!session?.user) return null;

  const orders = await getCustomerOrders();

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-[60vh] flex items-center justify-center">
        <EmptyOrders />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Đơn Hàng Của Tôi</h1>
      <div className="space-y-4 sm:space-y-6">
        {orders.map((order) => {
          return (
            <Link key={order.id} href={`/orders/${order.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base truncate">
                      {order.orderNumber}
                    </CardTitle>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {order.vendor.shopName}
                  </p>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm line-clamp-1">
                        {order.items
                          .map((i) => `${i.productName} x${i.quantity}`)
                          .join(", ")}
                      </p>
                      {order.itemCount > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{order.itemCount - 1} sản phẩm khác
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0">
                      <span className="font-bold text-primary text-sm sm:text-base whitespace-nowrap">
                        {formatPrice(order.total)}
                      </span>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
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
