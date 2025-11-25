"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Store,
  MapPin,
  CreditCard,
  ArrowLeft,
  Phone,
  Calendar,
  Truck,
  XCircle,
} from "lucide-react";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/components/ui/button";

const logger = createLogger("OrderDetail");
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { getOrderDetail, type OrderDetail } from "../actions/get-order-detail";
import { formatPrice } from "../lib/utils";

/**
 * Order Detail Page Component
 *
 * **Features:**
 * - Full order information display
 * - Order status timeline
 * - Vendor and shipping info
 * - Payment details
 * - Action buttons (Cancel, View Shop)
 */

interface OrderDetailPageProps {
  orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);
        const data = await getOrderDetail(orderId);

        if (!data) {
          setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập");
          return;
        }

        setOrder(data);
      } catch (err) {
        logger.error("Failed to load order", err);
        setError("Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertDescription>
            {error || "Đơn hàng không tồn tại"}
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách đơn hàng
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Đơn hàng {order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Đặt lúc:{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status === "PENDING" && (
            <Button variant="destructive" size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Hủy đơn hàng
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/vendors/${order.vendor.slug}`}>
              <Store className="h-4 w-4 mr-2" />
              Xem cửa hàng
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                trackingNumber={order.trackingNumber}
              />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2">
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </span>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.subtotal)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)}/sp
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Note */}
          {order.customerNote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ghi chú đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {order.customerNote}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vendor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Store className="h-5 w-5" />
                Thông tin người bán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.vendor.shopName}</p>
              </div>
              {order.vendor.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.vendor.phone}</span>
                </div>
              )}
              <Separator />
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/vendors/${order.vendor.slug}`}>Xem cửa hàng</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="font-medium">{order.shippingAddress.name}</p>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
              <Separator />
              <div className="text-muted-foreground space-y-1">
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.ward &&
                  order.shippingAddress.district && (
                    <p>
                      {order.shippingAddress.ward},{" "}
                      {order.shippingAddress.district}
                    </p>
                  )}
                {order.shippingAddress.city && (
                  <p>{order.shippingAddress.city}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.payment && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mã thanh toán:
                    </span>
                    <span className="font-medium">
                      {order.payment.paymentNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <Badge variant="outline">{order.payment.method}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <PaymentStatusBadge status={order.payment.status} />
                  </div>
                  <Separator />
                </>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí nền tảng:</span>
                  <span>{formatPrice(order.platformFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | "warning"
        | "success"
        | "info"
        | "purple";
    }
  > = {
    PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
    PENDING: { label: "Chờ xác nhận", variant: "warning" },
    PROCESSING: { label: "Đang xử lý", variant: "info" },
    SHIPPED: { label: "Đang giao", variant: "purple" },
    DELIVERED: { label: "Đã giao", variant: "success" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | "warning"
        | "success"
        | "info"
        | "purple";
    }
  > = {
    PENDING: { label: "Chờ thanh toán", variant: "warning" },
    COMPLETED: { label: "Đã thanh toán", variant: "success" },
    FAILED: { label: "Thất bại", variant: "destructive" },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function OrderTimeline({
  status,
  trackingNumber,
}: {
  status: string;
  trackingNumber: string | null;
}) {
  const steps = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PROCESSING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "DELIVERED", label: "Đã giao" },
  ];

  const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = statusOrder.indexOf(status);

  if (status === "CANCELLED") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertDescription>
          <p className="font-medium">Đơn hàng đã bị hủy</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {trackingNumber && (
        <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-lg">
          <Truck className="h-4 w-4" />
          <span className="text-muted-foreground">Mã vận đơn:</span>
          <span className="font-medium">{trackingNumber}</span>
        </div>
      )}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={`font-medium ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? ""
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
