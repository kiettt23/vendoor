export const AUTH_ROUTES = {
  SIGN_IN: "/login",
  SIGN_UP: "/register",
  HOME: "/",
  ADMIN: "/admin",
  VENDOR: "/vendor",
  CREATE_STORE: "/create-store",
  ORDERS: "/orders",
  SETTINGS: "/settings",
} as const;

export const AUTH_ERROR_PARAMS = {
  AUTH_REQUIRED: "auth_required",
  ADMIN_REQUIRED: "admin_required",
  SELLER_REQUIRED: "seller_required",
  NO_STORE: "no_store",
  STORE_PENDING: "store_pending",
  STORE_DISABLED: "store_disabled",
} as const;

export const ERROR_MESSAGE_MAP: Record<string, string> = {
  [AUTH_ERROR_PARAMS.AUTH_REQUIRED]: "Bạn cần đăng nhập để tiếp tục",
  [AUTH_ERROR_PARAMS.ADMIN_REQUIRED]: "Bạn không có quyền Admin",
  [AUTH_ERROR_PARAMS.SELLER_REQUIRED]: "Bạn cần đăng ký Store để tiếp tục",
  [AUTH_ERROR_PARAMS.NO_STORE]: "Bạn chưa có Store. Vui lòng tạo Store",
  [AUTH_ERROR_PARAMS.STORE_PENDING]: "Store của bạn đang chờ phê duyệt",
  [AUTH_ERROR_PARAMS.STORE_DISABLED]: "Store của bạn đã bị vô hiệu hóa",
} as const;

export const SESSION_CONFIG = {
  MAX_SESSIONS: 5,
  SESSION_DURATION: 60 * 60 * 24 * 30,
  UPDATE_AGE: 60 * 60 * 24,
} as const;

export const ADMIN_CONFIG = {
  IMPERSONATION_DURATION: 60 * 60,
  DEFAULT_ROLE: "USER",
  ADMIN_ROLES: ["ADMIN"],
} as const;
