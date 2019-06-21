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

// Get enhancer for redux devtools, if present
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Setup redux sagas
const sagaMiddleware = createSagaMiddleware();

// Setup redux
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Map redux state to our root component using the `connect`
// higher-order component.
const ConnectedRoot = connect(
  // Map the store's state to the toplevel component's props
  R.pickAll(["name", "ip", "error"]),
  // Map redux's dispatch function to props that will call it with a
  // specific action
  withDispatch({ getIp, updateName, fail, restart })
)(Root);

// This is the "main" function of our application
//
// It's primarily responsible for running the application's root saga,
// rendering the application's react component and handling errors
// that occur while the application's root saga is running.
function* toplevel() {
  // Start our root saga
  let rootTask = yield spawn(rootSaga);

  // Wait for the root saga to generate the APP_INIT event
  yield take("co/fwoar/APP_INIT");

  // Render react to the dom element #root
  const reactRender = new Promise(resolve => {
    ReactDOM.render(
      // The Toplevel component is wrapped in a provider, to make the
      // store available to connect
      <Provider store={store}>
        <ConnectedRoot />
      </Provider>,
      document.getElementById("root"),
      resolve
    );
  });

  // wait for react to finish rendering
  yield reactRender;

  // wait for the root task to finish, handling errors and restarting
  // it if it ever exits
  let quit = false;
  while (!quit) {
    try {
      yield rootTask.toPromise();
    } catch (err) {
      console.log("Error!", err);
      // Give the reducers a chance to store the error somewhere
      yield put(recordError(err.toString()));

      // Handle actions that can be fired in response to an error:
      // - APP_QUIT just causes this saga to end
      // - APP_RESTART tries to restart the root saga
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
