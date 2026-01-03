import toast from "react-hot-toast";
import { updateCompletedLectures } from "../../toolkit/slice/viewCourseSlice";
import { apiConnector } from "../apiConnector";
import { courseEndpoints, reviewEndpoints } from "../api";
import { AxiosError } from "axios";

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
      message?: string;
    };
    message?: string;
  };
  message?: string;
}

export const getAllCoursesPublic = async (): Promise<any[]> => {
  const toastId = toast.loading("Loading");
  let result: any[] = [];

  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_PUBLIC_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch Courses");
    }
    toast.success("All courses details fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Get all courses api error...", error);
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
    toast.success("All courses details fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Get all courses api error...", error);
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
    toast.success("Course Published Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Publish course api error...", error);
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error in publishing the course"
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
    toast.success("Course Unpublished Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Unpublish course api error...", error);
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error in unpublishing the course"
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
    console.log("Course detail..", response);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    toast.success("A Course details fetched successfully");
    result = response?.data;
  } catch (error) {
    console.log("course details api error...", error);
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
        "Content-Type": "multipart/form-data",
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
      throw new Error("Could not add details in Course");
    }
    toast.success("Course Details added Successfully", { id: toastId });
    result = response?.data?.newCourse;
  } catch (error) {
    console.log("add course api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to add course details", { id: toastId });
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
    console.log("edit course detail..", response);

    if (!response?.data?.success) {
      throw new Error("Could not edit details in Course");
    }
    toast.success("Course Details edited Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("edit course api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to edit course details");
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data: any, token: string): Promise<any> => {
  console.log("entering createSection", data);
  const toastId = toast.loading("Loading");
  let result: any = null;

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("create section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not create section");
    }
    toast.success("Section Created Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("create section api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create section");
  }
  console.log("Result: ", result);
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
        "Content-Type": "multipart/form-data",
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
    console.log("create sub-section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not create sub-section");
    }
    toast.success("Sub-Section Created Successfully", { id: toastId });
    result = response?.data?.data;
  } catch (error) {
    console.log("create sub-section api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create sub-section", { id: toastId });
  }
  return result;
};

export const updateSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;
  console.log("sec update api data: ", data);
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("update section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not update section");
    }
    toast.success("Section Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("update section api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to update section");
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
    console.log("update sub-section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not update sub-section");
    }
    toast.success("Sub-Section Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("update sub-section api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to update sub-section");
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data: any, token: string): Promise<any> => {
  const toastId = toast.loading("Loading");
  let result: any = null;

  console.log("delete sub sec data : ", data);
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("delete section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete section");
    }
    toast.success("Section deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("delete section api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete section");
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
    console.log("delete sub-section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete subsection");
    }
    toast.success("subSection deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("delete subsection api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete subsection");
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
    console.log("Instructor courses detail..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch Instructor Courses");
    }
    toast.success("Course Instructors fetched successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Course Instructor api error...", error);
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

  console.log("delete course data : ", data);
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("delete course api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete course");
    }
    toast.success("Course deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("delete course api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to delete course");
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
    toast.success("Full Course fetched successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Full Course api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.message || "Failed to fetch full course details");
    result = Array.isArray(apiError.response?.data) ? apiError.response.data : (apiError.response?.data || []);
  }
  toast.dismiss(toastId);
  return result;
};

export const markLectureAsComplete = async (data: any, token: string): Promise<boolean> => {
  let result: boolean = false;
  console.log("mark comp", data);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Mark Lect as comp api response....", response);

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    console.log("Mark lect api error....", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Failed to mark lecture as complete");
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
    console.log("res", result);
  } catch (error) {
    console.log("course details page api error...", error);
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
    console.log("section details page api error...", error);
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
    toast.success("Rating and Review added Successfully");
    result = response?.data?.newCourse;
  } catch (error) {
    console.log("review api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to create rating");
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
    toast.success("All Reviews details fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Get all reviews api error...", error);
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
      courseId,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Course Data");
    }
    result = response?.data;
  } catch (error) {
    console.log("course details admin page api error...", error);
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Failed to fetch course details");
    result = apiError.response?.data || {};
  }
  toast.dismiss(toastId);
  return result;
};

