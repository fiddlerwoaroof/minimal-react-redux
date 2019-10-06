import {} from "@redux-saga/is";
import { channel, buffers } from "redux-saga";
import { takeEvery, fork, takeLatest, take, put } from "redux-saga/effects";
import { updateIp } from "./reducer";

function* channelWorker(thing) {
  console.log("the thing is:", thing);
  yield;
}

function* channelListener(channel) {
  console.log("hi from the listener");
  yield takeEvery(channel, channelWorker);
}

export function* rootSaga() {
  const myChannel = channel(buffers.sliding(10));

  console.log("hi");
  yield fork(channelListener, myChannel);

  myChannel.put("hi");

  yield put({ type: "co/fwoar/APP_INIT" });
  myChannel.put({ a: 3 });
  yield takeLatest("GET_IP", ipWorker);
  while (true) {
    yield take("FAIL");
    throw new Error("FAILURE!");
  }

  yield appReady;
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
