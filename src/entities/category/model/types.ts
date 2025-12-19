import type { CategoryModel } from "@/generated/prisma";

export type Category = CategoryModel;

export interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}
