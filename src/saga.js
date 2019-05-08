import { takeLatest, put } from "redux-saga/effects";
import { updateIp } from "./redux";

export function* rootSaga() {
  yield takeLatest("GET_IP", ipWorker);
}

export function getIp() {
  return { type: "GET_IP" };
}

function* ipWorker() {
  const ipR = yield fetch("https://api.ipify.org");
  const ip = yield ipR.text();
  yield put(updateIp(ip));
}