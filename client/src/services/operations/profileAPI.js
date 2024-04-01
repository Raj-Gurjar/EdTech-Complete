import { apiConnector } from "../apiConnector";
import { authEndpoints, profileEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

import { setToken, setLoading } from "../../toolkit/slice/authSlice";
import { setUser } from "../../toolkit/slice/profileSlice";
import { resetCart } from "../../toolkit/slice/cartSlice";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } =
  profileEndpoints;

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
