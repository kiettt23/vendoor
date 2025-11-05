import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface CartState {
  total: number;
  cartItems: Record<string, number>; // productId -> quantity
}

let debounceTimer: NodeJS.Timeout | null = null;

export const uploadCart = createAsyncThunk(
  "cart/uploadCart",
  async (
    { getToken }: { getToken: () => Promise<string | null> },
    thunkAPI
  ) => {
    try {
      clearTimeout(debounceTimer as NodeJS.Timeout);
      debounceTimer = setTimeout(async () => {
        const { cartItems } = (thunkAPI.getState() as any).cart;
        const token = await getToken();
        await axios.post(
          "/api/cart",
          { cart: cartItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }, 1000);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (
    { getToken }: { getToken: () => Promise<string | null> },
    thunkAPI
  ) => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    total: 0,
    cartItems: {},
  } as CartState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]++;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]--;
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId];
        }
      }
      state.total -= 1;
    },
    deleteItemFromCart: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId]
        ? state.cartItems[productId]
        : 0;
      delete state.cartItems[productId];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cart;
      state.total = Object.values(
        action.payload.cart as Record<string, number>
      ).reduce((acc: number, item: number) => acc + item, 0);
    });
  },
});

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
