import toast from "react-hot-toast";
import { updateCompletedLectures } from "../../toolkit/slice/viewCourseSlice";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../api";

const {
  GET_ALL_COURSES_API,
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
} = courseEndpoints;

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading");
  let result = [];

  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch Courses");
    }
    toast.success("All courses details fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Get all courses api error...", error);
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
    result = error.response.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const addCourseDetails = async (data, token) => {
  // console.log("add course api entered data: ", data.getAll("category"));
  const toastId = toast.loading("Loading");
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    // console.log("add course detail..", response);

    if (!response?.data?.success) {
      throw new Error("Could not add details in Course");
    }
    toast.success("Course Details added Successfully");
    result = response?.data?.newCourse;
    // console.log("result in addCourse", result);
  } catch (error) {
    console.log("add course api error...", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data, token) => {
  console.log("entering createSection", data);
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
  }
  console.log("Result: ", result);
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Loading");
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    console.log("create sub-section api response..", response);

    if (!response?.data?.success) {
      throw new Error("Could not create sub-section");
    }
    toast.success("Sub-Section Created Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("create sub-section api error...", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (data, token) => {
  // console.log("inside update section");
  const toastId = toast.loading("Loading");
  let result = null;
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
    toast.error(error.response);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  // console.log("entering updateSubSec api call:", data);
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};

//! ......... incomplete 7.01 24th video
export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading..");
  let result = [];

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
    // console.log("type of result", typeof result);
  } catch (error) {
    console.log("Course Instructor api error...", error);
    toast.error(error.response.message);
    result = error.response.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (data, token) => {
  // console.log("entering updateSubSec api call:", data);
  const toastId = toast.loading("Loading");
  let result = null;

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
    toast.error(error.response.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading..");
  let result = [];
  

  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log("Full courses detail..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch Full Course Details");
    }
    toast.success("Full Course fetched successfully");
    result = response?.data?.data;
    // console.log("type of result", typeof result);
  } catch (error) {
    console.log("Full Course api error...", error);
    toast.error(error.response.message);
    result = error.response.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const getCourseDetails = async (courseId) => {
  // console.log("inside course by id");
  const toastId = toast.loading("Loading");
  let result = [];

  try {
    const response = await apiConnector("POST", GET_COURSE_DETAILS, {
      courseId,
    });
    // console.log("Course detail page..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch this Course  Data");
    }
    // toast.success("Course Category details fetched");
    result = response?.data;
  } catch (error) {
    console.log("course details page api error...", error);
    toast.error(error?.response?.data?.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

export const getSectionDetails = async (sectionId) => {
  // console.log("inside section by id");
  const toastId = toast.loading("Loading");
  let result = [];

  try {
    const response = await apiConnector("POST", GET_SECTION_DETAILS, {
      id: sectionId,
    });
    // console.log("Course detail page..", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch this section Data");
    }
    // toast.success("Course Category details fetched");
    result = response?.data;
  } catch (error) {
    console.log("section details page api error...", error);
    toast.error(error?.response?.data?.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
