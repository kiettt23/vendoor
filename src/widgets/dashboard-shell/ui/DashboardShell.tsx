"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Logo } from "@/shared/ui/logo";
import { DASHBOARD_CONFIG, type DashboardType } from "@/shared/lib/constants";
import { UserMenu } from "@/widgets/header";

interface DashboardShellProps {
  type: DashboardType;
  children: React.ReactNode;
}

function DashboardHeader({ type }: { type: DashboardType }) {
  const config = DASHBOARD_CONFIG[type];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b hidden md:block">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="lg" showText={true} />
            <div className="h-6 w-px bg-border" />
            <span className="text-lg font-semibold text-muted-foreground">
              {config.title}
            </span>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function NavLinks({
  type,
  onItemClick,
}: {
  type: DashboardType;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const config = DASHBOARD_CONFIG[type];

  return (
    <nav className="space-y-1">
      {config.navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === config.baseRoute
            ? pathname === config.baseRoute
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function DashboardSidebar({ type }: { type: DashboardType }) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-24">
        <NavLinks type={type} />
      </div>
    </aside>
  );
}

function DashboardMobileHeader({ type }: { type: DashboardType }) {
  const config = DASHBOARD_CONFIG[type];

  return (
    <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
                <span>{config.title}</span>
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <NavLinks type={type} />
            </div>
          </SheetContent>
        </Sheet>
        <Logo size="sm" showText={false} />
        <UserMenu />
      </div>
    </div>
  );
}

export function DashboardShell({ type, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader type={type} />
      <DashboardMobileHeader type={type} />

      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex gap-6 py-4 md:py-6">
          <DashboardSidebar type={type} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
