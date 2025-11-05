import { createSlice } from "@reduxjs/toolkit";

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],
  },
  reducers: {
    setRatings: (state, action) => {
      state.ratings = action.payload;
    },
    addRating: (state, action) => {
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
