export type {
  User,
  SessionUser,
  UserSession,
  UserRole,
  AuthResult,
} from "./model";

// ⚠️ Queries: import từ "@/entities/user/api/queries"

export { updateUserProfile, type UpdateProfileInput } from "./api/actions";

export { requireAuth, requireRole, requireAdmin, hasRole } from "./api/guards";
