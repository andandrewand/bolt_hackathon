import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LoginState } from "../modals";

const initialState: LoginState = { sessionId: null, UserId: null };

const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    saveSession(state, { payload }: PayloadAction<LoginState>) {
      state.UserId = payload.UserId;
      state.sessionId = payload.sessionId;
    },
    removeSession(state) {
      state.UserId = null;
      state.sessionId = null;
    },
  },
});

export const { removeSession, saveSession } =
  loginSlice.actions;
export default loginSlice.reducer;
