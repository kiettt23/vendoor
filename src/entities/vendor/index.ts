export type {
  VendorProfile,
  VendorListItem,
  VendorDetail,
  VendorDashboardStats,
  VendorStatus,
  VendorAuthResult,
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
  FeaturedVendor,
} from "./model";

// ⚠️ Queries: import từ "@/entities/vendor/api/queries"

export {
  approveVendor,
  rejectVendor,
  updateVendorStatus,
  requireVendor,
} from "./api";
