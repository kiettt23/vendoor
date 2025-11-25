"use client";

import { useEffect, useState } from "react";
import { getOrderDetail } from "../actions/get-order-detail";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ArrowLeft, Package, User, Store } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";
import Image from "next/image";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: number;
  variant: {
    product: {
      name: string;
      slug: string;
      images: { url: string }[];
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  platformFee: number;
  vendorEarnings: number;
  shippingAddress: string;
  shippingName: string;
  shippingPhone: string;
  customerNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  vendor: {
    id: string;
    shopName: string;
    user: {
      name: string | null;
      email: string;
      phone: string | null;
    };
  };
  customer: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  items: OrderItem[];
}

interface OrderDetailPageProps {
  orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const result = await getOrderDetail(orderId);
      if (result.success && result.data) {
        setOrder(result.data as Order);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
        <Button asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
            <p className="text-muted-foreground">{order.orderNumber}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vendor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Thông tin Vendor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tên shop
              </label>
              <p className="mt-1">{order.vendor.shopName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Chủ shop
              </label>
              <p className="mt-1">{order.vendor.user.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1">{order.vendor.user.email}</p>
            </div>
            {order.vendor.user.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </label>
                <p className="mt-1">{order.vendor.user.phone}</p>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/admin/vendors/${order.vendor.id}`}>
                Xem chi tiết vendor
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin Khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tên khách hàng
              </label>
              <p className="mt-1">{order.customer.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1">{order.customer.email}</p>
            </div>
            {order.customer.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </label>
                <p className="mt-1">{order.customer.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Người nhận
              </label>
              <p className="mt-1">{order.shippingName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                SĐT nhận hàng
              </label>
              <p className="mt-1">{order.shippingPhone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Địa chỉ giao hàng
              </label>
              <p className="mt-1">{order.shippingAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                  {item.variant.product.images[0]?.url ? (
                    <Image
                      src={item.variant.product.images[0].url}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground">
                      {item.variantName}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {item.price.toLocaleString("vi-VN")} ₫ × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tổng tiền hàng</span>
              <span>{order.total.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phí nền tảng</span>
              <span>{order.platformFee.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thu nhập vendor</span>
              <span>{order.vendorEarnings.toLocaleString("vi-VN")} ₫</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="text-lg">
                {order.total.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.customerNote && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Ghi chú
              </label>
              <p className="mt-1">{order.customerNote}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Ngày tạo
            </label>
            <p className="mt-1">
              {format(new Date(order.createdAt), "PPpp", { locale: vi })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Cập nhật lần cuối
            </label>
            <p className="mt-1">
              {format(new Date(order.updatedAt), "PPpp", { locale: vi })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
