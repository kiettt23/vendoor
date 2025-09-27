import { createSlice } from "@reduxjs/toolkit";

const dummySlice = createSlice({
  name: "dummy",
  initialState: { value: "init ok" },
  reducers: {},
});

export default dummySlice.reducer;
