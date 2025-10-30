export function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check invalid date
  if (isNaN(dateObj.getTime())) {
    return "Ngày không hợp lệ";
  }

  // e.g., "1 Thg 1, 2024"
  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function formatDateTime(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Ngày không hợp lệ";
  }

  // e.g., "1 Thg 1, 2024 lúc 15:45"
  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function formatPhone(phone) {
  if (!phone) return phone;

  const cleaned = phone.replace(/\D/g, "");
  // Vietnamese phone: 10 digits starting with 0
  const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

export function formatNumber(num) {
  // e.g., "1.234.567"
  return new Intl.NumberFormat("vi-VN").format(num);
}

export const formatters = {
  formatPrice,
  formatDate,
  formatDateTime,
  formatPhone,
  formatNumber,
};
