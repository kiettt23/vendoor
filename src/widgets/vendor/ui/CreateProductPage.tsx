"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, ImagePlus } from "lucide-react";
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
        {/* Image Upload Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Hình Ảnh Sản Phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm">
                Tính năng upload hình ảnh sẽ sớm được cập nhật
              </p>
            </div>
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
