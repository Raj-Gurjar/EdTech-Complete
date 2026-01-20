import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../api";
import toast from "react-hot-toast";


const {
  GET_USER_ENROLLED_COURSES_API,
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  DELETE_PROFILE_API,
  GET_INSTRUCTOR_DASHBOARD_DATA_API,
  GET_ADMIN_DASHBOARD_DATA_API,
  GET_PUBLIC_STATISTICS_API,
} = profileEndpoints;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    message?: string;
  };
  message?: string;
}

export async function getUserEnrolledCourses(token: string): Promise<any[]> {
  const toastId = toast.loading("Loading...");

  let result: any[] = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.userDetails.courses;
  } catch (error) { 
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Failed to fetch enrolled courses");
  }
  toast.dismiss(toastId);
  return result;
}

export async function updateProfile(data: any, token: string): Promise<any> {
  const toastId = toast.loading("Loading...");

  let result: any = null;

  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE_API, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.updatedUser;

    toast.success(response?.data?.message);
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Failed to update profile");
  }
  toast.dismiss(toastId);
  return result;
}

export async function updateProfileImage(formData: FormData, token: string): Promise<any> {
  const toastId = toast.loading("Loading...");

  let result: any = null;

  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_DISPLAY_PICTURE_API,
      formData,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message);
    }
    result = response?.data?.updatedUser;

    localStorage.setItem("user", JSON.stringify(result));
    toast.success(response?.data?.message);
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Failed to update profile image");
  }
  toast.dismiss(toastId);
  return result;
}

export const deleteAccount = async (data: any, token: string): Promise<boolean | null> => {
  const toastId = toast.loading("Loading");
  let result: boolean | null = null;

  try {
    const response = await apiConnector("DELETE", DELETE_PROFILE_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not delete this account");
    }
    result = true;
    toast.success("Account deleted Successfully");
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.response?.message || apiError.message || "Failed to delete account");
  }
  toast.dismiss(toastId);
  return result;
};

export const getInstructorData = async (token: string): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DASHBOARD_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not get the inst data");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.response?.message || apiError.message || "Failed to fetch instructor data");
  }
  toast.dismiss(toastId);
  return result;
};

export const getAdminData = async (token: string): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ADMIN_DASHBOARD_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not get the admin data");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.response?.message || apiError.message || "Failed to fetch admin data");
  }
  toast.dismiss(toastId);
  return result;
};

export const getPublicStatistics = async (): Promise<any | null> => {
  let result: any | null = null;

  try {
    const response = await apiConnector("GET", GET_PUBLIC_STATISTICS_API);

    if (!response?.data?.success) {
      throw new Error("Could not get public statistics");
    }
    result = response?.data?.data;
  } catch (error) { 
    const apiError = error as ApiError;
    console.error(apiError.response?.data?.message || apiError.response?.message || apiError.message || "Failed to fetch public statistics");
  }
  return result;
};

