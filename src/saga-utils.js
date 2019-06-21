import * as R from "ramda";
import { take, spawn, delay } from "redux-saga/effects";
import { action } from "./redux-utils";

export const restart = () => ({
  type: "co/fwoar/APP_RESTART"
});
const RECORD_ERROR = "RECORD_ERROR";
export const recordError = action(RECORD_ERROR);

export const errorReducer = (state = null, { type, data }) => {
  if (type === "co/fwoar/APP_RESTART") {
    return null;
  } else if (type === "co/fwoar/RECORD_ERROR") {
    return data;
  } else {
    return state;
  }
};

export const makeToplevel = (rootSaga, main, onError) =>
  function* toplevel() {
    // Run the root saga
    let rootTask = yield spawn(rootSaga);

    // Connect Redux to Toplevel Component ======================================================
    // Render Connected Component to the dom at #root ===========================================
    yield take("co/fwoar/APP_INIT");

    yield main();

    let quit = false;
    while (!quit) {
      try {
        yield rootTask.toPromise();
      } catch (err) {
        console.log("Error!");
        if (onError) {
          yield* onError(err);
        }
        const { type } = yield take([
          "co/fwoar/APP_RESTART",
          "co/fwoar/APP_QUIT"
        ]);
        if (type === "co/fwoar/APP_QUIT") {
          console.log("Quitting!");
          quit = true;
        } else if (type === "co/fwoar/APP_RESTART") {
          console.log("restarting");
          rootTask = yield spawn(rootSaga);
        }
      }
      yield delay(10);
    }
  };
