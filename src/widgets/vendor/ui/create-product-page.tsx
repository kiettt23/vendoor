"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";

interface Category {
  id: string;
  name: string;
}

interface CreateProductPageProps {
  categories: Category[];
  onCreate: (data: ProductFormData) => Promise<{ success: boolean; productId?: string; error?: string }>;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
}

export function CreateProductPage({ categories, onCreate }: CreateProductPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: { isActive: true, stock: 0, price: 0 },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const result = await onCreate(data);
      if (result.success) {
        toast.success("Đã tạo sản phẩm");
        router.push("/vendor/products");
      } else {
        toast.error(result.error || "Lỗi");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/vendor/products"><ArrowLeft className="mr-2 h-4 w-4" />Danh sách sản phẩm</Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Thêm Sản Phẩm Mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Thông Tin Cơ Bản</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tên sản phẩm *</Label>
              <Input {...register("name", { required: "Bắt buộc" })} placeholder="iPhone 15 Pro Max" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea {...register("description")} placeholder="Mô tả chi tiết sản phẩm..." rows={4} />
            </div>
            <div>
              <Label>Danh mục *</Label>
              <Select onValueChange={(v) => setValue("categoryId", v)} defaultValue={watch("categoryId")}>
                <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Giá & Kho</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giá bán *</Label>
                <Input {...register("price", { required: "Bắt buộc", valueAsNumber: true })} type="number" min={0} />
              </div>
              <div>
                <Label>Giá so sánh</Label>
                <Input {...register("compareAtPrice", { valueAsNumber: true })} type="number" min={0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SKU *</Label>
                <Input {...register("sku", { required: "Bắt buộc" })} placeholder="SP-001" />
              </div>
              <div>
                <Label>Số lượng tồn kho *</Label>
                <Input {...register("stock", { required: "Bắt buộc", valueAsNumber: true })} type="number" min={0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trạng Thái</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hiển thị sản phẩm</p>
                <p className="text-sm text-muted-foreground">Sản phẩm sẽ xuất hiện trên cửa hàng</p>
              </div>
              <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang tạo...</> : <><Plus className="mr-2 h-4 w-4" />Tạo Sản Phẩm</>}
        </Button>
      </form>
    </div>
  );
}

