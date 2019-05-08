import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import { Root } from "./react";
import { rootReducer, updateName } from "./redux";
import { rootSaga, getIp } from "./saga";

// Store Setup ==============================================================================

// Make redux devtools work, if present
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Make the redux store, with saga middleware enabled
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Run the root saga
sagaMiddleware.run(rootSaga);

// Connect Redux to Toplevel Component ======================================================
const ConnectedRoot = connect(
  // Map the store's state to the toplevel component's props
  ({ name, ip }) => ({ name, ip }),
  // Map redux's dispatch function to props that will call it with a specific action
  dispatch => ({
    getIp() {
      dispatch(getIp());
    },
    updateName(v) {
      dispatch(updateName(v));
    }
  })
)(Root);

// Render Connected Component to the dom at #root ===========================================
ReactDOM.render(
  // The Toplevel component is wrapped in a provider, to make the store available to connect
  <Provider store={store}>
    <ConnectedRoot />
  </Provider>,
  document.getElementById("root")
);
