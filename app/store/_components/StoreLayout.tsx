"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import StoreNavbar from "./StoreNavbar";
import StoreSidebar from "./StoreSidebar";
import { useSession } from "@/lib/auth/client";

/**
 * Store Layout - Client Component
 * 
 * Security: Server layout (app/store/layout.tsx) already handles authorization
 * This component fetches store info for UI purposes only
 */
const StoreLayout = ({ children }) => {
  const { data: session, isPending } = useSession();
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!isPending && session?.user) {
        try {
          const response = await fetch("/api/store/get-my-store");
          if (response.ok) {
            const data = await response.json();
            setStoreInfo(data.store);
          }
        } catch (error) {
          console.error("Error fetching store:", error);
        } finally {
          setLoading(false);
        }
      } else if (!isPending) {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [session, isPending]);

  if (loading || isPending) {
    return <Loading />;
  }

  // Server already verified seller access - just render UI
  return (
    <div className="flex flex-col h-screen">
      <StoreNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <StoreSidebar storeInfo={storeInfo} />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StoreLayout;
