import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SerializedAddress } from "@/types";

interface AddressState {
  list: SerializedAddress[];
}

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
  } as AddressState,
  reducers: {
    setAddresses: (state, action: PayloadAction<SerializedAddress[]>) => {
      state.list = action.payload;
    },
    addAddress: (state, action: PayloadAction<SerializedAddress>) => {
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
