import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
  },
  reducers: {
    setAddresses: (state, action) => {
      state.list = action.payload;
    },
    addAddress: (state, action) => {
      // Serialize the address before adding to state
      const serializedAddress = {
        ...action.payload,
        createdAt:
          action.payload.createdAt?.toString() || new Date().toISOString(),
      };
      state.list.push(serializedAddress);
    },
  },
});

export const { setAddresses, addAddress } = addressSlice.actions;

export default addressSlice.reducer;
