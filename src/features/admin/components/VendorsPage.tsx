import { getVendors } from "../actions/get-vendors";
import { VendorsTable } from "./VendorsTable";
import { VendorStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VendorsPageProps {
  searchParams: {
    page?: string;
    status?: string;
    search?: string;
  };
}

export async function VendorsPage({ searchParams }: VendorsPageProps) {
  const page = Number(searchParams.page) || 1;
  const status = (searchParams.status as VendorStatus | "ALL") || "ALL";
  const search = searchParams.search || "";

  const result = await getVendors({
    page,
    pageSize: 20,
    status,
    search,
  });

  if (!result.success) {
    redirect("/login");
  }

  const { vendors, pagination } = result.data!;

  // Build URL with query params
  const buildUrl = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const merged = { page: String(page), status, search, ...newParams };

    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== "ALL" && value !== "") {
        params.set(key, String(value));
      }
    });

    return `/admin/vendors?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Vendors</h1>
        <p className="text-muted-foreground">
          Duyệt và quản lý các vendor trên nền tảng
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form action="/admin/vendors" method="GET" className="flex-1">
          <input type="hidden" name="status" value={status} />
          <Input
            name="search"
            placeholder="Tìm theo tên shop, email..."
            defaultValue={search}
            className="max-w-md"
          />
        </form>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => {
            window.location.href = buildUrl({ status: value, page: 1 });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Hiển thị {vendors.length} / {pagination.totalCount} vendors
        </span>
        {search && (
          <Link href="/admin/vendors" className="text-primary hover:underline">
            Xóa bộ lọc
          </Link>
        )}
      </div>

      {/* Table */}
      <VendorsTable vendors={vendors} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild disabled={page <= 1}>
              <Link href={buildUrl({ page: page - 1 })}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={page >= pagination.totalPages}
            >
              <Link href={buildUrl({ page: page + 1 })}>
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
