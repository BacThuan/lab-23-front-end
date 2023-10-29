import { createStore } from "redux";

const counterReducer = (
  state = {
    isAuth: false,
    token: null,
    userId: null,
    error: null,
  },
  action
) => {
  if (action.type === "ISAUTH") {
    const newState = { ...state };
    newState.isAuth = true;
    newState.token = action.token;
    newState.userId = action.userId;

    return newState;
  }
  if (action.type === "LOGIN") {
    const newState = { ...state };
    newState.isAuth = true;
    newState.token = action.token;
    newState.userId = action.userId;

    // save local
    localStorage.setItem("token", action.token);
    localStorage.setItem("userId", action.userId);

    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    localStorage.setItem("expiryDate", expiryDate.toISOString());

    return newState;
  }

  if (action.type === "LOGOUT") {
    const newState = { ...state };
    newState.isAuth = false;

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
    return newState;
  }

  if (action.type === "ERROR") {
    const newState = { ...state };
    newState.error = action.error;
    return newState;
  }

  return state;
};

const store = createStore(counterReducer);

export default store;
