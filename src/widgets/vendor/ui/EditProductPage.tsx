"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { ArrowLeft, Save, Loader2, Trash2, ImagePlus } from "lucide-react";
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
  updateProduct,
  deleteProduct,
} from "@/entities/product/api/actions";
import {
  productSchema,
  type ProductFormData,
} from "@/entities/product/model";
import type { CategoryOption } from "@/entities/category";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  isActive: boolean;
  images: { id: string; url: string }[];
  variants: {
    id: string;
    name: string | null;
    price: number;
    compareAtPrice: number | null;
    sku: string | null;
    stock: number;
    isDefault: boolean;
  }[];
}

interface EditProductPageProps {
  product: ProductData;
  categories: CategoryOption[];
}

export function EditProductPage({ product, categories }: EditProductPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      isActive: product.isActive,
      price: defaultVariant?.price || 0,
      compareAtPrice: defaultVariant?.compareAtPrice || undefined,
      sku: defaultVariant?.sku ?? "",
      stock: defaultVariant?.stock || 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
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
        showCustomToast.error(result.error);
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
        router.push("/vendor/products");
      } else {
        showCustomToast.error(result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsDeleting(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/vendor/products">
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
        {/* Image section */}
        <Card>
          <CardHeader>
            <CardTitle>Hình Ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-24 w-24 rounded overflow-hidden bg-muted"
                  >
                    <OptimizedImage
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-sm">
                  Tính năng upload hình ảnh sẽ sớm được cập nhật
                </p>
              </div>
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
              <Input {...register("name")} className="mt-1.5" />
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
                  <SelectValue />
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
                <Label>Giá gốc (₫)</Label>
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
                <Input {...register("sku")} className="mt-1.5" />
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
