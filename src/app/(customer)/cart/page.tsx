import { CartPage } from "@/features/cart/components/CartPage";

// ============================================
// ROUTE PAGE: /cart
// ============================================

/**
 * Cart page route
 *
 * Architecture (per FOLDER_STRUCTURE.md):
 * - app/ contains ONLY routing
 * - Business logic in features/
 * - Clean import from features
 */
export default function Page() {
  return <CartPage />;
}
