import { call, put, takeLatest } from "redux-saga/effects";
import { setTheme, initTheme, type Theme } from "./theme.slice";

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

const applyThemeToDocument = (theme: Theme): void => {
  document.documentElement.setAttribute("data-theme", theme);
};

function* handleSetTheme(action: ReturnType<typeof setTheme>) {
  const theme = action.payload;
  yield call(saveThemeToStorage, theme);
  yield call(applyThemeToDocument, theme);
}

function* handleInitTheme() {
  const theme: Theme = yield call(loadThemeFromStorage);
  yield put(initTheme(theme));
  yield call(applyThemeToDocument, theme);
}

export default function* themeSaga() {
  yield call(handleInitTheme);
  yield takeLatest(setTheme.type, handleSetTheme);
}
