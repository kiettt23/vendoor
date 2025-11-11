"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/features/auth/lib/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Store, Settings, LogOut, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeviceSession = {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    username?: string;
  };
};

export function UserButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [allSessions, setAllSessions] = useState<DeviceSession[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await authClient.multiSession.listDeviceSessions();
        if (sessions.data) {
          setAllSessions(sessions.data);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);
      }
    };

    if (session?.user) {
      loadSessions();
    }
  }, [session?.user]);

  if (isPending) {
    return <div className="size-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user.username?.slice(0, 2).toUpperCase() ||
    user.email?.slice(0, 2).toUpperCase() ||
    "??";

  const handleSignOut = async () => {
    const otherSessions = allSessions.filter(
      (s) => s.session.token !== session.session.token
    );

    if (otherSessions.length > 0) {
      try {
        await authClient.multiSession.setActive({
          sessionToken: otherSessions[0].session.token,
        });
        toast.success("Đã chuyển sang tài khoản khác");
        router.refresh();
      } catch (error) {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }
    } else {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    }
  };

  const handleSwitchSession = async (sessionToken: string) => {
    try {
      await authClient.multiSession.setActive({ sessionToken });
      toast.success("Đã chuyển tài khoản");
      router.refresh();
    } catch (error) {
      toast.error("Không thể chuyển tài khoản");
    }
  };

  const handleAddAccount = () => {
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          <Avatar className="size-8 cursor-pointer">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
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
          <Link href="/store" className="cursor-pointer">
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

        <DropdownMenuSeparator />

        {allSessions.length > 1 && (
          <>
            <DropdownMenuLabel>Tài khoản khác</DropdownMenuLabel>
            {allSessions
              .filter((s) => s.session.token !== session.session.token)
              .map((sessionData) => {
                const sessionUser = sessionData.user;
                const sessionInitials =
                  sessionUser.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) ||
                  sessionUser.username?.slice(0, 2).toUpperCase() ||
                  sessionUser.email?.slice(0, 2).toUpperCase() ||
                  "??";

                return (
                  <DropdownMenuItem
                    key={sessionData.session.token}
                    onClick={() =>
                      handleSwitchSession(sessionData.session.token)
                    }
                    className="cursor-pointer"
                  >
                    <Avatar className="size-6 mr-2">
                      <AvatarImage
                        src={sessionUser.image || undefined}
                        alt={sessionUser.name || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                        {sessionInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{sessionUser.name}</span>
                      <span className="text-xs text-muted-foreground">
                        @{sessionUser.username || sessionUser.email || "user"}
                      </span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
          </>
        )}

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
