"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { updateProduct } from "@/features/products/index.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
}

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [existingImages, setExistingImages] = useState<string[]>(
    product.images
  );
  const [newImages, setNewImages] = useState<{ [key: string]: File | null }>({
    "1": null,
    "2": null,
    "3": null,
    "4": null,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      mrp: product.mrp,
      price: product.price,
      category: product.category,
    },
  });

  const handleImageUpload = (key: string, file: File | null) => {
    if (file) {
      setNewImages((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Validate images: either existing or new
      const totalImages =
        existingImages.length + Object.values(newImages).filter(Boolean).length;

      if (totalImages === 0) {
        throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
      }

      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("mrp", data.mrp.toString());
      formData.append("price", data.price.toString());
      formData.append("category", data.category);

      // Add existing images
      formData.append("existingImages", JSON.stringify(existingImages));

      // Add new images
      Object.values(newImages).forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      await toast.promise(updateProduct(formData), {
        loading: "Đang cập nhật sản phẩm...",
        success: "Đã cập nhật sản phẩm thành công!",
        error: (err) => err.message || "Không thể cập nhật sản phẩm",
      });

      router.push("/store/manage-product");
      router.refresh();
    } catch (error) {
      console.error("Update product error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Name */}
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="name">Tên sản phẩm</FieldLabel>
        <Input
          id="name"
          placeholder="VD: iPhone 15 Pro Max"
          {...form.register("name")}
        />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      {/* Description */}
      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="description">Mô tả</FieldLabel>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Mô tả chi tiết về sản phẩm..."
          {...form.register("description")}
        />
        <FieldError errors={[form.formState.errors.description]} />
      </Field>

      {/* Category */}
      <Field data-invalid={!!form.formState.errors.category}>
        <FieldLabel htmlFor="category">Danh mục</FieldLabel>
        <Input
          id="category"
          placeholder="VD: Điện thoại"
          {...form.register("category")}
        />
        <FieldError errors={[form.formState.errors.category]} />
      </Field>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!form.formState.errors.mrp}>
          <FieldLabel htmlFor="mrp">Giá gốc (đ)</FieldLabel>
          <Input
            id="mrp"
            type="number"
            placeholder="0"
            {...form.register("mrp", { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.mrp]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.price}>
          <FieldLabel htmlFor="price">Giá bán (đ)</FieldLabel>
          <Input
            id="price"
            type="number"
            placeholder="0"
            {...form.register("price", { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.price]} />
        </Field>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <FieldLabel>Hình ảnh hiện tại</FieldLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative h-32 border rounded-lg overflow-hidden">
                  <Image
                    fill
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Upload */}
      <div>
        <FieldLabel>Thêm hình ảnh mới (tùy chọn)</FieldLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {Object.keys(newImages).map((key) => (
            <div key={key}>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                {newImages[key] ? (
                  <div className="relative w-full h-full">
                    <Image
                      fill
                      src={URL.createObjectURL(newImages[key]!)}
                      alt={`New ${key}`}
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <UploadIcon size={24} />
                    <span className="text-xs">Tải lên</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(key, e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-slate-500 hover:bg-slate-600"
          disabled={form.formState.isSubmitting}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
