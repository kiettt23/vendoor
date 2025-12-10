import type { WishlistModel } from "@/generated/prisma";

export type WishlistItem = WishlistModel;

export interface WishlistItemWithProduct {
  id: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    isActive: boolean;
    variantId: string;
    vendor: {
      id: string;
      name: string;
    };
  };
}
