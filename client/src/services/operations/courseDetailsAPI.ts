import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints, reviewEndpoints } from "../api";

const {
  GET_ALL_COURSES_PUBLIC_API,
  COURSE_DETAILS_API,
  EDIT_COURSE_API,
  CREATE_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  GET_COURSE_DETAILS,
  GET_SECTION_DETAILS,
  LECTURE_COMPLETION_API,
  CREATE_RATING_API,
  GET_ALL_COURSES_ADMIN_API,
  PUBLISH_COURSE_ADMIN_API,
  UNPUBLISH_COURSE_ADMIN_API,
  GET_COURSE_DETAILS_ADMIN_API,
} = courseEndpoints;

const { GET_ALL_REVIEWS_API } = reviewEndpoints;

interface ApiError {
  response?: {
    data?: {
      error: string;
      message?: string;
    };
    message?: string;
  };
  message?: string;
}

export const getAllCoursesPublic = async (search?: string, category?: string): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    // Build query parameters
    const params: Record<string, string> = {};
    if (search && search.trim()) {
      params.search = search.trim();
    }
    if (category && category.trim() && category !== 'all') {
      params.category = category.trim();
    }

    const response = await apiConnector("GET", GET_ALL_COURSES_PUBLIC_API, undefined, undefined, params);
    if (!response?.data?.success) {
      throw new Error("Could not fetch Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch courses");
  }
  toast.dismiss(toastId);
  return result;
};

export const getAllCoursesAdmin = async (token: string): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_COURSES_ADMIN_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch courses");
  }
  toast.dismiss(toastId);
  return result;
};

export const publishCourseAdmin = async (courseId: string, token: string): Promise<any> => {
  const toastId = toast.loading("Publishing Course...");
  let result: any = null;

  try {
    const response = await apiConnector(
      "POST",
      PUBLISH_COURSE_ADMIN_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not publish the Course");
    }
    toast.success("Course Published Successfully", { duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error in publishing the course",
      { duration: 4000 }
    );
  }

  toast.dismiss(toastId);
  return result;
};

export const unpublishCourseAdmin = async (courseId: string, token: string): Promise<any> => {
  const toastId = toast.loading("Unpublishing Course...");
  let result: any = null;

  try {
    const response = await apiConnector(
      "POST",
      UNPUBLISH_COURSE_ADMIN_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not unpublish the Course");
    }
    toast.success("Course Unpublished Successfully", { duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error in unpublishing the course",
      { duration: 4000 }
    );
  }

  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch course details");
    result = apiError.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const addCourseDetails = async (
  data: FormData, 
  token: string,
  onUploadProgress?: (progress: number) => void
): Promise<any> => {
  const toastId = toast.loading("Uploading thumbnail...", {
    duration: Infinity,
  });
  let result: any = null;

  try {
    const response = await apiConnector(
      "POST", 
      CREATE_COURSE_API, 
      data, 
      {
        // Don't set Content-Type for FormData - browser will set it with boundary
        Authorization: `Bearer ${token}`,
      },
      undefined,
      (progressEvent: any) => {
        if (progressEvent.total && progressEvent.loaded < progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onUploadProgress) {
            onUploadProgress(percentCompleted);
          }
          // Keep toast loading without showing percentage
          toast.loading("Uploading thumbnail...", { id: toastId, duration: Infinity });
        }
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add details in Course");
    }
    toast.success("Course Details added Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.newCourse;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 
                        apiError.response?.data?.error || 
                        apiError.message || 
                        "Failed to add course details";
    toast.error(errorMessage, { id: toastId, duration: 3000 });
    console.error("Course creation error:", errorMessage, apiError.response?.data);
  }
  return result;
};

export const editCourseDetails = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not edit details in Course");
    }
    toast.success("Course Details edited Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) { 
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to edit course details", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not create section");
    }
    toast.success("Section Created Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create section", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async (
  data: FormData, 
  token: string,
  onUploadProgress?: (progress: number) => void
): Promise<any> => {
  const toastId = toast.loading("Uploading video...", {
    duration: Infinity,
  });
  let result: any = null;

  try {
    const response = await apiConnector(
      "POST", 
      CREATE_SUBSECTION_API, 
      data, 
      {
        // Don't set Content-Type for FormData - browser will set it with boundary
        Authorization: `Bearer ${token}`,
      },
      undefined,
      (progressEvent: any) => {
        if (progressEvent.total && progressEvent.loaded < progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onUploadProgress) {
            onUploadProgress(percentCompleted);
          }
          // Keep toast loading without showing percentage
          toast.loading("Uploading video...", { id: toastId, duration: Infinity });
        }
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not create sub-section");
    }
    toast.success("Sub-Section Created Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create sub-section", { id: toastId, duration: 4000 });
  }
  return result;
};

export const updateSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not update section");
    }
    toast.success("Section Updated Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to update section", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    if (!response?.data?.success) {
      throw new Error("Could not update sub-section");
    }
    toast.success("Sub-Section Updated Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to update sub-section", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not delete section");
    }
    toast.success("Section deleted Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete section", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not delete subsection");
    }
    toast.success("subSection deleted Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete subsection", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (token: string): Promise<any[]> => {
  const toastId = toast.loading("Loading..");
  let result: any[] = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch instructor courses");
    result = Array.isArray(apiError.response?.data) ? apiError.response.data : [];
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not delete course");
    }
    toast.success("Course deleted Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete course", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const getFullDetailsOfCourse = async (courseId: string, token: string): Promise<any> => {
  const toastId = toast.loading("Loading..");
  let result: any = [];

  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch Full Course Details");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch full course details");
    result = Array.isArray(apiError.response?.data) ? apiError.response.data : (apiError.response?.data || []);
  }
  toast.dismiss(toastId);
  return result;
};

export const markLectureAsComplete = async (data: any, token: string): Promise<boolean> => {
  let result: boolean = false;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed", { id: toastId, duration: 3000 });
    result = true;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Failed to mark lecture as complete", { id: toastId, duration: 4000 });
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

export const getCourseDetails = async (courseId: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = {};

  try {
    const response = await apiConnector("POST", GET_COURSE_DETAILS, {
      courseId,
    });

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Course  Data");
    }
    result = response?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to fetch course details");
    result = apiError.response?.data || {};
  }
  toast.dismiss(toastId);
  return result;
};

export const getSectionDetails = async (sectionId: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = {};

  try {
    const response = await apiConnector("POST", GET_SECTION_DETAILS, {
      id: sectionId,
    });

    if (!response?.data?.success) {
      throw new Error("Could not fetch this section Data");
    }
    result = response?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to fetch section details");
    result = apiError.response?.data || {};
  }
  toast.dismiss(toastId);
  return result;
};

export const createRating = async (data: { courseId: string; rating: number; review: string }, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not Create Review");
    }
    toast.success("Rating and Review added Successfully", { id: toastId, duration: 3000 });
    result = response?.data?.newCourse;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create rating", { id: toastId, duration: 4000 });
  }
  toast.dismiss(toastId);
  return result;
};

export const getAllReviews = async (): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    const response = await apiConnector("GET", GET_ALL_REVIEWS_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch Reviews");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to fetch reviews");
  }
  toast.dismiss(toastId);
  return result;
};

export const getCourseDetailsAdmin = async (courseId: string, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = {};

  try {
    const response = await apiConnector(
      "POST",
      GET_COURSE_DETAILS_ADMIN_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Course Data");
    }
    result = response?.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to fetch course details");
    result = apiError.response?.data || {};
  }
  toast.dismiss(toastId);
  return result;
};

