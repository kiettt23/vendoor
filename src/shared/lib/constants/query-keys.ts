export const queryKeys = {
  products: {
    all: ["products"] as const,
    search: (query: string) => [...queryKeys.products.all, "search", query] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
  },
  cart: {
    all: ["cart"] as const,
    stock: (variantIds: string[]) => [...queryKeys.cart.all, "stock", ...variantIds.sort()] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
