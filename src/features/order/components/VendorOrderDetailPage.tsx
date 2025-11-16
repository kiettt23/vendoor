"use client";

import { useState } from "react";
import { VendorOrderDetail } from "../actions/get-vendor-order-detail";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { formatPrice } from "@/features/order/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  User,
  MapPin,
  Phone,
  Package,
  Truck,
  DollarSign,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog";
import { OrderStatus } from "@prisma/client";

// ============================================
// VENDOR ORDER DETAIL PAGE
// ============================================

/**
 * Display full order details for vendor
 *
 * **Features:**
 * - Order status with color badge
 * - Customer info (name, phone, email)
 * - Shipping address
 * - Product items with images
 * - Payment breakdown (subtotal, fees, earnings)
 * - Notes (customer + vendor)
 * - Update status button (future)
 */

interface VendorOrderDetailPageProps {
  order: VendorOrderDetail;
}

// Status mapping (same as list)
const ORDER_STATUS_MAP: Record<
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
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  PROCESSING: { label: "Đang xử lý", variant: "info" },
  SHIPPED: { label: "Đã gửi hàng", variant: "purple" },
  DELIVERED: { label: "Đã giao", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  COMPLETED: "Đã thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const PAYMENT_METHOD_MAP: Record<string, string> = {
  VNPAY: "VNPay",
  MOMO: "MoMo",
  ZALOPAY: "ZaloPay",
  COD: "Thanh toán khi nhận hàng",
};

export function VendorOrderDetailPage({ order }: VendorOrderDetailPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusInfo = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    variant: "outline",
  };

  // Check if order can be updated (not in final states)
  const canUpdateStatus = !["DELIVERED", "CANCELLED", "REFUNDED"].includes(
    order.status
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
          <p className="text-sm text-muted-foreground">
            {order.orderNumber} • Đặt{" "}
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </p>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {order.customer.name || "Khách hàng"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{order.shippingName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingPhone}
                </p>
              </div>
              <p className="text-sm">{order.shippingAddress}</p>
              {(order.shippingWard ||
                order.shippingDistrict ||
                order.shippingCity) && (
                <p className="text-sm text-muted-foreground">
                  {[
                    order.shippingWard,
                    order.shippingDistrict,
                    order.shippingCity,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {order.trackingNumber && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mã vận đơn</p>
                    <p className="text-sm font-mono">{order.trackingNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {(order.customerNote || order.vendorNote) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.customerNote && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Khách hàng:
                    </p>
                    <p className="text-sm">{order.customerNote}</p>
                  </div>
                )}
                {order.vendorNote && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Ghi chú nội bộ:
                    </p>
                    <p className="text-sm">{order.vendorNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const image = item.variant.product.images[0];
                  return (
                    <div key={item.id} className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí ship</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thuế</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Doanh thu của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Doanh thu sản phẩm
                </span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Phí platform ({(order.platformFeeRate * 100).toFixed(0)}%)
                </span>
                <span className="text-destructive">
                  -{formatPrice(order.platformFee)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-green-600">
                <span>Bạn nhận được</span>
                <span className="text-lg">
                  {formatPrice(order.vendorEarnings)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {order.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức</span>
                  <span>
                    {PAYMENT_METHOD_MAP[order.payment.method] ||
                      order.payment.method}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span>
                    {PAYMENT_STATUS_MAP[order.payment.status] ||
                      order.payment.status}
                  </span>
                </div>
                {order.payment.paidAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Thanh toán lúc
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(order.payment.paidAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end border-t pt-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          Quay lại
        </Button>
        <Button onClick={() => setDialogOpen(true)} disabled={!canUpdateStatus}>
          Cập nhật trạng thái
        </Button>
      </div>

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        orderId={order.id}
        currentStatus={order.status as OrderStatus}
        orderNumber={order.orderNumber}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
