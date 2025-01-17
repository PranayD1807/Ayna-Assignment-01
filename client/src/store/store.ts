import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatSessionReducer from "./chatSessionSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chatSessions: chatSessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
