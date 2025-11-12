"use client";

import { useSession } from "../../../lib/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { User, Store, Settings, LogOut, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar.client";
import { SessionList } from "./SessionList.client";
import { useUserButton } from "./useUserButton";

export function UserButton() {
  const { data: session, isPending } = useSession();
  const { allSessions, handleSignOut, handleSwitchSession, handleAddAccount } =
    useUserButton(session as any);

  if (isPending) {
    return <div className="size-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          <UserAvatar
            image={user.image}
            name={user.name}
            email={user.email}
            username={user.username}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user.username || user.email || "user"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Đơn hàng của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/vendor" className="cursor-pointer">
            <Store className="mr-2 h-4 w-4" />
            Cửa hàng của tôi
          </Link>
        </DropdownMenuItem>

        {/* @ts-ignore - Better Auth type doesn't include role yet */}
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt
          </Link>
        </DropdownMenuItem>

        <SessionList
          sessions={allSessions}
          currentToken={session.session.token}
          onSwitchSession={handleSwitchSession}
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleAddAccount} className="cursor-pointer">
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm tài khoản
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
