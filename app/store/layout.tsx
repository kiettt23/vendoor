import StoreLayout from "./_components/StoreLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "next/navigation";
import { checkIsSeller } from "@/lib/auth/";

export const metadata = {
  title: "Vendoor | Store Dashboard",
  description: "Store Dashboard",
};

export default async function RootAdminLayout({ children }) {
  // Check if user is authenticated seller with approved store
  const { isSeller, storeInfo } = await checkIsSeller();

  if (!isSeller) {
    // Redirect to login or create store page
    redirect("/create-store");
  }

  return (
    <TooltipProvider>
      <StoreLayout>{children}</StoreLayout>
    </TooltipProvider>
  );
}
