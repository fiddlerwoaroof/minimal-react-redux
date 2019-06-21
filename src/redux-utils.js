import * as R from "ramda";

export const withDispatch = o => dispatch => R.map(f => v => dispatch(f(v)), o);
export const typeEquals = R.propEq("type");

export const updateStateFromAction = R.curry(
  (actionKey, stateKey, state, action) =>
    R.assoc(stateKey, R.prop(actionKey, action), state)
);

export const action = type => data => ({ type, data });
export const applyAction = updateStateFromAction("data");
