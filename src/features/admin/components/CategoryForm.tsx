"use client";

import { useState } from "react";
import { createCategory } from "../actions/create-category";
import { updateCategory } from "../actions/update-category";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "../schema/category.schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate
      const validated = createCategorySchema.parse(formData);

      let result;
      if (category) {
        result = await updateCategory({ ...validated, id: category.id });
      } else {
        result = await createCategory(validated);
      }

      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      if (error && typeof error === "object" && "errors" in error) {
        const fieldErrors: Record<string, string> = {};
        (error.errors as Array<{ path: string[]; message: string }>).forEach(
          (err) => {
            fieldErrors[err.path[0]] = err.message;
          }
        );
        setErrors(fieldErrors);
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateCategoryInput, value: string) => {
    setFormData((prev: CreateCategoryInput) => ({ ...prev, [field]: value }));
    // Auto-generate slug from name
    if (field === "name" && !category) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev: CreateCategoryInput) => ({ ...prev, slug }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên danh mục <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="VD: Điện tử"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          Slug <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="dien-tu"
          disabled={!!category}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug}</p>
        )}
        {category && (
          <p className="text-xs text-muted-foreground">
            Slug không thể thay đổi sau khi tạo
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Mô tả về danh mục..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL ảnh</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image}</p>
        )}
        {formData.image && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.image}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? "Cập nhật" : "Tạo danh mục"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}
