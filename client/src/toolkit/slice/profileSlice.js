import { createSlice } from "@reduxjs/toolkit";

const getUser = localStorage.getItem("user");

const profileInitialState = {
  user: getUser ? JSON.parse(getUser) : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
