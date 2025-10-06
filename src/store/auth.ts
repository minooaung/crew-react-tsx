import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { AuthState } from "./types";

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

// For debugging use:
// const initialState: AuthState = {
//   user: (() => {
//     console.log("READING FROM LOCALSTORAGE - Store initialization!");
//     return JSON.parse(localStorage.getItem("user") || "null");
//   })(),
// };

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    settingUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
