import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

import { setToken, setLoading } from "../../toolkit/slice/authSlice";
import { setUser } from "../../toolkit/slice/profileSlice";
import { resetCart } from "../../toolkit/slice/cartSlice";

const {
  SEND_AUTH_OTP_API,
  SIGN_UP_API,
  LOGIN_API,
  RESET_PASSWORD_TOKEN_API,
  RESET_PASSWORD_API,
} = authEndpoints;

export function sendOTP(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SEND_AUTH_OTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("send otp api res :", response);
      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.success);
      }
      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("send auth otp error..", error);
      toast.error("Could not send otp");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGN_UP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });
      console.log("Sign up api response...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("SignUp Successful");
      navigate("/login");
    } catch (error) {
      console.log("SignUp api error...", error);
      toast.error("SignUp failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log("Entering login api func");
    try {
      console.log("Entering try block login api");
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
      console.log("Exiting response");
      console.log("Login api response....", response);

      if (!response.data.success) {
        throw new Error("error res: ", response.data.message);
      }
      toast.success("Login Successful");
      navigate("/commonDashBoard");

      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/7.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
    } catch (error) {
      console.log("Login api error ...", error);
      toast.error("Login Failed", error);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    console.log("Log out calling");
    navigate("/home");
    console.log("nav calling");
  };
}
