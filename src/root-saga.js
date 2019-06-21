import { takeLatest, take, put } from "redux-saga/effects";
import { updateIp } from "./reducer";

export function* rootSaga() {
  yield put({ type: "co/fwoar/APP_INIT" });
  yield takeLatest("GET_IP", ipWorker);
  while (true) {
    yield take("FAIL");
    throw new Error("FAILURE!");
  }
}

export function getIp() {
  return { type: "GET_IP" };
}

export function fail() {
  return { type: "FAIL" };
}

function* ipWorker() {
  const ipR = yield fetch("https://api.ipify.org");
  const ip = yield ipR.text();
  yield put(updateIp(ip));
}
