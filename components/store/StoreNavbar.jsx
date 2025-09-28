"use client";
import Link from "next/link";

const StoreNavbar = () => {
  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-purple-600">Ven</span>door
        <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-500">
          store
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <p>Hi, Kiệt</p>
      </div>
    </div>
  );
};

export default StoreNavbar;
