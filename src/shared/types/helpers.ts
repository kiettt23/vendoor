/**
 * Type Utilities
 *
 * Các utility types hữu ích cho việc type inference và manipulation.
 */

/**
 * Extract return type of an async function (unwrapped from Promise)
 *
 * @example
 * ```ts
 * async function getUser() { return { id: "1", name: "John" }; }
 * type User = AsyncReturnType<typeof getUser>;
 * // { id: string; name: string }
 * ```
 */
export type AsyncReturnType<
  T extends (...args: unknown[]) => Promise<unknown>
> = Awaited<ReturnType<T>>;

/**
 * Extract array element type
 *
 * @example
 * ```ts
 * type User = ArrayElement<User[]>; // User
 * ```
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Make specific keys optional
 *
 * @example
 * ```ts
 * type Product = { id: string; name: string; description: string };
 * type CreateProduct = PartialBy<Product, 'id'>; // id is optional
 * ```
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific keys required
 *
 * @example
 * ```ts
 * type Product = { id: string; name?: string };
 * type ValidProduct = RequiredBy<Product, 'name'>; // name is required
 * ```
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Non-nullable version of a type
 *
 * @example
 * ```ts
 * type Product = { id: string | null };
 * type StrictProduct = DeepNonNullable<Product>; // { id: string }
 * ```
 */
export type DeepNonNullable<T> = {
  [K in keyof T]: DeepNonNullable<NonNullable<T[K]>>;
};

/**
 * Extract keys that have specific value type
 *
 * @example
 * ```ts
 * type Product = { id: string; price: number; stock: number };
 * type NumericKeys = KeysOfType<Product, number>; // "price" | "stock"
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Pick only keys that have specific value type
 *
 * @example
 * ```ts
 * type Product = { id: string; price: number; stock: number };
 * type NumericFields = PickByType<Product, number>; // { price: number; stock: number }
 * ```
 */
export type PickByType<T, V> = Pick<T, KeysOfType<T, V>>;

/**
 * Utility type for Prisma model with relations
 * Makes it easier to type query results with includes
 *
 * @example
 * ```ts
 * type ProductWithVendor = WithRelations<Product, {
 *   vendor: Vendor;
 *   category: Category;
 * }>;
 * ```
 */
export type WithRelations<T, R> = T & R;

/**
 * Type for Prisma _count aggregations
 *
 * @example
 * ```ts
 * type VendorWithCount = WithCount<Vendor, 'orders' | 'products'>;
 * // Vendor & { _count: { orders: number; products: number } }
 * ```
 */
export type WithCount<T, K extends string> = T & {
  _count: Record<K, number>;
};
