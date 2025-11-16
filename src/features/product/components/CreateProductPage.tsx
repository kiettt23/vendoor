import { getCategories } from "@/features/product/actions/get-categories";
import { ProductForm } from "./ProductForm";

// ============================================
// CREATE PRODUCT PAGE
// ============================================

export async function CreateProductPage() {
  // Fetch categories
  const result = await getCategories();

  // Handle error
  if (!result.success || !result.categories) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            {result.error ?? "Có lỗi xảy ra khi tải danh mục"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
        <p className="text-muted-foreground mt-1">
          Tạo sản phẩm mới cho shop của bạn
        </p>
      </div>

      {/* Form */}
      <ProductForm categories={result.categories} />
    </div>
  );
}
