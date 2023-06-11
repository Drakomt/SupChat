import { signUpReducer } from "./signUpSlice";
import { userReducer } from "./userSlice";
import { SideBarDisplayReducer } from "./sideBarDisplaySlice";
import { messageReducer } from "./messageSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatDisplayreucer } from "./chatDisplaySlice";
import { displayReducer } from "./displaySlice";

const rootReducer = combineReducers({
  userSlice: userReducer,
  SideBarDisplaySlice: SideBarDisplayReducer,
  messageSlice: messageReducer,
  signUpSlice: signUpReducer,
  chatDisplaySlice: chatDisplayreucer,
  displaySlice:displayReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };
