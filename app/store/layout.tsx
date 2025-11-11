import StoreLayout from "./_components/StoreLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireSellerWithStore } from "@/features/auth/server";

export const metadata = {
  title: "Vendoor | Store Dashboard",
  description: "Store Dashboard",
};

export default async function RootStoreLayout({ children }) {
  await requireSellerWithStore();

  return (
    <TooltipProvider>
      <StoreLayout>{children}</StoreLayout>
    </TooltipProvider>
  );
}
