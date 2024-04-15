import { apiConnector } from "../apiConnector";
import { categoryEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

const { CREATE_CATEGORY_API, GET_ALL_CATEGORIES_API } = categoryEndpoints;

export const showAllCategories = async () => {
  // const toastId = toast.loading("Loading");
  let result = [];

  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORIES_API);
    // console.log("Course category detail..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch Course Category");
    }
    // toast.success("Course Category details fetched");
    result = response?.data?.data;
  } catch (error) {
    console.log("course category api error...", error);
    toast.error(error.response.message);
  }
  // toast.dismiss(toastId);
  return result;
  
};


