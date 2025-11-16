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
}

// ============================================
// PRODUCT FORM
// ============================================

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
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
      const result = await createProduct(data);

      if (result.success) {
        toast.success("Đã tạo sản phẩm thành công");
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
          toast.error(result.error || "Có lỗi xảy ra khi tạo sản phẩm");
        }
      }
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error("Có lỗi xảy ra khi tạo sản phẩm");
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
              Đang tạo...
            </>
          ) : (
            "Tạo sản phẩm"
          )}
        </Button>
      </div>
    </form>
  );
}
