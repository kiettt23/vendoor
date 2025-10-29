import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk
export const fetchAddress = createAsyncThunk(
  "address/fetchAddress",
  async ({ getToken }) => {
    const token = await getToken();
    const response = await axios.get("/api/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      state.loading = false;
    },

    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },

    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(
        (addr) => addr.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.address || [];
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setSelectedAddress,
  setLoading,
  setError,
} = addressSlice.actions;

export default addressSlice.reducer;
