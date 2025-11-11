export { useCart } from "./hooks/useCart";

export { CartCounter } from "./components/client/CartCounter.client";
export { AddToCartButton } from "./components/client/AddToCartButton.client";
export { CartClient } from "./components/client/CartClient.client";

export type { CartItem, Cart, CartProduct, CartState } from "./types/cart.types";

export {
  addToCartSchema,
  updateQuantitySchema,
  removeItemSchema,
  syncCartSchema,
  type AddToCartInput,
  type UpdateQuantityInput,
  type RemoveItemInput,
  type SyncCartInput,
} from "./schemas/cart.schema";
