import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

import { setToken, setLoading } from "../../toolkit/slice/authSlice";
import { setUser } from "../../toolkit/slice/profileSlice";
import { resetCart } from "../../toolkit/slice/cartSlice";
import { saveToken, removeToken } from "../../utils/tokenUtils";

const {
  SEND_AUTH_OTP_API,
  SIGN_UP_API,
  LOGIN_API,
  RESET_PASSWORD_TOKEN_API,
  RESET_PASSWORD_API,
  GOOGLE_AUTH_API,
} = authEndpoints;

interface ApiError {
  response?: {
    data?: {
      message?: string;
      success?: any;
    };
  };
}

export function sendOTP(email: string, navigate: NavigateFunction) {
  return async (dispatch: Dispatch<AnyAction>) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SEND_AUTH_OTP_API, {
        email,
        checkUserPresent: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.success);
      }
      toast.success("OTP Sent Successfully", { duration: 3000 });
      navigate("/verifyEmail");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "Failed to send OTP", { duration: 4000 });
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  otp: string,
  adminKey: string,
  navigate: NavigateFunction
) {
  return async (dispatch: Dispatch<AnyAction>) => {
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
        adminKey,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("SignUp Successful", { duration: 3000 });
      navigate("/login");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(`SignUp failed! ${apiError.response?.data?.message || "Unknown error"}`, { duration: 4000 });
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email: string, password: string, navigate: NavigateFunction) {
  return async (dispatch: Dispatch<AnyAction>) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error("error res: " + response.data.message);
      }
      toast.success("Login Successful", { duration: 3000 });
      navigate("/dashboard/myDashboard");

      const newToken = response?.data?.token;
      
      // Save token using utility function
      if (newToken) {
        saveToken(newToken);
        dispatch(setToken(newToken));
      }

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/7.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "Login Failed", { duration: 4000 });
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate: NavigateFunction) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    removeToken();
    localStorage.removeItem("user");
    navigate("/");
  };
}

export function getPasswordResetToken(email: string, setEmailSent: (value: boolean) => void) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, {
        email,
      });


      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent", { duration: 3000 });
      setEmailSent(true);
    } catch (error) {
      toast.error("Failed to send Email for resetting password", { duration: 4000 });
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password: string, confPassword: string, token: string, navigate: NavigateFunction) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESET_PASSWORD_API, {
        password,
        confPassword,
        token,
      });


      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password Reset Successful", { duration: 3000 });
      navigate("/login");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "Failed to reset password", { duration: 4000 });
    }
    dispatch(setLoading(false));
  };
}

export function googleAuth(authData: string | object, navigate: NavigateFunction) {
  return async (dispatch: Dispatch<AnyAction>) => {
    const toastId = toast.loading("Authenticating with Google...");
    dispatch(setLoading(true));

    try {
      // Parse if it's a string, otherwise use as is
      const payload = typeof authData === "string" ? JSON.parse(authData) : authData;

      const response = await apiConnector("POST", GOOGLE_AUTH_API, payload);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Google Authentication Successful", { duration: 3000 });
      navigate("/dashboard/myDashboard");

      const newToken = response?.data?.token;
      
      // Save token using utility function
      if (newToken) {
        saveToken(newToken);
        dispatch(setToken(newToken));
      }

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/7.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "Google Authentication Failed", { duration: 4000 });
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

