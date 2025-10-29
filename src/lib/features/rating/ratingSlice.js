import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk
export const fetchUserRatings = createAsyncThunk(
  "rating/fetchUserRatings",
  async ({ getToken }) => {
    const token = await getToken();
    const response = await axios.get("/api/rating", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const initialState = {
  ratings: [],
  averageRating: 0,
  totalRatings: 0,
  loading: false,
  error: null,
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRatings: (state, action) => {
      state.ratings = action.payload;
      state.loading = false;

      // Calculate average
      if (action.payload.length > 0) {
        const total = action.payload.reduce(
          (sum, rating) => sum + rating.value,
          0
        );
        state.averageRating = total / action.payload.length;
        state.totalRatings = action.payload.length;
      }
    },

    addRating: (state, action) => {
      state.ratings.push(action.payload);
      state.totalRatings += 1;

      // Recalculate average
      const total = state.ratings.reduce(
        (sum, rating) => sum + rating.value,
        0
      );
      state.averageRating = total / state.totalRatings;
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
      .addCase(fetchUserRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings || [];

        // Calculate average
        const ratingsArray = action.payload.ratings || [];
        if (ratingsArray.length > 0) {
          const total = ratingsArray.reduce(
            (sum, rating) => sum + rating.value,
            0
          );
          state.averageRating = total / ratingsArray.length;
          state.totalRatings = ratingsArray.length;
        }
      })
      .addCase(fetchUserRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setRatings, addRating, setLoading, setError } =
  ratingSlice.actions;

export default ratingSlice.reducer;
