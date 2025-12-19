import type { CategoryOption } from "@/entities/category";

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
}

export interface ProductFormProps {
  categories: CategoryOption[];
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  submitIcon: React.ReactNode;
}

export interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export interface ProductImageData {
  id: string;
  url: string;
}
