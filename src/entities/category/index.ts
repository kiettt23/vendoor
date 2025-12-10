// Types
export type { Category, CategoryWithCount, CategoryOption } from "./model";

// ⚠️ Queries KHÔNG được export từ barrel file vì chứa server-only code (prisma)
// Server Components: import trực tiếp từ "@/entities/category/api/queries"

// API - Actions (Server Actions - callable from Client Components)
export { createCategory, updateCategory, deleteCategory } from "./api";
