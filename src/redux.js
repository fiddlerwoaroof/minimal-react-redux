const initialState = {
  name: "",
  ip: ""
};

export const updateName = newName => {
  return { type: "UPDATE_NAME", data: newName };
};

export const updateIp = newIp => {
  return { type: "UPDATE_IP", data: newIp };
};

export const rootReducer = (state = initialState, action) => {
  if (action.type === "UPDATE_NAME") {
    return { ...state, name: action.data };
  } else if (action.type === "UPDATE_IP") {
    return { ...state, ip: action.data };
  } else {
    return state;
  }
};
