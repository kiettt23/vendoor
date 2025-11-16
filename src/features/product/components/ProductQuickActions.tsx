"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleProductStatus } from "@/features/product/actions/toggle-product-status";
import { deleteProduct } from "@/features/product/actions/delete-product";
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

// ============================================
// TYPES
// ============================================

interface ProductQuickActionsProps {
  product: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

// ============================================
// PRODUCT QUICK ACTIONS
// ============================================

export function ProductQuickActions({ product }: ProductQuickActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle status
  const handleToggleStatus = async () => {
    startTransition(async () => {
      const result = await toggleProductStatus(product.id);

      if (result.success) {
        toast.success(
          product.isActive ? "Đã ẩn sản phẩm" : "Đã hiển thị sản phẩm"
        );
        router.refresh();
      } else {
        toast.error(result.error ?? "Có lỗi xảy ra");
      }
    });
  };

  // Delete product
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);

      if (result.success) {
        toast.success("Đã xóa sản phẩm");
        router.refresh();
      } else {
        toast.error(result.error ?? "Có lỗi xảy ra");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Edit button */}
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
      >
        <Edit className="mr-2 h-4 w-4" />
        Sửa
      </Button>

      {/* Toggle status button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleStatus}
        disabled={isPending}
      >
        {product.isActive ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>

      {/* Delete button with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isDeleting}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{product.name}</strong>
              ?
              <br />
              <br />
              Sản phẩm sẽ bị ẩn và không hiển thị trên shop nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
