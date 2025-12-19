"use client";

import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";

import { ROUTES } from "@/shared/lib/constants";
import { Button } from "@/shared/ui/button";
import type { CategoryOption } from "@/entities/category";
import type { VendorProductForEdit } from "@/entities/product/api/vendor-product.queries";
import { VariantManager } from "@/features/product-variants";
import {
  ImageUploadCard,
  BasicInfoCard,
  StatusCard,
  type ProductImageData,
} from "@/features/product-form";

import { useEditProductForm } from "../model/use-edit-product-form";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  isActive: boolean;
  images: ProductImageData[];
  variants: {
    id: string;
    name: string | null;
    color: string | null;
    size: string | null;
    price: number;
    compareAtPrice: number | null;
    sku: string | null;
    stock: number;
    isDefault: boolean;
  }[];
}

interface EditProductPageProps {
  product: NonNullable<VendorProductForEdit>;
  categories: CategoryOption[];
}

export function EditProductPage({ product, categories }: EditProductPageProps) {
  const {
    form,
    isSubmitting,
    isDeleting,
    onSubmit,
    handleDelete,
  } = useEditProductForm({ product });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={ROUTES.VENDOR_PRODUCTS}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Danh sách sản phẩm
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Chỉnh Sửa Sản Phẩm</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ImageUploadCard
          title="Hình Ảnh"
          imagePreview={null}
          onImageChange={() => {}}
          onRemove={() => {}}
          existingImages={product.images}
        />

        <BasicInfoCard
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          categories={categories}
          defaultCategoryId={product.categoryId}
        />

        {/* Variant Manager - outside form since it has its own actions */}
        <VariantManager productId={product.id} variants={product.variants} />

        <StatusCard setValue={setValue} watch={watch} />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu Thay Đổi
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
