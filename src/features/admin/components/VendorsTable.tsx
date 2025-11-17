"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { VendorStatusBadge } from "./VendorStatusBadge";
import { VendorActions } from "./VendorActions";
import { Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Vendor {
  id: string;
  shopName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  _count: {
    products: number;
    orders: number;
  };
}

interface VendorsTableProps {
  vendors: Vendor[];
}

export function VendorsTable({ vendors }: VendorsTableProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Không tìm thấy vendor nào</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Shop</TableHead>
            <TableHead>Chủ Shop</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Sản phẩm</TableHead>
            <TableHead className="text-center">Đơn hàng</TableHead>
            <TableHead>Tham gia</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.shopName}</TableCell>
              <TableCell>{vendor.user.name || "-"}</TableCell>
              <TableCell>{vendor.user.email}</TableCell>
              <TableCell>
                <VendorStatusBadge status={vendor.status} />
              </TableCell>
              <TableCell className="text-center">
                {vendor._count.products}
              </TableCell>
              <TableCell className="text-center">
                {vendor._count.orders}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(vendor.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/vendors/${vendor.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Link>
                  </Button>
                  <VendorActions
                    vendorId={vendor.id}
                    status={vendor.status}
                    shopName={vendor.shopName}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
