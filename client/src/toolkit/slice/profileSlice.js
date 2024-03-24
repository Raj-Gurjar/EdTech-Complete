import { createSlice } from "@reduxjs/toolkit";


const profileInitialState = {
  user:1,

};

const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
