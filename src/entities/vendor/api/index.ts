/**
 * Vendor API - Barrel Export
 *
 * ⚠️ IMPORTANT: Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions, types)
 * Server Components: import queries từ "@/entities/vendor/api/queries"
 */

// Types (safe for client - type-only)
export type {
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
  FeaturedVendor,
} from "./queries";

// Actions (Server Actions - callable from Client Components)
export { approveVendor, rejectVendor, updateVendorStatus } from "./actions";

// Guards
export { requireVendor, type VendorAuthResult } from "./guards";
