import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Store, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { prisma } from "@/shared/lib/db/prisma";
import { formatPrice } from "@/shared/lib";
import { formatShippingAddress } from "@/entities/order";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "default" },
  PROCESSING: { label: "Đang xử lý", variant: "default" },
  SHIPPED: { label: "Đang giao", variant: "default" },
  DELIVERED: { label: "Đã giao", variant: "outline" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
};

interface OrderDetailPageProps {
  orderId: string;
}

export async function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      vendor: { select: { shopName: true, slug: true } },
      items: {
        include: { variant: { include: { product: { include: { images: { take: 1, orderBy: { order: "asc" } } } } } } },
      },
      payment: true,
    },
  });

  if (!order) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
        <Button asChild><Link href="/orders">Về danh sách đơn hàng</Link></Button>
      </div>
    );
  }

  const status = statusMap[order.status] || { label: order.status, variant: "secondary" as const };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Danh sách đơn hàng</Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        </div>
        <Badge variant={status.variant} className="text-base px-4 py-1">{status.label}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" />Người bán</CardTitle></CardHeader>
          <CardContent><p className="font-medium">{order.vendor.shopName}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />Địa chỉ giao hàng</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{order.shippingName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
            <p className="text-sm text-muted-foreground">{formatShippingAddress(order)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle>Sản phẩm</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 rounded overflow-hidden bg-muted shrink-0">
                {item.variant.product.images[0] && <Image src={item.variant.product.images[0].url} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                <p className="text-sm">x{item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Phí vận chuyển</span><span>{formatPrice(order.shippingFee)}</span></div>
            <div className="flex justify-between text-sm"><span>Phí nền tảng ({(order.platformFeeRate * 100).toFixed(0)}%)</span><span>{formatPrice(order.platformFee)}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Tổng cộng</span><span className="text-primary">{formatPrice(order.total)}</span></div>
          </div>
        </CardContent>
      </Card>

      {order.payment && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Thanh toán</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">Mã: {order.payment.paymentNumber}</p>
            <p className="text-sm">Phương thức: {order.payment.method}</p>
            <p className="text-sm">Trạng thái: {order.payment.status}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

