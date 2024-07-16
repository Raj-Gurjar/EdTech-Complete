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
      navigate("/verifyEmail");
    } catch (error) {
      console.log("send auth otp error..", error.response.data);
      toast.error(error.response.data.message);
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

    console.log("inside signup");

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
      console.log("SignUp api error...", error.response);
      toast.error(`SignUp failed! ${error.response?.data?.message} `);
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
      console.log("Login data..", response?.data?.token);
      toast.success("Login Successful");
      navigate("/dashboard/myDashboard");

      dispatch(setToken(response?.data?.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/7.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      console.log("set user..", response.data.user);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.log("Login api error ...", error);
      toast.error("Login Failed", error?.response?.data);
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
    navigate("/");
    console.log("nav calling");
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, {
        email,
      });

      console.log("Reset Password token response...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("Reset password token error");
      toast.error("Failed to send Email for resetting password");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    // console.log("pp:", password, ", cf:", confPassword);

    try {
      const response = await apiConnector("POST", RESET_PASSWORD_API, {
        password,
        confPassword,
        token,
      });

      console.log("Reset Password response...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password Reset Successful");
      navigate("/login");
    } catch (error) {
      console.log("Reset password error", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
  };
}
