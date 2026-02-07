import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  addFavorite,
  removeFavorite,
  initFavorites,
} from "./favorites.slice";
import type { RootState } from "../store";

const FAVORITES_STORAGE_KEY = "user-favorite-movies";

const loadFavoritesFromStorage = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
        return Object.fromEntries(parsed.map((id) => [id, true]));
      }
    }
  } catch (error) {
    console.error("Failed to load favorites from localStorage. Clearing corrupted data.");
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }
  return {};
};

const saveFavoritesToStorage = (movieIds: Record<string, boolean>): void => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Object.keys(movieIds)));
};

function* persistFavorites() {
  const movieIds: Record<string, boolean> = yield select(
    (state: RootState) => state.favorites.movieIds
  );
  yield call(saveFavoritesToStorage, movieIds);
}

function* handleInitFavorites() {
  const movieIds: Record<string, boolean> = yield call(loadFavoritesFromStorage);
  yield put(initFavorites(movieIds));
}

export default function* favoritesSaga() {
  yield call(handleInitFavorites);
  yield takeLatest(addFavorite.type, persistFavorites);
  yield takeLatest(removeFavorite.type, persistFavorites);
}
