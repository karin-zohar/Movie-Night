import { all, fork } from "redux-saga/effects";
import { themeSaga } from "./theme";
import { favoritesSaga } from "./favorites";

export default function* rootSaga() {
  yield all([fork(themeSaga), fork(favoritesSaga)]);
}
