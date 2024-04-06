import { apiConnector } from "../apiConnector";
import { categoryEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

const { CREATE_CATEGORY_API, GET_ALL_CATEGORIES_API } = categoryEndpoints;

export function showAllCategories() {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    // dispatch(setLoading(true));
    let result = [];

    try {
      const response = await apiConnector("GET", GET_ALL_CATEGORIES_API);

      //   console.log(response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.success);
      }
      console.log("Get all categories :", response);
      toast.success("All Categories are shown");
      result = response?.data?.data;
    } catch (error) {
      console.log("Error in fetching categories", error.response.data);
      toast.error("Could not Fetch Categories");
    }
    // dispatch(setLoading(false));
    toast.dismiss(toastId);
    console.log("result: ", result);
    return result;
  };
}


