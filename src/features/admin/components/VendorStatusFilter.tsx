"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { VendorStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

interface VendorStatusFilterProps {
  currentStatus: VendorStatus | "ALL";
  currentSearch: string;
}

export function VendorStatusFilter({
  currentStatus,
  currentSearch,
}: VendorStatusFilterProps) {
  const router = useRouter();

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to page 1 when filter changes

    // Only add status if not "ALL"
    if (value !== "ALL") {
      params.set("status", value);
    }

    // Preserve search filter
    if (currentSearch) {
      params.set("search", currentSearch);
    }

    router.push(`/admin/vendors?${params.toString()}`);
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
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
  );
}
