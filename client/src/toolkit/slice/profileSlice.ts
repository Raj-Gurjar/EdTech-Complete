import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getUser = localStorage.getItem("user");

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  image?: string;
  [key: string]: any;
}

interface ProfileState {
  user: User | null;
  loading: boolean;
}

const profileInitialState: ProfileState = {
  user: getUser ? JSON.parse(getUser) : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;


