export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type InventoryFilter = "all" | StockStatus;

export interface InventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string | null;
  sku: string | null;
  stock: number;
  status: StockStatus;
  price: number;
  image: string | null;
}

export interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}
