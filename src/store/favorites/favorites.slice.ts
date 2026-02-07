import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  movieIds: string[];
}

const initialState: FavoritesState = {
  movieIds: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.movieIds.includes(action.payload)) {
        state.movieIds.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.movieIds = state.movieIds.filter((id) => id !== action.payload);
    },
    initFavorites(state, action: PayloadAction<string[]>) {
      state.movieIds = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, initFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
