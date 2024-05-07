import { apiConnector } from "../apiConnector";
import { authEndpoints, profileEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

import { setToken, setLoading } from "../../toolkit/slice/authSlice";
import { setUser } from "../../toolkit/slice/profileSlice";
import { resetCart } from "../../toolkit/slice/cartSlice";
import { logout } from "./authAPI";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = profileEndpoints;

// export function getUserDetails(token, navigate) {}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");

  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("response inside profileApi", response);
    console.log("response data", response.data.userDetails.courses);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.userDetails.courses;
    console.log("Enrolled courses data result data..", result);
    // toast.success("Enrolled Courses Data Fetched");
    // navigate("/verifyEmail");
    // toast.dismiss(toastId);
  } catch (error) {
    console.log(
      "Error in fetching Enrolled Courses error..",
      error.response.data
    );
    toast.error(error.response.data);
  }
  toast.dismiss(toastId);
  return result;
}

export async function updateProfile(data, token) {
  console.log("data in api ", data);
  const toastId = toast.loading("Loading...");

  let result = [];

  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE_API, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("response inside update profileApi", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.updatedUser;

    // localStorage.setItem("user", JSON.stringify(result));
    toast.success(response?.data?.message);

    // console.log("Enrolled courses data result data..", result);
  } catch (error) {
    console.log("Error in updating profile api ...", error);
    toast.error(error.response.data);
  }
  toast.dismiss(toastId);
  return result;
}

export const deleteAccount = async (data, token) => {
  // console.log("entering updateSubSec api call:", data);
  const toastId = toast.loading("Loading");
  let result = null;

  console.log("delete profile data : ", data);
  try {
    const response = await apiConnector("DELETE", DELETE_PROFILE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("delete account api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete this account");
    }
    result = true;
    toast.success("Account deleted Successfully");
  } catch (error) {
    console.log("delete Account api error...", error);
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};
