"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

import { ROUTES } from "@/shared/lib/constants";
import { Button } from "@/shared/ui/button";
import type { CategoryOption } from "@/entities/category";
import { AIGenerateButton } from "@/features/ai-product-generator";
import {
  ImageUploadCard,
  BasicInfoCard,
  PriceStockCard,
  StatusCard,
} from "@/features/product-form";

import { useCreateProductForm } from "../model/use-create-product-form";

interface CreateProductPageProps {
  categories: CategoryOption[];
  vendorId: string;
}

export function CreateProductPage({
  categories,
  vendorId,
}: CreateProductPageProps) {
  const {
    form,
    isSubmitting,
    imageFile,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    handleAIGenerated,
    onSubmit,
  } = useCreateProductForm({ categories, vendorId });

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

      <h1 className="text-3xl font-bold mb-8">Thêm Sản Phẩm Mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ImageUploadCard
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemove={handleRemoveImage}
          disabled={isSubmitting}
          headerAction={
            <AIGenerateButton
              imageFile={imageFile}
              existingCategories={categories.map((c) => c.name)}
              onGenerated={handleAIGenerated}
              disabled={isSubmitting}
            />
          }
        />

        <BasicInfoCard
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          categories={categories}
        />

        <PriceStockCard register={register} errors={errors} />

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
              Đang tạo...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Sản Phẩm
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
