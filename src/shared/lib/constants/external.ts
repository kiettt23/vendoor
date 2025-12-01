/**
 * Rate limiting
 */
export const RATE_LIMIT = {
  API_REQUESTS_PER_MINUTE: 60,
  UPLOAD_REQUESTS_PER_HOUR: 20,
} as const;

/**
 * External service URLs
 */
export const EXTERNAL_URLS = {
  CLOUDINARY_BASE: "https://res.cloudinary.com",
  VNPAY_SANDBOX: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  VNPAY_PRODUCTION: "https://vnpayment.vn/paymentv2/vpcpay.html",
} as const;
