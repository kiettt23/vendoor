"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, Store, MapPin, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { getOrdersByIds } from "../actions/get-orders-by-ids";

/**
 * Order Success Page Component
 *
 * **Displays after successful checkout:**
 * - Success message
 * - Order numbers and totals
 * - Order items grouped by vendor
 * - Shipping info
 * - Payment status (mock for MVP)
 * - Next steps
 */

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  platformFee: number;
  createdAt: Date;
  vendor: {
    shopName: string;
    slug: string;
  };
  items: Array<{
    id: string;
    productName: string;
    variantName: string | null;
    quantity: number;
    price: number;
    subtotal: number;
    image: string | null;
  }>;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    ward: string | null;
    district: string | null;
    city: string | null;
  };
}

export function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Get order IDs from query params
  const orderIdsParam = searchParams.get("orders");

  useEffect(() => {
    async function loadOrders() {
      if (!orderIdsParam) {
        router.push("/");
        return;
      }

      try {
        const orderIds = orderIdsParam.split(",");
        const result = await getOrdersByIds(orderIds);

        if (result.success && result.orders.length > 0) {
          setOrders(result.orders);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [orderIdsParam, router]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return null; // Will redirect
  }

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Đặt Hàng Thành Công!</h1>
          <p className="text-muted-foreground mt-2">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được {orders.length} đơn
            hàng của bạn.
          </p>
        </div>

        {/* Payment Status - Mock for MVP */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Đơn hàng đang chờ thanh toán
              </p>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              MVP Mode: Thanh toán COD khi nhận hàng. Tính năng thanh toán
              online sẽ được cập nhật sau.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi Tiết Đơn Hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {orders.map((order, index) => (
            <div key={order.id}>
              {index > 0 && <Separator className="my-6" />}

              {/* Order Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-semibold truncate">
                      {order.vendor.shopName}
                    </span>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {order.status === "PENDING_PAYMENT"
                      ? "Chờ thanh toán"
                      : order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <p className="text-sm text-muted-foreground break-all sm:break-normal">
                    Mã đơn hàng:{" "}
                    <span className="font-mono">{order.orderNumber}</span>
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    <Link href={`/orders/${order.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 rounded-lg border overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-muted-foreground">
                          {item.price.toLocaleString("vi-VN")}₫ ×{" "}
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right shrink-0">
                      <p className="font-medium">
                        {item.subtotal.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-2 mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-lg">
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Amount (if multiple orders) */}
          {orders.length > 1 && (
            <>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng tất cả đơn hàng</span>
                <span className="text-primary">
                  {totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Địa Chỉ Giao Hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="font-medium text-sm">
                {orders[0].shippingInfo.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {orders[0].shippingInfo.phone}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {orders[0].shippingInfo.address}
              {orders[0].shippingInfo.ward &&
                `, ${orders[0].shippingInfo.ward}`}
              {orders[0].shippingInfo.district &&
                `, ${orders[0].shippingInfo.district}`}
              {orders[0].shippingInfo.city &&
                `, ${orders[0].shippingInfo.city}`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          variant="outline"
          size="lg"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href="/products">Tiếp Tục Mua Sắm</Link>
        </Button>
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/orders">Xem Đơn Hàng</Link>
        </Button>
      </div>
    </div>
  );
}
