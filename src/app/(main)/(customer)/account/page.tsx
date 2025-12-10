import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from "lucide-react";

import {
  requireAuth,
} from "@/entities/user";
import {
  getCurrentUserProfile,
  getUserOrderStats,
  getUserRecentOrders,
} from "@/entities/user/api/queries";
import { OrderStatusBadge } from "@/entities/order";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { formatPrice, formatDate } from "@/shared/lib";
import { ROUTES } from "@/shared/lib/constants";

export default async function AccountPage() {
  await requireAuth();

  const [profile, stats, recentOrders] = await Promise.all([
    getCurrentUserProfile(),
    getUserOrderStats(),
    getUserRecentOrders(5),
  ]);

  if (!profile) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <h1 className="mb-8 text-3xl font-bold">Tài Khoản</h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile.image || ""}
                    alt={profile.name || "Avatar"}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">
                  {profile.name || "Chưa cập nhật tên"}
                </h2>
                <p className="text-muted-foreground text-sm">{profile.email}</p>
                {profile.emailVerified && (
                  <Badge variant="secondary" className="mt-2">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Email đã xác thực
                  </Badge>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <Link href={ROUTES.ACCOUNT_PROFILE}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href={ROUTES.ORDERS}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href={ROUTES.WISHLIST}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4" />
                    Sản phẩm yêu thích
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/logout">
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* Order Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="bg-primary/10 rounded-full p-3">
                  <ShoppingBag className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Đang xử lý</p>
                  <p className="text-2xl font-bold">
                    {stats?.pendingOrders || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Hoàn thành</p>
                  <p className="text-2xl font-bold">
                    {stats?.completedOrders || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Spent */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Tổng chi tiêu</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(stats?.totalSpent || 0)}
                  </p>
                </div>
                <Link href={ROUTES.ORDERS}>
                  <Button variant="outline">Xem chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
              <Link href={ROUTES.ORDERS}>
                <Button variant="ghost" size="sm">
                  Xem tất cả
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
                  <Link href={ROUTES.PRODUCTS}>
                    <Button className="mt-4">Bắt đầu mua sắm</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`${ROUTES.ORDERS}/${order.id}`}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {order.items[0]?.productName}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} sản phẩm`}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(order.total)}
                        </p>
                        <OrderStatusBadge status={order.status} size="sm" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
