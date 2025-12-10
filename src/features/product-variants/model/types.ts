export interface VariantItem {
  id: string;
  name: string | null;
  color: string | null;
  size: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  isDefault: boolean;
}
