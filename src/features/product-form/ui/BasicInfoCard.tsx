"use client";

import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
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
import { FieldError } from "@/shared/ui/feedback/ErrorMessage";
import type { CategoryOption } from "@/entities/category";

interface BasicInfoCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  categories: CategoryOption[];
  defaultCategoryId?: string;
}

export function BasicInfoCard({
  register,
  errors,
  setValue,
  watch,
  categories,
  defaultCategoryId,
}: BasicInfoCardProps) {
  return (
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
          <FieldError message={errors.name?.message as string} />
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
            defaultValue={defaultCategoryId || watch("categoryId")}
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
          <FieldError message={errors.categoryId?.message as string} />
        </div>
      </CardContent>
    </Card>
  );
}
