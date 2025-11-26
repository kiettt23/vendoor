import Link from "next/link";
import { ArrowLeft, Store, User, Package, ShoppingCart, Check, X, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { prisma } from "@/shared/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/shared/lib";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  APPROVED: { label: "Đã duyệt", variant: "default" },
  REJECTED: { label: "Từ chối", variant: "destructive" },
  SUSPENDED: { label: "Tạm ngưng", variant: "outline" },
};

async function updateVendorStatus(formData: FormData) {
  "use server";
  const vendorId = formData.get("vendorId") as string;
  const status = formData.get("status") as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  await prisma.vendorProfile.update({ where: { id: vendorId }, data: { status } });
  
  if (status === "APPROVED") {
    const vendor = await prisma.vendorProfile.findUnique({ where: { id: vendorId }, select: { userId: true } });
    if (vendor) {
      const user = await prisma.user.findUnique({ where: { id: vendor.userId }, select: { roles: true } });
      if (user && !user.roles.includes("VENDOR")) {
        await prisma.user.update({ where: { id: vendor.userId }, data: { roles: [...user.roles, "VENDOR"] } });
      }
    }
  }
  
  revalidatePath(`/admin/vendors/${vendorId}`);
}

interface AdminVendorDetailPageProps {
  vendorId: string;
}

export async function AdminVendorDetailPage({ vendorId }: AdminVendorDetailPageProps) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
      _count: { select: { orders: true } },
    },
  });

  if (!vendor) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy nhà bán</h1>
        <Button asChild><Link href="/admin/vendors">Về danh sách nhà bán</Link></Button>
      </div>
    );
  }

  const [totalProducts, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { vendorId: vendor.userId } }),
    prisma.order.aggregate({
      where: { vendorId: vendor.id, status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] } },
      _sum: { vendorEarnings: true },
    }),
  ]);

  const status = statusMap[vendor.status] || { label: vendor.status, variant: "secondary" as const };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/admin/vendors"><ArrowLeft className="mr-2 h-4 w-4" />Danh sách nhà bán</Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
          <p className="text-muted-foreground">@{vendor.slug}</p>
        </div>
        <Badge variant={status.variant} className="text-base px-4 py-1">{status.label}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Chủ shop</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{vendor.user.name || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{vendor.user.email}</p>
            <p className="text-sm text-muted-foreground">{vendor.user.phone || "Chưa có SĐT"}</p>
            <p className="text-sm text-muted-foreground mt-2">Đăng ký: {new Date(vendor.user.createdAt).toLocaleDateString("vi-VN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" />Thống kê</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><Package className="h-4 w-4" />Sản phẩm</span>
              <span className="font-medium">{totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Đơn hàng</span>
              <span className="font-medium">{vendor._count.orders}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Doanh thu</span>
              <span className="font-bold text-primary">{formatPrice(totalRevenue._sum.vendorEarnings || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {vendor.description && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Mô tả shop</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{vendor.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Quản Lý</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {vendor.status === "PENDING" && (
              <>
                <form action={updateVendorStatus}>
                  <input type="hidden" name="vendorId" value={vendor.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <Button type="submit"><Check className="mr-2 h-4 w-4" />Duyệt</Button>
                </form>
                <form action={updateVendorStatus}>
                  <input type="hidden" name="vendorId" value={vendor.id} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <Button type="submit" variant="destructive"><X className="mr-2 h-4 w-4" />Từ chối</Button>
                </form>
              </>
            )}
            {vendor.status === "APPROVED" && (
              <form action={updateVendorStatus}>
                <input type="hidden" name="vendorId" value={vendor.id} />
                <input type="hidden" name="status" value="SUSPENDED" />
                <Button type="submit" variant="outline"><Ban className="mr-2 h-4 w-4" />Tạm ngưng</Button>
              </form>
            )}
            {vendor.status === "SUSPENDED" && (
              <form action={updateVendorStatus}>
                <input type="hidden" name="vendorId" value={vendor.id} />
                <input type="hidden" name="status" value="APPROVED" />
                <Button type="submit"><Check className="mr-2 h-4 w-4" />Kích hoạt lại</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

