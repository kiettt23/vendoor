import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { prisma } from "@/shared/lib/db/prisma";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { formatPrice } from "@/shared/lib";
import { OrderStatus } from "@prisma/client";

const statusMap: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "default" },
  PROCESSING: { label: "Đang xử lý", variant: "default" },
  SHIPPED: { label: "Đang giao", variant: "default" },
  DELIVERED: { label: "Đã giao", variant: "outline" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
  REFUNDED: { label: "Hoàn tiền", variant: "secondary" },
};

interface VendorOrdersPageProps {
  status?: string;
  page?: number;
}

export async function VendorOrdersPage({ status, page = 1 }: VendorOrdersPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!vendorProfile) return null;

  const validStatuses: OrderStatus[] = ["PENDING_PAYMENT", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  const statusFilter = status && validStatuses.includes(status as OrderStatus) ? status as OrderStatus : undefined;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { vendorId: vendorProfile.id, ...(statusFilter ? { status: statusFilter } : {}) },
      include: {
        customer: { select: { name: true, email: true } },
        items: { select: { productName: true, quantity: true }, take: 2 },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      skip: (page - 1) * 10,
    }),
    prisma.order.count({ where: { vendorId: vendorProfile.id, ...(statusFilter ? { status: statusFilter } : {}) } }),
  ]);

  const statuses = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Đơn Hàng</h1>
        <p className="text-muted-foreground">{total} đơn hàng</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link key={s} href={`/vendor/orders${s !== "ALL" ? `?status=${s}` : ""}`}>
            <Button variant={status === s || (!status && s === "ALL") ? "default" : "outline"} size="sm">
              {s === "ALL" ? "Tất cả" : statusMap[s as OrderStatus]?.label || s}
            </Button>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusMap[order.status] || { label: order.status, variant: "secondary" as const };
            return (
              <Link key={order.id} href={`/vendor/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer.name || order.customer.email}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{order.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{formatPrice(order.total)}</span>
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
