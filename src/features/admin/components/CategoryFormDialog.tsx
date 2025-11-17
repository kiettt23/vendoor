"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Cập nhật thông tin danh mục"
              : "Điền thông tin để tạo danh mục mới"}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          category={category || undefined}
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
