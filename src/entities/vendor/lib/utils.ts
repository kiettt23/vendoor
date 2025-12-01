/**
 * Format vendor status in Vietnamese
 *
 * @example
 * formatVendorStatus("PENDING") // "Chờ duyệt"
 */
export function formatVendorStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
  };
  return statusMap[status] || status;
}
