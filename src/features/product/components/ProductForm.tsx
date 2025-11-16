"use client";

import { useState, useTransition } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createProductSchema, type CreateProductInput } from "../schema";
import { createProduct } from "../actions/create-product";
import { ImageUploader } from "./ImageUploader";
import { VariantManager } from "./VariantManager";

// ============================================
// TYPES
// ============================================

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    variants: Array<{
      id?: string;
      name: string;
      sku: string | null;
      price: number;
      compareAtPrice: number | null;
      stock: number;
      isDefault: boolean;
    }>;
    images: Array<{
      id?: string;
      url: string;
      order: number;
    }>;
  };
}

// ============================================
// PRODUCT FORM
// ============================================

export function ProductForm({
  categories,
  mode = "create",
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit" && initialData;

  // Form setup - Don't use resolver in edit mode to avoid validation issues
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: isEditMode ? undefined : zodResolver(createProductSchema),
    defaultValues: isEditMode
      ? {
          name: initialData.name,
          description: initialData.description || "",
          categoryId: initialData.categoryId,
          variants: initialData.variants.map((v) => ({
            name: v.name,
            sku: v.sku || "",
            price: v.price,
            compareAtPrice: v.compareAtPrice || 0,
            stock: v.stock,
            isDefault: v.isDefault,
          })),
          images: initialData.images,
        }
      : {
          name: "",
          description: "",
          categoryId: "",
          variants: [],
          images: [],
        },
  });

  // Watch images
  const images = watch("images");

  // Handle form submit
  const onSubmit = async (data: CreateProductInput) => {
    console.log("Form submit triggered", { isEditMode, data });

    // Validate: Must have at least 1 image
    if (data.images.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh");
      return;
    }

    // Validate: Must have at least 1 variant
    if (data.variants.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 biến thể");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode) {
        // Update existing product
        console.log("Updating product with ID:", initialData.id);
        const { updateProduct } = await import("../actions/update-product");
        result = await updateProduct({
          id: initialData.id,
          ...data,
        });
        console.log("Update result:", result);
      } else {
        // Create new product
        console.log("Creating new product");
        result = await createProduct(data);
        console.log("Create result:", result);
      }

      if (result.success) {
        toast.success(
          isEditMode
            ? "Đã cập nhật sản phẩm thành công"
            : "Đã tạo sản phẩm thành công"
        );
        // Redirect to products list
        startTransition(() => {
          router.push("/vendor/products");
          router.refresh();
        });
      } else {
        if (result.fieldErrors) {
          // Show field errors
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              toast.error(`${field}: ${messages[0]}`);
            }
          });
        } else {
          toast.error(
            result.error ||
              (isEditMode
                ? "Có lỗi xảy ra khi cập nhật sản phẩm"
                : "Có lỗi xảy ra khi tạo sản phẩm")
          );
        }
      }
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error(
        isEditMode
          ? "Có lỗi xảy ra khi cập nhật sản phẩm"
          : "Có lỗi xảy ra khi tạo sản phẩm"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Áo Thun Nam Cao Cấp"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả sản phẩm{" "}
              <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về sản phẩm..."
              rows={5}
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Danh mục <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("categoryId", value)}
              defaultValue={isEditMode ? initialData.categoryId : undefined}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            images={images}
            onChange={(newImages) => setValue("images", newImages)}
            maxImages={10}
          />
          {errors.images && (
            <p className="text-xs text-destructive mt-2">
              {errors.images.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Biến thể & Giá</CardTitle>
        </CardHeader>
        <CardContent>
          <VariantManager
            control={control}
            errors={errors as FieldErrors<CreateProductInput>}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
            </>
          ) : isEditMode ? (
            "Cập nhật sản phẩm"
          ) : (
            "Tạo sản phẩm"
          )}
        </Button>
      </div>
    </form>
  );
}
