export type {
  VendorProfile,
  VendorListItem,
  VendorDetail,
  VendorDashboardStats,
  VendorStatus,
} from "./model";

export { formatVendorStatus } from "./lib";

// ⚠️ Queries KHÔNG được export từ barrel file vì chứa server-only code (prisma)
// Server Components: import trực tiếp từ "@/entities/vendor/api/queries"

// Actions (Server Actions - callable from Client Components)
export {
  approveVendor,
  rejectVendor,
  updateVendorStatus,
  requireVendor,
} from "./api";

export type {
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
  VendorAuthResult,
  FeaturedVendor,
} from "./api";
