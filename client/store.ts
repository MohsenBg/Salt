import { userInfoReducer } from "./reducer/userInfoReducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { conversationReducer } from "./reducer/conversationReducer";
import { socketReducer } from "./reducer/socketReducer";

const RootReducer = combineReducers({
  userInfo: userInfoReducer,
  conversation: conversationReducer,
  webSocket: socketReducer,
});

const rootReducer = (state: any, action: any) => {
  // Clear all data in redux store to initial.
  if (action.type === "RESET_APP") state = undefined;

  return RootReducer(state, action);
};

export const store = createStore(
  rootReducer,

  composeWithDevTools(applyMiddleware(thunk))
);

const state = store.getState();
export type STORE_STATE = typeof state;
