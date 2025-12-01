import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { getCurrentVendorProfile } from "@/entities/vendor";
import {
  formatShippingAddress,
  updateOrderStatusAction,
  getVendorOrderDetail,
} from "@/entities/order";
import type { OrderStatus } from "@prisma/client";

const statusMap: Record<
  OrderStatus,
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
  REFUNDED: { label: "Hoàn tiền", variant: "secondary" },
};

interface VendorOrderDetailPageProps {
  orderId: string;
}

export async function VendorOrderDetailPage({
  orderId,
}: VendorOrderDetailPageProps) {
  const vendorProfile = await getCurrentVendorProfile();
  if (!vendorProfile) return null;

  const order = await getVendorOrderDetail(orderId, vendorProfile.id);

  if (!order) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
        <Button asChild>
          <Link href="/vendor/orders">Về danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  const status = statusMap[order.status] || {
    label: order.status,
    variant: "secondary" as const,
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/vendor/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Danh sách đơn hàng
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={status.variant} className="text-base px-4 py-1">
          {status.label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customer.name || "N/A"}</p>
            <p className="text-sm text-muted-foreground">
              {order.customer.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone || order.shippingPhone}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.shippingName}</p>
            <p className="text-sm text-muted-foreground">
              {formatShippingAddress(order)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cập Nhật Trạng Thái</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateOrderStatusAction} className="flex gap-4">
            <input type="hidden" name="orderId" value={order.id} />
            <Select name="status" defaultValue={order.status}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="SHIPPED">Đang giao</SelectItem>
                <SelectItem value="DELIVERED">Đã giao</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Cập nhật</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 rounded overflow-hidden bg-muted shrink-0">
                {item.variant.product.images[0] && (
                  <Image
                    src={item.variant.product.images[0].url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.productName}</p>
                {item.variantName && (
                  <p className="text-sm text-muted-foreground">
                    {item.variantName}
                  </p>
                )}
                <p className="text-sm">x{item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Thu nhập (sau phí nền tảng)</span>
              <span>{formatPrice(order.vendorEarnings)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng đơn hàng</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.payment && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Thanh toán
            </CardTitle>
          </CardHeader>
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
