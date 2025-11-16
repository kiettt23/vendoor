"use client";

import { useEffect } from "react";
import { useFieldArray, Control, FieldErrors } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Trash2, Star } from "lucide-react";
import type { CreateProductInput } from "../schema";

// ============================================
// TYPES
// ============================================

interface VariantManagerProps {
  control: Control<CreateProductInput>;
  errors?: FieldErrors<CreateProductInput>;
}

// ============================================
// VARIANT MANAGER
// ============================================

export function VariantManager({ control, errors }: VariantManagerProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  // Auto-add first variant on mount
  useEffect(() => {
    if (fields.length === 0) {
      append({
        name: "",
        sku: "",
        price: 0,
        compareAtPrice: 0,
        stock: 0,
        isDefault: true,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add new variant
  const handleAdd = () => {
    append({
      name: "",
      sku: "",
      price: 0,
      compareAtPrice: 0,
      stock: 0,
      isDefault: false,
    });
  };

  // Set as default
  const handleSetDefault = (index: number) => {
    // Unmark all variants
    fields.forEach((_, i) => {
      if (i !== index) {
        update(i, { ...fields[i], isDefault: false });
      }
    });
    // Mark selected variant
    update(index, { ...fields[index], isDefault: true });
  };

  // Remove variant
  const handleRemove = (index: number) => {
    // Cannot remove if only 1 variant
    if (fields.length === 1) {
      return;
    }

    const isDefault = fields[index].isDefault;
    remove(index);

    // If removed variant was default, set first variant as default
    if (isDefault && fields.length > 1) {
      update(0, { ...fields[0], isDefault: true });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base">Biến thể sản phẩm</Label>
          <p className="text-sm text-muted-foreground">
            Tạo các phiên bản khác nhau của sản phẩm (màu sắc, size, v.v.)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm biến thể
        </Button>
      </div>

      {/* Variants list */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Biến thể {index + 1}</h4>
                  {field.isDefault && (
                    <Badge variant="warning" className="gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Mặc định
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Set as default button */}
                  {!field.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(index)}
                    >
                      Đặt mặc định
                    </Button>
                  )}

                  {/* Remove button */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Row 1: Name + SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.name`}>
                    Tên biến thể <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`variants.${index}.name`}
                    placeholder="VD: Đỏ - Size M"
                    {...control.register(`variants.${index}.name`)}
                  />
                  {errors?.variants?.[index]?.name && (
                    <p className="text-xs text-destructive">
                      {errors.variants[index].name.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.sku`}>
                    SKU{" "}
                    <span className="text-muted-foreground text-xs">
                      (Tùy chọn)
                    </span>
                  </Label>
                  <Input
                    id={`variants.${index}.sku`}
                    placeholder="VD: RED-M-001"
                    {...control.register(`variants.${index}.sku`)}
                  />
                  {errors?.variants?.[index]?.sku && (
                    <p className="text-xs text-destructive">
                      {errors.variants[index].sku.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Price + Compare Price + Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.price`}>
                    Giá bán (₫) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`variants.${index}.price`}
                    type="number"
                    placeholder="99000"
                    {...control.register(`variants.${index}.price`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.variants?.[index]?.price && (
                    <p className="text-xs text-destructive">
                      {errors.variants[index].price.message}
                    </p>
                  )}
                </div>

                {/* Compare At Price */}
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.compareAtPrice`}>
                    Giá gốc (₫){" "}
                    <span className="text-muted-foreground text-xs">
                      (Tùy chọn)
                    </span>
                  </Label>
                  <Input
                    id={`variants.${index}.compareAtPrice`}
                    type="number"
                    placeholder="149000"
                    {...control.register(`variants.${index}.compareAtPrice`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.variants?.[index]?.compareAtPrice && (
                    <p className="text-xs text-destructive">
                      {errors.variants[index].compareAtPrice.message}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.stock`}>
                    Số lượng <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`variants.${index}.stock`}
                    type="number"
                    placeholder="50"
                    {...control.register(`variants.${index}.stock`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.variants?.[index]?.stock && (
                    <p className="text-xs text-destructive">
                      {errors.variants[index].stock.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variants error */}
      {errors?.variants?.root && (
        <p className="text-sm text-destructive">
          {errors.variants.root.message}
        </p>
      )}

      {/* Info */}
      {fields.length === 0 && (
        <Card className="p-6 text-center border-dashed">
          <p className="text-sm text-muted-foreground">
            Chưa có biến thể nào. Click &quot;Thêm biến thể&quot; để tạo biến
            thể đầu tiên.
          </p>
        </Card>
      )}
    </div>
  );
}
