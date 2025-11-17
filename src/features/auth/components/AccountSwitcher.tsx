"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/shared/lib/auth-client";
import {
  getSavedAccounts,
  removeAccount,
  switchToAccount,
  syncCurrentAccount,
  type StoredAccount,
} from "@/features/auth/lib/multi-account-storage";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export function AccountSwitcher() {
  const { data: currentSession } = useSession();
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAccounts = () => {
    if (!currentSession) return;

    // Sync current account to localStorage
    syncCurrentAccount(
      {
        id: currentSession.user.id,
        email: currentSession.user.email,
        name: currentSession.user.name,
      },
      currentSession.session.token
    );

    // Load all saved accounts
    const savedAccounts = getSavedAccounts();
    setAccounts(savedAccounts);
  };

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession]);

  const handleSwitch = (account: StoredAccount) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      switchToAccount(account.sessionToken);
      // Page will reload automatically
    } catch (error) {
      console.error("Failed to switch account:", error);
      toast.error("Không thể chuyển tài khoản");
      setIsLoading(false);
    }
  };

  const handleRevoke = (account: StoredAccount) => {
    if (account.userId === currentSession?.user.id) {
      toast.error("Không thể xóa tài khoản đang active");
      return;
    }

    removeAccount(account.userId);
    toast.success("Đã xóa tài khoản");
    loadAccounts();
  };

  // Don't show if no session
  if (!currentSession) {
    return null;
  }

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const hasMultipleAccounts = accounts.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0"
          disabled={isLoading}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(
                currentSession.user.name || currentSession.user.email
              )}
            </AvatarFallback>
          </Avatar>
          {hasMultipleAccounts && (
            <Badge
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {accounts.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        {/* Header */}
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Tài khoản</span>
            {hasMultipleAccounts && (
              <span className="text-xs text-muted-foreground">
                {accounts.length} tài khoản
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* All Accounts (Clerk style - show all including active) */}
        <div className="space-y-1 py-2">
          {accounts.map((account) => {
            const isActive = account.userId === currentSession.user.id;
            return (
              <div
                key={account.userId}
                className={cn(
                  "group relative flex items-start gap-3 rounded-lg p-3 transition-colors",
                  isActive ? "bg-accent" : "hover:bg-accent/50 cursor-pointer"
                )}
                onClick={() => !isActive && handleSwitch(account)}
              >
                {/* Avatar */}
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback
                    className={cn(
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {getInitials(account.name || account.email)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {account.name || "Unknown"}
                    </p>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {account.email}
                  </p>
                </div>

                {/* Remove button (show on hover for non-active) */}
                {!isActive && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevoke(account);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Add Account */}
        <DropdownMenuItem asChild>
          <a href="/login" className="cursor-pointer mt-1">
            <Plus className="mr-2 h-4 w-4" />
            <span>Thêm tài khoản</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
