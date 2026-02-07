import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  movieIds: Record<string, boolean>;
}

const initialState: FavoritesState = {
  movieIds: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<string>) {
      state.movieIds[action.payload] = true;
    },
    removeFavorite(state, action: PayloadAction<string>) {
      delete state.movieIds[action.payload];
    },
    initFavorites(state, action: PayloadAction<Record<string, boolean>>) {
      state.movieIds = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, initFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
