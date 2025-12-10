export const RATE_LIMIT = {
  API_REQUESTS_PER_MINUTE: 60,
  UPLOAD_REQUESTS_PER_HOUR: 20,
} as const;

export const EXTERNAL_URLS = {
  CLOUDINARY_BASE: "https://res.cloudinary.com",
  VNPAY_SANDBOX: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  VNPAY_PRODUCTION: "https://vnpayment.vn/paymentv2/vpcpay.html",
} as const;

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
