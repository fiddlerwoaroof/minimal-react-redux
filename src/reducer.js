import * as R from "ramda";
import { typeEquals, action, applyAction } from "./redux-utils";
import { errorReducer } from "./saga-utils";

const UPDATE_NAME = "UPDATE_NAME";
const UPDATE_IP = "UPDATE_IP";

export const updateName = action(UPDATE_NAME);
export const updateIp = action(UPDATE_IP);

const initialState = {
  name: "",
  ip: "",
  error: null
};

export const rootReducer = (state = initialState, action) => (
  console.log(action),
  R.cond([
    [typeEquals(UPDATE_NAME), applyAction("name", state)],
    [typeEquals(UPDATE_IP), applyAction("ip", state)],
    [R.T, action => ({ ...state, error: errorReducer(state.error, action) })]
  ])(action)
);
