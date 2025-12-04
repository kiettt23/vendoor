"use client";

import { ProductCard } from "@/entities/product/ui";
import type { ProductListItem } from "@/entities/product/model";
import { ProductCardActions } from "@/features/cart";

interface ProductGridProps {
  products: ProductListItem[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
  /** If false, renders ProductCard without cart actions */
  withCartActions?: boolean;
}

export function ProductGrid({
  products,
  columns = 4,
  emptyMessage = "Không có sản phẩm",
  withCartActions = true,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          renderActions={
            withCartActions
              ? (props) => <ProductCardActions {...props} />
              : undefined
          }
        />
      ))}
    </div>
  );
}
