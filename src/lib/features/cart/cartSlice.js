import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ getToken }) => {
    const token = await getToken();
    const response = await axios.get("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const uploadCart = createAsyncThunk(
  "cart/uploadCart",
  async ({ getToken }, { getState }) => {
    const token = await getToken();
    const cartItems = getState().cart.cartItems;

    // Convert cartItems object to cart array format for API
    const cart = Object.entries(cartItems).map(([id, quantity]) => ({
      id,
      quantity,
    }));

    const response = await axios.post(
      "/api/cart",
      { cart },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const initialState = {
  cartItems: {}, // { productId: quantity }
  total: 0, // total quantity
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId] += 1;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      if (state.cartItems[productId]) {
        if (state.cartItems[productId] > 1) {
          state.cartItems[productId] -= 1;
          state.total -= 1;
        } else {
          delete state.cartItems[productId];
          state.total -= 1;
        }
      }
    },

    deleteItemFromCart: (state, action) => {
      const productId = action.payload;
      if (state.cartItems[productId]) {
        state.total -= state.cartItems[productId];
        delete state.cartItems[productId];
      }
    },

    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { cart: {...} } - object format (already correct)
        // or { cart: [] } - array format (need to convert)
        if (action.payload.cart) {
          const cart = action.payload.cart;

          // If cart is array, convert to object
          if (Array.isArray(cart)) {
            state.cartItems = cart.reduce((acc, item) => {
              acc[item.id] = item.quantity;
              return acc;
            }, {});
          } else {
            // If already object, use directly
            state.cartItems = cart;
          }

          // Recalculate total
          state.total = Object.values(state.cartItems).reduce(
            (sum, quantity) => sum + quantity,
            0
          );
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Upload cart
      .addCase(uploadCart.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { addToCart, removeFromCart, deleteItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
