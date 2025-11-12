"use client";
import { UserButton, useSession } from "@/features/auth/index.client";
import Link from "next/link";

const StoreNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const firstName =
    user?.name?.split(" ").filter((n) => n)[0] ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-purple-600">Ven</span>door
        <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-500">
          Cửa hàng
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <p>Xin chào, {firstName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default StoreNavbar;
