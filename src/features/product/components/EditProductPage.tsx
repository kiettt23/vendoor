import { getCategories } from "@/features/product/actions/get-categories";
import { getProductById } from "@/features/product/actions/get-product-by-id";
import { ProductForm } from "./ProductForm";
import { notFound } from "next/navigation";

// ============================================
// EDIT PRODUCT PAGE
// ============================================

interface EditProductPageProps {
  productId: string;
}

export async function EditProductPage({ productId }: EditProductPageProps) {
  // Fetch categories and product in parallel
  const [categoriesResult, productResult] = await Promise.all([
    getCategories(),
    getProductById(productId),
  ]);

  // Handle categories error
  if (!categoriesResult.success || !categoriesResult.categories) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            {categoriesResult.error ?? "Có lỗi xảy ra khi tải danh mục"}
          </p>
        </div>
      </div>
    );
  }

  // Handle product error
  if (!productResult.success || !productResult.product) {
    if (productResult.error === "Product not found") {
      notFound();
    }
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            {productResult.error ?? "Có lỗi xảy ra khi tải sản phẩm"}
          </p>
        </div>
      </div>
    );
  }

  const product = productResult.product;

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
        <p className="text-muted-foreground mt-1">
          Cập nhật thông tin sản phẩm: <strong>{product.name}</strong>
        </p>
      </div>

      {/* Form */}
      <ProductForm
        categories={categoriesResult.categories}
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          variants: product.variants,
          images: product.images,
        }}
      />
    </div>
  );
}
