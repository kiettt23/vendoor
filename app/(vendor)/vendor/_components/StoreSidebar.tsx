"use client";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface StoreSidebarProps {
  storeInfo: any;
}

export default function StoreSidebar({ storeInfo }: StoreSidebarProps) {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Tổng quan", href: "/vendor", icon: HomeIcon },
    {
      name: "Thêm sản phẩm",
      href: "/vendor/add-product",
      icon: SquarePlusIcon,
    },
    {
      name: "Quản lý sản phẩm",
      href: "/vendor/manage-product",
      icon: SquarePenIcon,
    },
    { name: "Đơn hàng", href: "/vendor/orders", icon: LayoutListIcon },
    { name: "Cài đặt", href: "/vendor/settings", icon: SettingsIcon },
  ];

  return (
    <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <Image
          className="w-14 h-14 rounded-full shadow-md object-cover"
          src={storeInfo?.logo || "/images/avatar_placeholder.png"}
          alt={storeInfo?.name || "Store"}
          width={80}
          height={80}
        />
        <p className="text-slate-700">{storeInfo?.name}</p>
      </div>

      <div className="max-sm:mt-6">
        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${
              pathname === link.href && "bg-slate-100 sm:text-slate-600"
            }`}
          >
            <link.icon size={18} className="sm:ml-5" />
            <p className="max-sm:hidden">{link.name}</p>
            {pathname === link.href && (
              <span className="absolute bg-purple-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
