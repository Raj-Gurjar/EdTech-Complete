import { apiConnector } from "../apiConnector";
import { categoryEndpoints } from "../api";
import toast from "react-hot-toast";

const {
  CREATE_CATEGORY_API,
  GET_ALL_CATEGORIES_API,
  CATEGORY_PAGE_DATA_API,
  DELETE_CATEGORY_API,
} = categoryEndpoints;

interface CategoryData {
  name: string;
  description?: string;
  [key: string]: any;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    message?: string;
  };
}

export const createCategory = async (
  data: CategoryData,
  token: string
): Promise<boolean | null> => {
  const toastId = toast.loading("Loading");
  let result: boolean | null = null;

  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not create category");
    }
    toast.success("Category Created Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("create category api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create category");
  }
  toast.dismiss(toastId);
  result = true;
  return result;
};

export const showAllCategories = async (): Promise<any[]> => {
  let result: any[] = [];

  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORIES_API);

    if (!response?.data?.success) {
      throw new Error("Could not fetch Course Category");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("course category api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch categories");
  }
  return result;
};

export const getCategoryPageDetails = async (
  categoryId: string
): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = [];

  try {
    const response = await apiConnector("POST", CATEGORY_PAGE_DATA_API, {
      categoryId: categoryId,
    });
    console.log("Course category detail page..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Category Page Data");
    }
    result = response?.data;
  } catch (error) {
    console.log("category details page api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch category details");
    result = apiError.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCategory = async (
  categoryId: string,
  token: string
): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_CATEGORY_API,
      { categoryId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not delete category");
    }
    toast.success("Category deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to delete category");
  }
  toast.dismiss(toastId);
  return result;
};

