/**
 * Category API - Barrel Export
 *
 * ⚠️ IMPORTANT: Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions, types)
 * Server Components: import queries từ "@/entities/category/api/queries"
 */

// Actions (Server Actions - callable from Client Components)
export { createCategory, updateCategory, deleteCategory } from "./actions";
