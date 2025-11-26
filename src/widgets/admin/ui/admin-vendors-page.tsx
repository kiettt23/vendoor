import Link from "next/link";
import { Store, ChevronRight, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { prisma } from "@/shared/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { VendorStatus } from "@prisma/client";

const statusMap: Record<VendorStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  APPROVED: { label: "Đã duyệt", variant: "default" },
  REJECTED: { label: "Từ chối", variant: "destructive" },
  SUSPENDED: { label: "Tạm ngưng", variant: "outline" },
};

interface AdminVendorsPageProps {
  status?: string;
}

async function approveVendor(formData: FormData) {
  "use server";
  const vendorId = formData.get("vendorId") as string;
  await prisma.vendorProfile.update({ where: { id: vendorId }, data: { status: "APPROVED" } });
  const vendor = await prisma.vendorProfile.findUnique({ where: { id: vendorId }, select: { userId: true } });
  if (vendor) {
    const user = await prisma.user.findUnique({ where: { id: vendor.userId }, select: { roles: true } });
    if (user && !user.roles.includes("VENDOR")) {
      await prisma.user.update({ where: { id: vendor.userId }, data: { roles: [...user.roles, "VENDOR"] } });
    }
  }
  revalidatePath("/admin/vendors");
}

async function rejectVendor(formData: FormData) {
  "use server";
  const vendorId = formData.get("vendorId") as string;
  await prisma.vendorProfile.update({ where: { id: vendorId }, data: { status: "REJECTED" } });
  revalidatePath("/admin/vendors");
}

export async function AdminVendorsPage({ status }: AdminVendorsPageProps) {
  const validStatuses: VendorStatus[] = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];
  const statusFilter = status && validStatuses.includes(status as VendorStatus) ? status as VendorStatus : undefined;
  
  const vendors = await prisma.vendorProfile.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    include: { user: { select: { name: true, email: true } }, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Nhà Bán</h1>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link key={s} href={`/admin/vendors${s !== "ALL" ? `?status=${s}` : ""}`}>
            <Button variant={status === s || (!status && s === "ALL") ? "default" : "outline"} size="sm">
              {s === "ALL" ? "Tất cả" : statusMap[s as VendorStatus]?.label || s}
            </Button>
          </Link>
        ))}
      </div>

      {vendors.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Không có nhà bán nào</h3>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => {
            const s = statusMap[vendor.status] || { label: vendor.status, variant: "secondary" as const };
            return (
              <Card key={vendor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{vendor.shopName}</CardTitle>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{vendor.user.name || vendor.user.email}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>{vendor._count.orders} đơn hàng</p>
                      <p>{new Date(vendor.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="flex gap-2">
                      {vendor.status === "PENDING" && (
                        <>
                          <form action={approveVendor}>
                            <input type="hidden" name="vendorId" value={vendor.id} />
                            <Button size="sm" type="submit"><Check className="mr-1 h-4 w-4" />Duyệt</Button>
                          </form>
                          <form action={rejectVendor}>
                            <input type="hidden" name="vendorId" value={vendor.id} />
                            <Button size="sm" variant="destructive" type="submit"><X className="mr-1 h-4 w-4" />Từ chối</Button>
                          </form>
                        </>
                      )}
                      <Link href={`/admin/vendors/${vendor.id}`}>
                        <Button size="sm" variant="outline"><ChevronRight className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
