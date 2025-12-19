"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { showToast, showErrorToast, ROUTES } from "@/shared/lib/constants";
import { uploadImageViaAPI } from "@/shared/lib/upload";
import {
  createProduct,
  productSchema,
  type ProductFormData,
} from "@/entities/product";
import type { CategoryOption } from "@/entities/category";
import type { AIProductInfo } from "@/features/ai-product-generator";

interface UseCreateProductFormParams {
  categories: CategoryOption[];
  vendorId: string;
}

export function useCreateProductForm({
  categories,
  vendorId,
}: UseCreateProductFormParams) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      categoryId: "",
      description: "",
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAIGenerated = (info: AIProductInfo) => {
    form.setValue("name", info.name);
    form.setValue(
      "description",
      `${info.shortDescription}\n\n${info.description}`
    );

    const matchedCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase().includes(info.suggestedCategory.toLowerCase()) ||
        info.suggestedCategory.toLowerCase().includes(cat.name.toLowerCase())
    );
    if (matchedCategory) {
      form.setValue("categoryId", matchedCategory.id);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        try {
          const uploadResult = await uploadImageViaAPI(imageFile);
          imageUrl = uploadResult.url;
        } catch (uploadError) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Không thể upload hình ảnh";
          showErrorToast("generic", message);
          setIsSubmitting(false);
          return;
        }
      }

      const result = await createProduct(vendorId, {
        ...data,
        description: data.description || "",
        imageUrl,
      });

      if (result.success) {
        showToast("vendor", "productCreated");
        router.push(ROUTES.VENDOR_PRODUCTS);
      } else {
        showErrorToast("generic", result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  return {
    form,
    isSubmitting,
    imageFile,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    handleAIGenerated,
    onSubmit,
  };
}
