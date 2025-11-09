"use client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useSession } from "@/lib/auth/";
import Link from "next/link";
import { vi } from "@/lib/i18n";

const AdminNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-purple-600">Ven</span>door
        <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-500">
          {vi.admin.admin}
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <p>
          {vi.common.hi}, {firstName}
        </p>
        <UserButton />
      </div>
    </div>
  );
};

export default AdminNavbar;
