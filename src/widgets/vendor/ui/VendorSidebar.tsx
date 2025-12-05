"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VENDOR_NAV_ITEMS } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-1 sticky top-24">
        {VENDOR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/vendor"
              ? pathname === "/vendor"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
