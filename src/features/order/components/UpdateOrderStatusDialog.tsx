"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { updateOrderStatus } from "../actions/update-order-status";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ============================================
// UPDATE ORDER STATUS DIALOG
// ============================================

/**
 * Dialog to update order status
 *
 * **Features:**
 * - Status dropdown with allowed transitions only
 * - Tracking number input (required for SHIPPED)
 * - Vendor note textarea
 * - Loading state
 * - Toast notifications
 */

interface UpdateOrderStatusDialogProps {
  orderId: string;
  currentStatus: OrderStatus;
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Status options for dropdown
const STATUS_OPTIONS: Array<{
  value: OrderStatus;
  label: string;
  description: string;
}> = [
  {
    value: "PENDING",
    label: "Chờ xử lý",
    description: "Đơn hàng đang chờ vendor xử lý",
  },
  {
    value: "PROCESSING",
    label: "Đang xử lý",
    description: "Đang chuẩn bị hàng",
  },
  {
    value: "SHIPPED",
    label: "Đã gửi hàng",
    description: "Đã giao cho đơn vị vận chuyển",
  },
  {
    value: "DELIVERED",
    label: "Đã giao",
    description: "Đã giao hàng thành công",
  },
  {
    value: "CANCELLED",
    label: "Đã hủy",
    description: "Đơn hàng đã bị hủy",
  },
];

// Valid transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [],
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export function UpdateOrderStatusDialog({
  orderId,
  currentStatus,
  orderNumber,
  open,
  onOpenChange,
}: UpdateOrderStatusDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [vendorNote, setVendorNote] = useState("");

  // Filter allowed statuses based on current status
  const allowedStatuses = STATUS_OPTIONS.filter((option) =>
    VALID_TRANSITIONS[currentStatus].includes(option.value)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStatus) {
      toast.error("Vui lòng chọn trạng thái mới");
      return;
    }

    setLoading(true);

    try {
      const result = await updateOrderStatus({
        orderId,
        newStatus: newStatus as OrderStatus,
        trackingNumber: trackingNumber || undefined,
        vendorNote: vendorNote || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        router.refresh(); // Refresh page to show new status
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!loading) {
      onOpenChange(open);
      // Reset form when closing
      if (!open) {
        setNewStatus("");
        setTrackingNumber("");
        setVendorNote("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Đơn hàng: {orderNumber} • Trạng thái hiện tại:{" "}
            <span className="font-medium">
              {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái mới *</Label>
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as OrderStatus)}
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {allowedStatuses.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
                {allowedStatuses.length === 0 && (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    Không có trạng thái nào có thể chuyển đổi
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Number (required for SHIPPED) */}
          {newStatus === "SHIPPED" && (
            <div className="space-y-2">
              <Label htmlFor="tracking">
                Mã vận đơn *{" "}
                <span className="text-xs text-muted-foreground">
                  (Bắt buộc khi gửi hàng)
                </span>
              </Label>
              <Input
                id="tracking"
                placeholder="VD: VNP123456789"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                disabled={loading}
                required={newStatus === "SHIPPED"}
              />
            </div>
          )}

          {/* Vendor Note (optional) */}
          <div className="space-y-2">
            <Label htmlFor="note">
              Ghi chú nội bộ{" "}
              <span className="text-xs text-muted-foreground">(Tùy chọn)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="VD: Khách hàng yêu cầu giao vào buổi chiều"
              value={vendorNote}
              onChange={(e) => setVendorNote(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !newStatus}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
