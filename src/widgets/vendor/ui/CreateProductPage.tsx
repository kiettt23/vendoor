"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { ArrowLeft, Plus, Loader2, ImagePlus, X } from "lucide-react";
import {
  showToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import {
  createProduct,
  productSchema,
  type ProductFormData,
} from "@/entities/product";
import type { CategoryOption } from "@/entities/category";
import {
  AIGenerateButton,
  type AIProductInfo,
} from "@/features/ai-product-generator";

interface CreateProductPageProps {
  categories: CategoryOption[];
  vendorId: string;
}

export function CreateProductPage({
  categories,
  vendorId,
}: CreateProductPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      stock: 0,
      price: 0,
      categoryId: "",
      description: "",
    },
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle AI generated info
  const handleAIGenerated = (info: AIProductInfo) => {
    setValue("name", info.name);
    setValue("description", `${info.shortDescription}\n\n${info.description}`);

    // Find matching category
    const matchedCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase().includes(info.suggestedCategory.toLowerCase()) ||
        info.suggestedCategory.toLowerCase().includes(cat.name.toLowerCase())
    );
    if (matchedCategory) {
      setValue("categoryId", matchedCategory.id);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createProduct(vendorId, {
        ...data,
        description: data.description || "",
      });
      if (result.success) {
        showToast("vendor", "productCreated");
        router.push("/vendor/products");
      } else {
        showCustomToast.error(result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/vendor/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Danh sách sản phẩm
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Thêm Sản Phẩm Mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hình Ảnh Sản Phẩm</CardTitle>
            <AIGenerateButton
              imageFile={imageFile}
              existingCategories={categories.map((c) => c.name)}
              onGenerated={handleAIGenerated}
              disabled={isSubmitting}
            />
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative">
                <div className="relative aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-sm mb-2">
                    Nhấn để chọn hình ảnh
                  </p>
                  <p className="text-muted-foreground/70 text-xs">
                    JPG, PNG, WebP, GIF (tối đa 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Cơ Bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Tên sản phẩm *</Label>
              <Input
                {...register("name")}
                placeholder="iPhone 15 Pro Max"
                className="mt-1.5"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                {...register("description")}
                placeholder="Mô tả chi tiết sản phẩm..."
                rows={4}
                className="mt-1.5"
              />
            </div>
            <div className="space-y-2">
              <Label>Danh mục *</Label>
              <Select
                onValueChange={(v) => setValue("categoryId", v)}
                defaultValue={watch("categoryId")}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Giá & Kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giá bán (₫) *</Label>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="mt-1.5"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Giá so sánh (₫)</Label>
                <Input
                  {...register("compareAtPrice", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  {...register("sku")}
                  placeholder="SP-001"
                  className="mt-1.5"
                />
                {errors.sku && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.sku.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Số lượng tồn kho *</Label>
                <Input
                  {...register("stock", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="mt-1.5"
                />
                {errors.stock && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng Thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hiển thị sản phẩm</p>
                <p className="text-sm text-muted-foreground">
                  Sản phẩm sẽ xuất hiện trên cửa hàng
                </p>
              </div>
              <Switch
                checked={watch("isActive")}
                onCheckedChange={(v) => setValue("isActive", v)}
              />
            </div>
          </CardContent>
        </Card>

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
