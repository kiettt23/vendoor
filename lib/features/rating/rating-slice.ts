import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SerializedRating } from "@/types";

interface RatingState {
  ratings: SerializedRating[];
}

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],
  } as RatingState,
  reducers: {
    setRatings: (state, action: PayloadAction<SerializedRating[]>) => {
      state.ratings = action.payload;
    },
    addRating: (state, action: PayloadAction<SerializedRating>) => {
      // Serialize the rating before adding to state
      const serializedRating = {
        ...action.payload,
        createdAt:
          action.payload.createdAt?.toString() || new Date().toISOString(),
        user: action.payload.user
          ? {
              ...action.payload.user,
            }
          : null,
      };
      state.ratings.push(serializedRating);
    },
  },
});

export const { setRatings, addRating } = ratingSlice.actions;

export default ratingSlice.reducer;
