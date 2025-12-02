/**
 * Category Types
 *
 * Types cho Category entity, tận dụng Prisma generated types
 */

import type { CategoryModel } from "@/generated/prisma/client/models/Category";

/**
 * Base Category type từ Prisma
 */
export type Category = CategoryModel;

/**
 * Category với product count (cho admin list)
 */
export interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

/**
 * Category cho dropdown/select (minimal fields)
 */
export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}
