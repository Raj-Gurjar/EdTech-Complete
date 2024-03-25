import { createSlice } from "@reduxjs/toolkit";

const getToken = localStorage.getItem("token");

const authInitialState = {
  token: getToken ? JSON.parse(getToken) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
