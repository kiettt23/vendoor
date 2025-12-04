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

// API - Queries (Server Components only - DO NOT import from Client Components)
export {
  getCurrentUserProfile,
  getUserOrderStats,
  getUserRecentOrders,
} from "./api/queries";
