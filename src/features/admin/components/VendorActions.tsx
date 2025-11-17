"use client";

import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { approveVendor } from "../actions/approve-vendor";
import { rejectVendor } from "../actions/reject-vendor";
import { toast } from "sonner";
import { useState } from "react";
import { VendorStatus } from "@prisma/client";

interface VendorActionsProps {
  vendorId: string;
  status: VendorStatus;
  shopName: string;
}

export function VendorActions({
  vendorId,
  status,
  shopName,
}: VendorActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Only show actions for PENDING vendors
  if (status !== "PENDING") {
    return null;
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveVendor(vendorId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const result = await rejectVendor(vendorId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Approve Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="default" disabled={isApproving}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Duyệt
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyệt vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn duyệt vendor <strong>{shopName}</strong>?
              <br />
              Vendor sẽ có thể đăng nhập và tạo sản phẩm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={isRejecting}>
            <XCircle className="h-4 w-4 mr-1" />
            Từ chối
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn từ chối vendor <strong>{shopName}</strong>?
              <br />
              Vendor sẽ không thể đăng nhập vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
