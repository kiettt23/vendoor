import { CheckoutPage } from "@/widgets/checkout";

// Force dynamic to ensure fresh cart validation
export const dynamic = "force-dynamic";

export default function Page() {
  return <CheckoutPage />;
}
