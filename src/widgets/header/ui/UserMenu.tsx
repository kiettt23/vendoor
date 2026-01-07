"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Package,
  Shield,
  Store,
  LogIn,
  UserPlus,
  Plus,
  User,
  X,
  Loader2,
  Check,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/shared/ui/dropdown-menu";
import { ROUTES, showToast, showErrorToast } from "@/shared/lib/constants";
import { signOut, useSession, authClient } from "@/shared/lib/auth";
import { cn } from "@/shared/lib/utils";

// Test accounts for Quick Login (dev only)
const TEST_ACCOUNTS = [
  {
    email: "admin@vendoor.com",
    password: "Test@123456",
    role: "Admin",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    email: "apple@vendoor.com",
    password: "Test@123456",
    role: "Vendor",
    icon: Store,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    email: "customer@vendoor.com",
    password: "Test@123456",
    role: "Customer",
    icon: User,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
] as const;

interface DeviceSession {
  session: {
    id: string;
    token: string;
    createdAt: Date;
  };
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface UserMenuProps {
  /** Initial user data from server for hydration */
  initialUser?: {
    name: string | null;
    email: string | null;
    roles: string[];
  } | null;
  /** Dropdown alignment */
  align?: "start" | "center" | "end";
  /** Show role-based links (vendor dashboard, admin panel) - for main header */
  showRoleLinks?: boolean;
}

function getUserInitial(name: string | null, email: string | null): string {
  const value = name || email || "";
  return value.charAt(0).toUpperCase() || "U";
}

export function UserMenu({
  initialUser,
  align = "end",
  showRoleLinks = false,
}: UserMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || [],
      }
    : initialUser ?? null;

  // Fetch all active sessions
  const fetchSessions = useCallback(async () => {
    try {
      const result = await authClient.multiSession.listDeviceSessions();
      if (result.data) {
        setSessions(result.data as DeviceSession[]);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, []); // No dependencies - stable function

  // Only fetch on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Quick login to test account (dev only)
  const handleQuickLogin = async (account: (typeof TEST_ACCOUNTS)[number]) => {
    setLoadingAccount(account.email);
    try {
      const result = await authClient.signIn.email({
        email: account.email,
        password: account.password,
      });

      if (result.error) {
        console.error("Login failed:", result.error);
        return;
      }

      router.refresh();
      await fetchSessions();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoadingAccount(null);
    }
  };

  // Switch to a different session
  const handleSwitchSession = async (sessionToken: string) => {
    setIsLoading(true);
    try {
      await authClient.multiSession.setActive({ sessionToken });
      router.refresh();
      await fetchSessions();
    } catch (error) {
      console.error("Switch session error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke a session
  const handleRevokeSession = async (
    e: React.MouseEvent,
    sessionToken: string
  ) => {
    e.stopPropagation();
    try {
      await authClient.multiSession.revoke({ sessionToken });
      await fetchSessions();
      router.refresh();
    } catch (error) {
      console.error("Revoke session error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("auth", "logoutSuccess");
      router.push("/");
      router.refresh();
    } catch {
      showErrorToast("generic");
    }
  };

  // Get other sessions (not current)
  const otherSessions = sessions.filter(
    (s) => s.user.email !== session?.user?.email
  );

  const isDev = process.env.NODE_ENV === "development";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Tài khoản">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : user ? (
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {getUserInitial(user.name, user.email)}
            </div>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-64">
        {user ? (
          <>
            {/* Current Account Info */}
            <div className="px-2 py-1.5 text-sm font-medium truncate">
              {user.name || user.email}
            </div>
            <div className="px-2 pb-1.5 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
            <DropdownMenuSeparator />

            {/* Account Links */}
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ACCOUNT} className="flex items-center gap-2">
                <User className="h-4 w-4" /> Tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ORDERS} className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Đơn hàng
              </Link>
            </DropdownMenuItem>
            {showRoleLinks && user.roles.includes("VENDOR") && (
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.VENDOR_DASHBOARD}
                  className="flex items-center gap-2"
                >
                  <Store className="h-4 w-4" /> Quản lý Shop
                </Link>
              </DropdownMenuItem>
            )}
            {showRoleLinks && user.roles.includes("ADMIN") && (
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_DASHBOARD}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" /> Admin Panel
                </Link>
              </DropdownMenuItem>
            )}

            {/* Quick Login - DEV ONLY */}
            {isDev && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                  Quick Login (Dev)
                </DropdownMenuLabel>
                {TEST_ACCOUNTS.map((account) => {
                  const Icon = account.icon;
                  const isCurrentUser = session?.user?.email === account.email;
                  const isLoggingIn = loadingAccount === account.email;

                  return (
                    <DropdownMenuItem
                      key={account.email}
                      onClick={() =>
                        !isCurrentUser && handleQuickLogin(account)
                      }
                      disabled={isLoggingIn}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isCurrentUser && "bg-accent"
                      )}
                    >
                      <div className={cn("p-1 rounded", account.bgColor)}>
                        <Icon className={cn("h-3 w-3", account.color)} />
                      </div>
                      <span className="flex-1 text-sm">{account.role}</span>
                      {isLoggingIn && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {isCurrentUser && !isLoggingIn && (
                        <Check className="h-3 w-3 text-green-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}

            {/* Other Sessions + Add Account */}
            <DropdownMenuSeparator />
            {otherSessions.length > 0 && (
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                Tài khoản khác ({otherSessions.length})
              </DropdownMenuLabel>
            )}
            {otherSessions.map((s) => {
              const accountInfo = TEST_ACCOUNTS.find(
                (acc) => acc.email === s.user.email
              );
              const Icon = accountInfo?.icon || User;

              return (
                <DropdownMenuItem
                  key={s.session.id}
                  onClick={() => handleSwitchSession(s.session.token)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={cn(
                      "p-1 rounded",
                      accountInfo?.bgColor || "bg-gray-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3 w-3",
                        accountInfo?.color || "text-gray-600"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">
                      {s.user.name || s.user.email.split("@")[0]}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Xóa phiên đăng nhập"
                    className="h-8 w-8 p-1.5 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleRevokeSession(e, s.session.token)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem asChild>
              <Link
                href={`${ROUTES.LOGIN}?addAccount=true`}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Thêm tài khoản
              </Link>
            </DropdownMenuItem>

            {/* Sign Out */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.LOGIN} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" /> Đăng nhập
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.REGISTER} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Đăng ký
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
