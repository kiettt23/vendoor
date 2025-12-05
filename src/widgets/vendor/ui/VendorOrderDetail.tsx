import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { ORDER_STATUS_CONFIG, getStatusConfig } from "@/shared/lib/constants";
import { getCurrentVendorProfile } from "@/entities/vendor";
import {
  formatShippingAddress,
  updateOrderStatusAction,
  getVendorOrderDetail,
} from "@/entities/order";

// Define allowed status transitions for vendor
const VENDOR_STATUS_TRANSITIONS: Record<string, { nextStatus: string; label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" }[]> = {
  PENDING: [
    { nextStatus: "PROCESSING", label: "Xác nhận đơn", icon: <CheckCircle className="h-4 w-4 mr-2" />, variant: "default" },
    { nextStatus: "CANCELLED", label: "Hủy đơn", icon: <XCircle className="h-4 w-4 mr-2" />, variant: "destructive" },
  ],
  PROCESSING: [
    { nextStatus: "SHIPPED", label: "Đã giao cho vận chuyển", icon: <Truck className="h-4 w-4 mr-2" />, variant: "default" },
    { nextStatus: "CANCELLED", label: "Hủy đơn", icon: <XCircle className="h-4 w-4 mr-2" />, variant: "destructive" },
  ],
  SHIPPED: [
    { nextStatus: "DELIVERED", label: "Xác nhận đã giao", icon: <CheckCircle className="h-4 w-4 mr-2" />, variant: "default" },
  ],
  DELIVERED: [],
  CANCELLED: [],
  PENDING_PAYMENT: [],
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

  const status = getStatusConfig(order.status, ORDER_STATUS_CONFIG);

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
          {VENDOR_STATUS_TRANSITIONS[order.status]?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {VENDOR_STATUS_TRANSITIONS[order.status].map((transition) => (
                <form key={transition.nextStatus} action={updateOrderStatusAction}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="status" value={transition.nextStatus} />
                  <Button type="submit" variant={transition.variant}>
                    {transition.icon}
                    {transition.label}
                  </Button>
                </form>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {order.status === "PENDING_PAYMENT"
                ? "Chờ khách hàng thanh toán"
                : order.status === "DELIVERED"
                  ? "Đơn hàng đã hoàn thành"
                  : "Đơn hàng đã hủy"}
            </p>
          )}
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
                  <OptimizedImage
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
