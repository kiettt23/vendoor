"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { FieldError } from "@/shared/ui/feedback/ErrorMessage";

interface PriceStockCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

export function PriceStockCard({ register, errors }: PriceStockCardProps) {
  return (
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
            <FieldError message={errors.price?.message as string} />
          </div>
          <div className="space-y-2">
            <Label>Giá gốc (₫)</Label>
            <Input
              {...register("compareAtPrice", { valueAsNumber: true })}
              type="number"
              min={0}
              className="mt-1.5"
            />
            <FieldError message={errors.compareAtPrice?.message as string} />
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
            <FieldError message={errors.sku?.message as string} />
          </div>
          <div className="space-y-2">
            <Label>Số lượng tồn kho *</Label>
            <Input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              min={0}
              className="mt-1.5"
            />
            <FieldError message={errors.stock?.message as string} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
