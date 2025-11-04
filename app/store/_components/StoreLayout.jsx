"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import StoreNavbar from "./StoreNavbar";
import StoreSidebar from "./StoreSidebar";
import { vi } from "@/lib/i18n";
import { checkIsSeller } from "./actions";

const StoreLayout = ({ children }) => {
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);

  const fetchIsSeller = async () => {
    try {
      const { isSeller, storeInfo } = await checkIsSeller();
      setIsSeller(isSeller);
      setStoreInfo(storeInfo);
    } catch (error) {
      // Error fetching seller status
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIsSeller();
  }, []);

  return loading ? (
    <Loading />
  ) : isSeller ? (
    <div className="flex flex-col h-screen">
      <StoreNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <StoreSidebar storeInfo={storeInfo} />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
        {vi.common.unauthorized}
      </h1>
      <Link
        href="/"
        className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
      >
        {vi.common.goHome} <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
};

export default StoreLayout;
