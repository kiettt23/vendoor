"use client";
import { PackageIcon, Search, ShoppingCart, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/lib/store";
import type { RootState } from "@/lib/store";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import { vi } from "@/lib/i18n";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const cartCount = useAppSelector((state: RootState) => state.cart.total);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${search}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-purple-600">Ven</span>door
            <Protect plan="plus">
              <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-500">
                plus
              </p>
            </Protect>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-5 xl:gap-6 text-slate-600">
            <Link
              href="/"
              className="whitespace-nowrap hover:text-purple-600 transition"
            >
              {vi.nav.home}
            </Link>
            <Link
              href="/shop"
              className="whitespace-nowrap hover:text-purple-600 transition"
            >
              {vi.nav.shop}
            </Link>
            <Link
              href="/create-store"
              className="whitespace-nowrap hover:text-purple-600 transition"
            >
              {vi.nav.createStore}
            </Link>
            <Link
              href="/pricing"
              className="whitespace-nowrap hover:text-purple-600 transition"
            >
              {vi.nav.member}
            </Link>
            <Link
              href="/orders"
              className="whitespace-nowrap hover:text-purple-600 transition"
            >
              {vi.nav.orders}
            </Link>

            {/* Desktop Search - visible on large screens */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-48 2xl:w-xs text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full flex-shrink-0 ml-2"
            >
              <Search size={16} className="text-slate-600 flex-shrink-0" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600 text-sm"
                type="text"
                placeholder={vi.nav.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* Search Icon for medium/large screens without full search bar */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="xl:hidden flex-shrink-0 hover:text-purple-600 transition"
            >
              <Search size={18} />
            </button>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600 flex-shrink-0 hover:text-purple-600 transition"
            >
              <ShoppingCart size={18} />
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {!user ? (
              <button
                onClick={() => openSignIn()}
                className="px-6 xl:px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full whitespace-nowrap flex-shrink-0 text-sm ml-1"
              >
                {vi.nav.login}
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label={vi.nav.myOrders}
                    onClick={() => router.push("/orders")}
                  ></UserButton.Action>
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile User Button + Search */}
          <div className="sm:hidden flex items-center gap-3">
            <button
              onClick={() => setShowMobileSearch(true)}
              className="text-slate-600"
            >
              <Search size={20} />
            </button>
            {user ? (
              <div>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<ShoppingCart size={16} />}
                      label={vi.nav.cart}
                      onClick={() => router.push("/cart")}
                    ></UserButton.Action>
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                {vi.nav.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/50 z-[100] xl:hidden flex flex-col">
          <div className="bg-white p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search size={20} className="text-slate-600 flex-shrink-0" />
              <input
                autoFocus
                className="flex-1 bg-slate-100 outline-none px-4 py-3 rounded-full placeholder-slate-600"
                type="text"
                placeholder={vi.nav.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition flex-shrink-0"
              >
                <XIcon size={20} className="text-slate-600" />
              </button>
            </form>
          </div>
          <div
            onClick={() => setShowMobileSearch(false)}
            className="flex-1 cursor-pointer"
          />
        </div>
      )}

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
