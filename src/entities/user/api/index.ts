// Queries
export {
  getCurrentUserProfile,
  getUserOrderStats,
  getUserRecentOrders,
} from "./queries";

// Actions
export { updateUserProfile, type UpdateProfileInput } from "./actions";

// Guards
export {
  requireAuth,
  requireRole,
  requireAdmin,
  hasRole,
  type UserRole,
  type AuthResult,
} from "./guards";
