"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { CATEGORIES } from "@/configs/categories";
import { createProduct } from "@/features/products/index.server";
import {
  productSchema,
  type ProductFormData,
} from "@/features/products/index.client";
import { useAIImageAnalysis } from "@/lib/hooks/useAIImageAnalysis";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";

export default function StoreAddProduct() {
  const [images, setImages] = useState<Record<string, File | null>>({
    "1": null,
    "2": null,
    "3": null,
    "4": null,
  });

  const { analyzeImage, analyzing, aiUsed, resetAI } = useAIImageAnalysis();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      mrp: undefined,
      price: undefined,
      category: "",
    },
  });

  const handleImageUpload = async (key: string, file: File | null) => {
    if (!file) return;

    setImages((prev) => ({ ...prev, [key]: file }));

    // AI analysis for first image only
    if (key === "1") {
      const result = await analyzeImage(file);
      if (result) {
        if (result.name) form.setValue("name", result.name);
        if (result.description)
          form.setValue("description", result.description);
        if (result.category) form.setValue("category", result.category);
        if (result.mrp) form.setValue("mrp", result.mrp);
        if (result.price) form.setValue("price", result.price);
      }
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // Validate images
    const hasImages = Object.values(images).some((img) => img !== null);
    if (!hasImages) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("mrp", data.mrp.toString());
    formData.append("price", data.price.toString());
    formData.append("category", data.category);

    // Add images
    Object.values(images).forEach((img) => {
      if (img) formData.append("images", img);
    });

    const result = await createProduct(formData);
    toast.success(result.message);

    // Reset form
    form.reset();
    setImages({ "1": null, "2": null, "3": null, "4": null });
    resetAI(); // Reset AI state để có thể dùng lại cho sản phẩm tiếp theo
  };

  return (
    <form
      onSubmit={form.handleSubmit((data) =>
        toast.promise(onSubmit(data), { loading: "Đang thêm sản phẩm..." })
      )}
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Thêm <span className="text-slate-800 font-medium">Sản Phẩm Mới</span>
      </h1>

      <div className="mt-7">
        <p className="mb-4">Hình ảnh sản phẩm</p>
        <div className="flex gap-3">
          {Object.keys(images).map((key) => (
            <label
              key={key}
              htmlFor={`images${key}`}
              className="cursor-pointer"
            >
              <Image
                width={300}
                height={300}
                className="h-15 w-auto border border-slate-200 rounded"
                src={
                  images[key]
                    ? URL.createObjectURL(images[key]!)
                    : "/images/upload_area.svg"
                }
                alt={`Product image ${key}`}
              />
              <input
                type="file"
                accept="image/*"
                id={`images${key}`}
                onChange={(e) =>
                  handleImageUpload(key, e.target.files?.[0] || null)
                }
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <FieldGroup className="max-w-sm mt-6 space-y-6">
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Tên sản phẩm</FieldLabel>
          <Input
            id="name"
            placeholder="Nhập tên sản phẩm"
            aria-invalid={!!form.formState.errors.name}
            {...form.register("name")}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">Mô tả</FieldLabel>
          <Textarea
            id="description"
            rows={5}
            placeholder="Nhập mô tả sản phẩm"
            aria-invalid={!!form.formState.errors.description}
            {...form.register("description")}
          />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.mrp}>
            <FieldLabel htmlFor="mrp">Giá gốc (đ)</FieldLabel>
            <Input
              id="mrp"
              type="number"
              placeholder="0"
              aria-invalid={!!form.formState.errors.mrp}
              {...form.register("mrp", { valueAsNumber: true })}
            />
            {form.watch("mrp") > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {form.watch("mrp").toLocaleString("vi-VN")} đ
              </p>
            )}
            <FieldError errors={[form.formState.errors.mrp]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel htmlFor="price">Giá bán (đ)</FieldLabel>
            <Input
              id="price"
              type="number"
              placeholder="0"
              aria-invalid={!!form.formState.errors.price}
              {...form.register("price", { valueAsNumber: true })}
            />
            {form.watch("price") > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {form.watch("price").toLocaleString("vi-VN")} đ
                {form.watch("mrp") > form.watch("price") && (
                  <span className="ml-2 text-green-600 font-medium">
                    (Giảm{" "}
                    {Math.round(
                      ((form.watch("mrp") - form.watch("price")) /
                        form.watch("mrp")) *
                        100
                    )}
                    %)
                  </span>
                )}
              </p>
            )}
            <FieldError errors={[form.formState.errors.price]} />
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.category}>
          <FieldLabel htmlFor="category">Danh mục</FieldLabel>
          <select
            id="category"
            className="w-full p-2 px-4 outline-none border border-slate-200 rounded"
            aria-invalid={!!form.formState.errors.category}
            {...form.register("category")}
          >
            <option value="">Chọn danh mục</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameVi}
              </option>
            ))}
          </select>
          <FieldError errors={[form.formState.errors.category]} />
        </Field>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Đang thêm..." : "Thêm Sản Phẩm"}
        </Button>
      </FieldGroup>
    </form>
  );
}
