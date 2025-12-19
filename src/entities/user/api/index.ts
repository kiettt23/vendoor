export { updateUserProfile, type UpdateProfileInput } from "./actions";

export { requireAuth, requireRole, requireAdmin, hasRole } from "./guards";

export type { AuthResult } from "../model/types";