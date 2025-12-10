"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, Shield, Store, LogIn, UserPlus, User } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ROUTES, showToast, showErrorToast } from "@/shared/lib/constants";
import { signOut, useSession } from "@/shared/lib/auth";

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

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || [],
      }
    : initialUser ?? null;

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Tài khoản">
          {user ? (
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
      <DropdownMenuContent align={align} className="w-48">
        {user ? (
          <>
            <div className="px-2 py-1.5 text-sm font-medium truncate">
              {user.name || user.email}
            </div>
            <DropdownMenuSeparator />
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
