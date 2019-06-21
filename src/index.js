import * as R from "ramda";
import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import { withDispatch } from "./redux-utils";
import { restart, recordError } from "./saga-utils";
import { take, spawn, delay } from "redux-saga/effects";

import { Root } from "./toplevel-react";
import { rootReducer, updateName } from "./reducer";
import { rootSaga, getIp, fail } from "./root-saga";

import { put } from "redux-saga/effects";

// Store Setup ==============================================================================

// Make redux devtools work, if present
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Make the redux store, with saga middleware enabled
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

const ConnectedRoot = connect(
  // Map the store's state to the toplevel component's props
  R.pickAll(["name", "ip", "error"]),
  // Map redux's dispatch function to props that will call it with a specific action
  withDispatch({ getIp, updateName, fail, restart })
)(Root);

function* toplevel() {
  // Run the root saga
  let rootTask = yield spawn(rootSaga);

  // Connect Redux to Toplevel Component ======================================================
  // Render Connected Component to the dom at #root ===========================================
  yield take("co/fwoar/APP_INIT");

  const reactRender = new Promise(resolve => {
    ReactDOM.render(
      // The Toplevel component is wrapped in a provider, to make the store available to connect
      <Provider store={store}>
        <ConnectedRoot />
      </Provider>,
      document.getElementById("root"),
      resolve
    );
  });

  yield reactRender;

  let quit = false;
  while (!quit) {
    try {
      yield rootTask.toPromise();
    } catch (err) {
      console.log("Error!", err);
      yield put(recordError(err.toString()));

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
}

sagaMiddleware.run(toplevel);
