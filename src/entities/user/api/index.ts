// Actions (safe to import from Client Components)
export { updateUserProfile, type UpdateProfileInput } from "./actions";

// Guards (safe to import from Server Components only)
export {
  requireAuth,
  requireRole,
  requireAdmin,
  hasRole,
  type UserRole,
  type AuthResult,
} from "./guards";

// Note: For queries (getCurrentUserProfile, getUserOrderStats, getUserRecentOrders),
// import directly from "@/entities/user/api/queries"
// They use Prisma and cannot be imported from Client Components
