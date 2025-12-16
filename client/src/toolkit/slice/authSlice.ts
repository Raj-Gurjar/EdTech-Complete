import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getToken = localStorage.getItem("token");

interface AuthState {
  signupData: any | null;
  loading: boolean;
  token: string | null;
}

const authInitialState: AuthState = {
  signupData: null,
  loading: false,
  token: getToken ? JSON.parse(getToken) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setSignupData(state, action: PayloadAction<any>) {
      state.signupData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } =
  authSlice.actions;
export default authSlice.reducer;


