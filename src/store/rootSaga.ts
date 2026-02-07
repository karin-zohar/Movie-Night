import { all, fork } from "redux-saga/effects";
import { themeSaga } from "./theme";

export default function* rootSaga() {
  yield all([fork(themeSaga)]);
}
