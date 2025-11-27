/**
 * Vietnamese translations for Better Auth error messages
 */

const errorTranslations: Record<string, string> = {
  // Email errors
  "User already exists": "Email này đã được sử dụng",
  "Email already exists": "Email này đã được sử dụng",
  "User not found": "Tài khoản không tồn tại",
  "Invalid email": "Email không hợp lệ",
  "Email is required": "Vui lòng nhập email",

  // Password errors
  "Invalid password": "Mật khẩu không đúng",
  "Password is required": "Vui lòng nhập mật khẩu",
  "Password is too short": "Mật khẩu quá ngắn",
  "Password is too long": "Mật khẩu quá dài",
  "Passwords do not match": "Mật khẩu không khớp",

  // Credential errors
  "Invalid credentials": "Email hoặc mật khẩu không đúng",
  "Invalid email or password": "Email hoặc mật khẩu không đúng",
  "Incorrect password": "Mật khẩu không đúng",

  // Session errors
  "Session expired": "Phiên đăng nhập đã hết hạn",
  "Invalid session": "Phiên đăng nhập không hợp lệ",
  Unauthorized: "Vui lòng đăng nhập",

  // General errors
  "Something went wrong": "Có lỗi xảy ra",
  "Too many requests": "Quá nhiều yêu cầu, vui lòng thử lại sau",
  "Network error": "Lỗi kết nối mạng",
};

/**
 * Translate Better Auth error message to Vietnamese
 * @param message - Original error message from Better Auth
 * @returns Vietnamese translation or original message if not found
 */
export function translateAuthError(message: string | undefined): string {
  if (!message) return "Có lỗi xảy ra";

  // Check exact match first
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Check if message contains any known error pattern
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("already exists") ||
    lowerMessage.includes("already registered")
  ) {
    return "Email này đã được sử dụng";
  }

  if (
    lowerMessage.includes("not found") ||
    lowerMessage.includes("does not exist")
  ) {
    return "Tài khoản không tồn tại";
  }

  if (lowerMessage.includes("invalid") && lowerMessage.includes("password")) {
    return "Mật khẩu không đúng";
  }

  if (lowerMessage.includes("invalid") && lowerMessage.includes("credential")) {
    return "Email hoặc mật khẩu không đúng";
  }

  if (lowerMessage.includes("too short")) {
    return "Mật khẩu quá ngắn (tối thiểu 6 ký tự)";
  }

  if (lowerMessage.includes("too many")) {
    return "Quá nhiều yêu cầu, vui lòng thử lại sau";
  }

  // Return original message if no translation found
  return message;
}
