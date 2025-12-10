export type { User, SessionUser, UserSession, UserRole } from "./model";

// API - Actions (safe to import from Client Components)
export { updateUserProfile, type UpdateProfileInput } from "./api/actions";

// API - Guards (safe to import from Server Components only)
export {
  requireAuth,
  requireRole,
  requireAdmin,
  hasRole,
  type AuthResult,
} from "./api/guards";

// Note: For queries (getCurrentUserProfile, getUserOrderStats, getUserRecentOrders),
// import directly from "@/entities/user/api/queries"
// They use Prisma and cannot be imported from Client Components
