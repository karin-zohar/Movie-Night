import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  addFavorite,
  removeFavorite,
  initFavorites,
} from "./favorites.slice";
import type { RootState } from "../store";

const FAVORITES_STORAGE_KEY = "user-favorite-movies";

const loadFavoritesFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
        return parsed;
      }
    }
  } catch (error) {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    throw new Error("Failed to load favorites from localStorage. Clearing corrupted data.");
  }
  return [];
};

const saveFavoritesToStorage = (movieIds: string[]): void => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(movieIds));
};

function* persistFavorites() {
  const movieIds: string[] = yield select(
    (state: RootState) => state.favorites.movieIds
  );
  yield call(saveFavoritesToStorage, movieIds);
}

function* handleInitFavorites() {
  const movieIds: string[] = yield call(loadFavoritesFromStorage);
  yield put(initFavorites(movieIds));
}

export default function* favoritesSaga() {
  yield call(handleInitFavorites);
  yield takeLatest(addFavorite.type, persistFavorites);
  yield takeLatest(removeFavorite.type, persistFavorites);
}
