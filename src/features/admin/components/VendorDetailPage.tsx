import { getVendorDetail } from "../actions/get-vendor-detail";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { VendorStatusBadge } from "./VendorStatusBadge";
import { VendorActions } from "./VendorActions";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface VendorDetailPageProps {
  vendorId: string;
}

export async function VendorDetailPage({ vendorId }: VendorDetailPageProps) {
  const result = await getVendorDetail(vendorId);

  if (!result.success) {
    redirect("/admin/vendors");
  }

  const vendor = result.data!;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/vendors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {vendor.shopName}
            </h1>
            <p className="text-muted-foreground">Chi tiết vendor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <VendorStatusBadge status={vendor.status} />
          <VendorActions
            vendorId={vendor.id}
            status={vendor.status}
            shopName={vendor.shopName}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor._count.products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor._count.orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(vendor.totalEarnings)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <VendorStatusBadge status={vendor.status} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shop Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Shop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tên Shop
              </label>
              <p className="mt-1">{vendor.shopName}</p>
            </div>
            {vendor.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Mô tả
                </label>
                <p className="mt-1">{vendor.description}</p>
              </div>
            )}
            {vendor.businessAddress && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Địa chỉ kinh doanh
                </label>
                <p className="mt-1">{vendor.businessAddress}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tham gia
              </label>
              <p className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(vendor.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Chủ Shop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Họ tên
              </label>
              <p className="mt-1">{vendor.user.name || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="mt-1">{vendor.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </label>
              <p className="mt-1">{vendor.user.phone || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      {vendor.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vendor.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(product.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.isActive ? (
                      <span className="text-xs text-green-600">Đang bán</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Đã ẩn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      {vendor.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vendor.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">
                      Thu nhập: {formatCurrency(order.vendorEarnings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
