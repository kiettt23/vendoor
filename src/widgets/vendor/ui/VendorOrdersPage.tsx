import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { EmptyVendorOrders } from "@/shared/ui/feedback";
import { formatPrice, formatDate } from "@/shared/lib";
import { ORDER_STATUS_BADGE, getBadgeConfig } from "@/shared/lib/constants";
import { getCurrentVendorProfile } from "@/entities/vendor/api/queries";
import { getVendorOrdersPaginated } from "@/entities/order/api/queries";
import { OrderStatusBadge } from "@/entities/order";
import type { OrderStatus } from "@/generated/prisma";

interface VendorOrdersPageProps {
  status?: string;
  page?: number;
}

export async function VendorOrdersPage({
  status,
  page = 1,
}: VendorOrdersPageProps) {
  const vendorProfile = await getCurrentVendorProfile();
  if (!vendorProfile) return null;

  const validStatuses: OrderStatus[] = [
    "PENDING_PAYMENT",
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];
  const statusFilter =
    status && validStatuses.includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const { orders, pagination } = await getVendorOrdersPaginated(
    vendorProfile.id,
    { page, status: statusFilter }
  );

  const statuses = [
    "ALL",
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Đơn Hàng</h1>
        <p className="text-muted-foreground">{pagination.total} đơn hàng</p>
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/vendor/orders${s !== "ALL" ? `?status=${s}` : ""}`}
          >
            <Button
              variant={
                status === s || (!status && s === "ALL") ? "default" : "outline"
              }
              size="sm"
            >
              {s === "ALL"
                ? "Tất cả"
                : getBadgeConfig(s, ORDER_STATUS_BADGE).label}
            </Button>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyVendorOrders />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => {
            return (
              <Link
                key={order.id}
                href={`/vendor/orders/${order.id}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm sm:text-base truncate">
                        {order.orderNumber}
                      </CardTitle>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {order.customer.name || order.customer.email}
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
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0">
                        <span className="font-bold text-primary text-sm sm:text-base">
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
      )}
    </div>
  );
}
