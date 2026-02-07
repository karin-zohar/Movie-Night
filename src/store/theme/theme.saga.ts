import { call, put, takeLatest } from "redux-saga/effects";
import { setTheme, type Theme } from "./theme.slice";

const THEME_STORAGE_KEY = "app-theme";

const loadThemeFromStorage = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return "light";
};

const saveThemeToStorage = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

function* handleSetTheme(action: ReturnType<typeof setTheme>) {
  yield call(saveThemeToStorage, action.payload);
}

function* handleInitTheme() {
  const theme: Theme = yield call(loadThemeFromStorage);
  yield put(setTheme(theme));
}

export default function* themeSaga() {
  yield takeLatest(setTheme.type, handleSetTheme);
  yield call(handleInitTheme);
}
