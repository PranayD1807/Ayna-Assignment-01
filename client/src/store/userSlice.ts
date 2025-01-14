import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  username: string | null;
  email: string | null;
  userId: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: null,
  email: null,
  userId: null,
};

const persistedUser = localStorage.getItem("user");
const userFromStorage = persistedUser ? JSON.parse(persistedUser) : null;

const initialStateFromStorage = userFromStorage
  ? {
      isLoggedIn: true,
      username: userFromStorage.username,
      email: userFromStorage.email,
      userId: userFromStorage.userId,
    }
  : initialState;

interface LoginPayload {
  username: string;
  email: string;
  userId: string;
}

const userSlice = createSlice({
  name: "user",
  initialState: initialStateFromStorage,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userId = action.payload.userId;

      // Save to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: action.payload.username,
          email: action.payload.email,
          userId: action.payload.userId,
        })
      );
    },
    logout: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
