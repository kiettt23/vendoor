export type {
  VendorProfile,
  VendorListItem,
  VendorDetail,
  VendorDashboardStats,
  VendorStatus,
} from "./model";

export { formatVendorStatus } from "./lib";

// API (Queries + Actions)
export {
  getVendors,
  getVendorById,
  getCurrentVendorProfile,
  getVendorDashboardStats,
  getVendorRecentOrders,
  getVendorDashboardData,
  // Admin queries
  getAdminDashboardStats,
  getPendingVendorsCount,
  getAdminRecentOrders,
  getVendorDetailForAdmin,
  // Actions
  approveVendor,
  rejectVendor,
  updateVendorStatus,
  // Guards
  requireVendor,
} from "./api";

export type {
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
  VendorAuthResult,
} from "./api";
