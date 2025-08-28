import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "./types";

const initialState: NotificationState = {
  notificationMessage: null,
};

const notiSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    settingNotiMessage(state, action: PayloadAction<string | null>) {
      state.notificationMessage = action.payload;
    },
  },
});

export const notiActions = notiSlice.actions;

export default notiSlice.reducer; 