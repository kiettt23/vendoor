// Service
export { cartService, CartService } from "./lib/cart.service";

// Actions
export { addToCart } from "./actions/add-to-cart.action";
export { updateQuantity } from "./actions/update-quantity.action";
export { removeItem } from "./actions/remove-item.action";
export { syncCart } from "./actions/sync-cart.action";

// Queries
export { getCart } from "./queries/get-cart.query";
export { getCartProducts } from "./queries/get-cart-products.query";

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
