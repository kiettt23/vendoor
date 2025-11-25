/**
 * Custom Multi-Account Management
 * Không dùng Better Auth plugin - tự quản lý bằng localStorage
 */

import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("MultiAccountStorage");

export interface StoredAccount {
  userId: string;
  email: string;
  name: string | null;
  sessionToken: string;
  addedAt: number;
}

const STORAGE_KEY = "vendoor_accounts";
const MAX_ACCOUNTS = 5;

/**
 * Lấy tất cả accounts đã lưu
 */
export function getSavedAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const accounts: StoredAccount[] = JSON.parse(data);
    return accounts.sort((a, b) => b.addedAt - a.addedAt);
  } catch {
    return [];
  }
}

/**
 * Lưu account mới (sau khi login)
 */
export function saveAccount(account: Omit<StoredAccount, "addedAt">): void {
  if (typeof window === "undefined") return;

  try {
    let accounts = getSavedAccounts();

    // Remove account cũ nếu đã tồn tại (update token mới)
    accounts = accounts.filter((a) => a.userId !== account.userId);

    // Thêm account mới lên đầu
    accounts.unshift({
      ...account,
      addedAt: Date.now(),
    });

    // Giới hạn số lượng
    if (accounts.length > MAX_ACCOUNTS) {
      accounts = accounts.slice(0, MAX_ACCOUNTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    logger.error("Failed to save account", error);
  }
}

/**
 * Xóa account
 */
export function removeAccount(userId: string): void {
  if (typeof window === "undefined") return;

  try {
    let accounts = getSavedAccounts();
    accounts = accounts.filter((a) => a.userId !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    logger.error("Failed to remove account", error);
  }
}

/**
 * Switch sang account khác
 */
export function switchToAccount(sessionToken: string): void {
  if (typeof window === "undefined") return;

  try {
    // Update session token cookie
    document.cookie = `better-auth.session_token=${sessionToken}; path=/; max-age=604800`; // 7 days

    // Reload page để refresh session
    window.location.reload();
  } catch (error) {
    logger.error("Failed to switch account", error);
  }
}

/**
 * Sync account sau khi login thành công
 */
export function syncCurrentAccount(
  user: {
    id: string;
    email: string;
    name: string | null;
  },
  sessionToken: string
): void {
  saveAccount({
    userId: user.id,
    email: user.email,
    name: user.name,
    sessionToken: sessionToken,
  });
}
