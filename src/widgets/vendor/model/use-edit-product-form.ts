"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { showToast, showErrorToast, ROUTES } from "@/shared/lib/constants";
import {
  updateProduct,
  deleteProduct,
  productEditSchema,
  type ProductEditFormData,
} from "@/entities/product";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  isActive: boolean;
}

interface UseEditProductFormParams {
  product: ProductData;
}

export function useEditProductForm({ product }: UseEditProductFormParams) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      isActive: product.isActive,
    },
  });

  const onSubmit = async (data: ProductEditFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateProduct(product.id, {
        ...data,
        description: data.description || "",
      });
      if (result.success) {
        showToast("vendor", "productUpdated");
        router.refresh();
      } else {
        showErrorToast("generic", result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Xác nhận xóa sản phẩm này?")) return;
    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        showToast("vendor", "productDeleted");
        router.push(ROUTES.VENDOR_PRODUCTS);
      } else {
        showErrorToast("generic", result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsDeleting(false);
  };

  return {
    form,
    isSubmitting,
    isDeleting,
    onSubmit,
    handleDelete,
  };
}
