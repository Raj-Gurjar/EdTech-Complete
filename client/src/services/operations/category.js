import { apiConnector } from "../apiConnector";
import { categoryEndpoints } from "../api";
import toast from "react-hot-toast";

// import {setLoading}

const {
  CREATE_CATEGORY_API,
  GET_ALL_CATEGORIES_API,
  CATEGORY_PAGE_DATA_API,
  DELETE_CATEGORY_API,
} = categoryEndpoints;

export const createCategory = async (data, token) => {
  // console.log("entering createCategory", data);
  const toastId = toast.loading("Loading");
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });
    // console.log("create category api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not create category");
    }
    toast.success("Category Created Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("create category api error...", error);
    toast.error(error.response.data.message);
  }
  // console.log("Result: ", result);
  toast.dismiss(toastId);
  result = true;
  return result;
};

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

export const getCategoryPageDetails = async (categoryId) => {
  console.log("inside getCatPageDetails");
  const toastId = toast.loading("Loading");
  let result = [];

  try {
    const response = await apiConnector("POST", CATEGORY_PAGE_DATA_API, {
      categoryId: categoryId,
    });
    console.log("Course category detail page..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Category Page Data");
    }
    // toast.success("Course Category details fetched");
    result = response?.data;
  } catch (error) {
    console.log("category details page api error...", error);
    toast.error(error.response.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCategory = async (categoryId, token) => {
  const toastId = toast.loading("Loading");
  let result = null;

  // console.log("Delete category data: ", categoryId);

  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_CATEGORY_API,
      categoryId,
      {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      }
    );

    // console.log("Delete category api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete category");
    }
    toast.success("Category deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("delete category api error...", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};
