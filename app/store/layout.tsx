import StoreLayout from "./_components/StoreLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireSeller } from "@/lib/auth";

export const metadata = {
  title: "Vendoor | Store Dashboard",
  description: "Store Dashboard",
};

export default async function RootStoreLayout({ children }) {
  // Require seller role (has store) - auto redirects if not seller
  await requireSeller();

  return (
    <TooltipProvider>
      <StoreLayout>{children}</StoreLayout>
    </TooltipProvider>
  );
}
