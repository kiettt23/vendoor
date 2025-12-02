import Link from "next/link";
import { Store, ChevronRight, Check, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/lib";
import { VENDOR_STATUS_CONFIG, getStatusConfig } from "@/shared/lib/constants";
import { approveVendor, rejectVendor, getVendors } from "@/entities/vendor";
import type { VendorStatus } from "@prisma/client";

interface AdminVendorsPageProps {
  status?: string;
}

export async function AdminVendorsPage({ status }: AdminVendorsPageProps) {
  const validStatuses: VendorStatus[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "SUSPENDED",
  ];
  const statusFilter =
    status && validStatuses.includes(status as VendorStatus)
      ? (status as VendorStatus)
      : undefined;

  const vendors = await getVendors(statusFilter);

  const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Nhà Bán</h1>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/vendors${s !== "ALL" ? `?status=${s}` : ""}`}
          >
            <Button
              variant={
                status === s || (!status && s === "ALL") ? "default" : "outline"
              }
              size="sm"
            >
              {s === "ALL"
                ? "Tất cả"
                : getStatusConfig(s, VENDOR_STATUS_CONFIG).label}
            </Button>
          </Link>
        ))}
      </div>

      {vendors.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Không có nhà bán nào</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => {
            const s = getStatusConfig(vendor.status, VENDOR_STATUS_CONFIG);
            return (
              <Card key={vendor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {vendor.shopName}
                    </CardTitle>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vendor.user.name || vendor.user.email}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>{vendor._count.orders} đơn hàng</p>
                      <p>{formatDate(vendor.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      {vendor.status === "PENDING" && (
                        <>
                          <form action={approveVendor.bind(null, vendor.id)}>
                            <Button size="sm" type="submit">
                              <Check className="mr-1 h-4 w-4" />
                              Duyệt
                            </Button>
                          </form>
                          <form action={rejectVendor.bind(null, vendor.id)}>
                            <Button
                              size="sm"
                              variant="destructive"
                              type="submit"
                            >
                              <X className="mr-1 h-4 w-4" />
                              Từ chối
                            </Button>
                          </form>
                        </>
                      )}
                      <Link href={`/admin/vendors/${vendor.id}`}>
                        <Button size="sm" variant="outline">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
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
