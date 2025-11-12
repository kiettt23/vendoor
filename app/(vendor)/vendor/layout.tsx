import StoreLayout from "./_components/StoreLayout";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { requireSellerWithStore } from "@/features/auth/index.server";

export const metadata = {
  title: "Vendoor | Store Dashboard",
  description: "Store Dashboard",
};

export default async function RootStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSellerWithStore();

  return (
    <TooltipProvider>
      <StoreLayout>{children}</StoreLayout>
    </TooltipProvider>
  );
}
