export type { User, SessionUser, UserSession, UserRole } from "./model";

// API - Queries
export {
  getCurrentUserProfile,
  getUserOrderStats,
  getUserRecentOrders,
} from "./api";

// API - Actions
export { updateUserProfile, type UpdateProfileInput } from "./api";

// API - Guards
export {
  requireAuth,
  requireRole,
  requireAdmin,
  hasRole,
  type AuthResult,
} from "./api";
