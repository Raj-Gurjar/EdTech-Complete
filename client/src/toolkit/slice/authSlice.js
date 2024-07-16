import { createSlice } from "@reduxjs/toolkit";

const getToken = localStorage.getItem("token");

const authInitialState = {
  signupData: null,
  loading: false,
  token: getToken ? JSON.parse(getToken) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } =
  authSlice.actions;
export default authSlice.reducer;
