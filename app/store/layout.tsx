import StoreLayout from "./_components/StoreLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "Vendoor | Store Dashboard",
  description: "Store Dashboard",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <TooltipProvider>
          <StoreLayout>{children}</StoreLayout>
        </TooltipProvider>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn fallbackRedirectUrl="/store" routing="hash"></SignIn>
        </div>
      </SignedOut>
    </>
  );
}
