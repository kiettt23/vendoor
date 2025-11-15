import { CheckoutPage } from "@/features/order/components/CheckoutPage";

// ============================================
// CHECKOUT PAGE ROUTE
// ============================================

/**
 * Checkout page route
 *
 * **URL:** /checkout
 * **Auth:** Required (customer only)
 *
 * **Flow:**
 * 1. Check cart not empty
 * 2. Show order review + checkout form
 * 3. Submit → Create orders → Redirect
 *
 * **Note:** Page is client component (needs cart state)
 */
export default function Page() {
  return <CheckoutPage />;
}
