import { userInfoReducer } from "./reducer/userInfoReducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
const RootReducer = combineReducers({
  userInfo: userInfoReducer,
});

export const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const state = store.getState();
export type STORE_STATE = typeof state;
