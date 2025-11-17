"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrders } from "../actions/get-orders";
import { getVendors } from "../actions/get-vendors";
import { OrdersTable } from "./OrdersTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  platformFee: number;
  vendorEarnings: number;
  createdAt: Date;
  vendor: {
    shopName: string;
  };
  customer: {
    name: string | null;
    email: string;
  };
}

interface Vendor {
  id: string;
  shopName: string;
}

export function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const [filters, setFilters] = useState({
    status: (searchParams.get("status") as OrderStatus | "ALL") || "ALL",
    vendorId: searchParams.get("vendorId") || "",
    search: searchParams.get("search") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    loadOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadVendors = async () => {
    const result = await getVendors({ pageSize: 1000, status: "APPROVED" });
    if (result.success && result.data) {
      setVendors(
        result.data.vendors.map((v) => ({
          id: v.id,
          shopName: v.shopName,
        }))
      );
    }
  };

  const loadOrders = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await getOrders({
        page,
        pageSize: 20,
        status: filters.status !== "ALL" ? filters.status : undefined,
        vendorId: filters.vendorId || undefined,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      if (result.success && result.data) {
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    params.set("page", "1");
    if (newFilters.status !== "ALL") params.set("status", newFilters.status);
    if (newFilters.vendorId) params.set("vendorId", newFilters.vendorId);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);

    router.push(`/admin/orders?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
        <p className="text-muted-foreground">
          Xem và quản lý tất cả đơn hàng trên hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Mã đơn hàng..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="PENDING_PAYMENT">
                    Chờ thanh toán
                  </SelectItem>
                  <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                  <SelectItem value="PROCESSING">Đang chuẩn bị</SelectItem>
                  <SelectItem value="SHIPPED">Đang giao</SelectItem>
                  <SelectItem value="DELIVERED">Đã giao</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendor</label>
              <Select
                value={filters.vendorId}
                onValueChange={(value) => handleFilterChange("vendorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.shopName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Danh sách đơn hàng ({pagination.totalCount} đơn)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            <>
              <OrdersTable orders={orders} />

              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Trang {pagination.page} / {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
