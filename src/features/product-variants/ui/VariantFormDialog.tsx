"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { showToast, showErrorToast } from "@/shared/lib/constants";
import { createVariant, updateVariant } from "../api/actions";
import {
  variantFormSchema,
  type VariantFormData,
  type CreateVariantData,
  type VariantItem,
} from "../model";

interface VariantFormDialogProps {
  productId: string;
  variant: VariantItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultCreateValues: VariantFormData = {
  name: null,
  color: null,
  size: null,
  price: 0,
  compareAtPrice: null,
  sku: "",
  stock: 0,
  isDefault: false,
};

function getVariantFormValues(variant: VariantItem): VariantFormData {
  return {
    name: variant.name,
    color: variant.color,
    size: variant.size,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    sku: variant.sku ?? "",
    stock: variant.stock,
    isDefault: variant.isDefault,
  };
}

export function VariantFormDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: VariantFormDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!variant;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: defaultCreateValues,
  });

  // Reset form khi variant thay đổi hoặc dialog mở
  useEffect(() => {
    if (open) {
      reset(variant ? getVariantFormValues(variant) : defaultCreateValues);
    }
  }, [open, variant, reset]);

  const onSubmit = async (data: VariantFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && variant) {
        const result = await updateVariant(variant.id, data);
        if (result.success) {
          showToast("vendor", "productUpdated");
          onOpenChange(false);
          router.refresh();
        } else {
          showErrorToast("generic", result.error);
        }
      } else {
        const createData: CreateVariantData = {
          name: data.name,
          color: data.color,
          size: data.size,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          sku: data.sku,
          stock: data.stock,
        };
        const result = await createVariant(productId, createData);
        if (result.success) {
          showToast("vendor", "productUpdated");
          reset();
          onOpenChange(false);
          router.refresh();
        } else {
          showErrorToast("generic", result.error);
        }
      }
    } catch (error) {
      console.error("VariantFormDialog submit error:", error);
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tên biến thể</Label>
            <Input
              {...register("name")}
              placeholder="VD: Đỏ - Size M"
            />
            <p className="text-xs text-muted-foreground">
              Để trống nếu dùng màu và size bên dưới
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <Input {...register("color")} placeholder="VD: Đỏ" />
            </div>
            <div className="space-y-2">
              <Label>Kích thước</Label>
              <Input {...register("size")} placeholder="VD: M, L, XL" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Giá bán (₫) *</Label>
              <Input
                {...register("price", { valueAsNumber: true })}
                type="number"
                min={0}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Giá gốc (₫)</Label>
              <Input
                {...register("compareAtPrice", { valueAsNumber: true })}
                type="number"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input {...register("sku")} />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tồn kho *</Label>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min={0}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || (isEditing && !isDirty)}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
