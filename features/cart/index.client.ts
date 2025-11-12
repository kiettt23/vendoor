// Hooks
export { useCart } from "./hooks/useCart";

// Components
export { CartCounter } from "./components/client/CartCounter.client";
export { AddToCartButton } from "./components/client/AddToCartButton.client";
export { CartClient } from "./components/client/CartClient.client";
export { CartBadge } from "./components/client/CartBadge.client";

// Schemas
export {
  addToCartSchema,
  updateQuantitySchema,
  removeItemSchema,
  syncCartSchema,
} from "./schemas/cart.schema";

// Types
export type * from "./types/cart.types";
export type {
  AddToCartInput,
  UpdateQuantityInput,
  RemoveItemInput,
  SyncCartInput,
} from "./schemas/cart.schema";
