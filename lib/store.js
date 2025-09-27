import { configureStore } from "@reduxjs/toolkit";
import dummyReducer from "./features/dummy/dummySlice";

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
