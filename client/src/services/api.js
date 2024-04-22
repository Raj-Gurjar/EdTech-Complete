const BASE_URL = process.env.REACT_APP_BASE_URL;

//! Auth endpoints
export const authEndpoints = {
  SEND_AUTH_OTP_API: BASE_URL + "/auth/sendOtp",
  SIGN_UP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
};

//! PROFILE ENDPOINTS

export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
};

//! STUDENTS ENDPOINTS
export const studentPaymentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

//! COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSES_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  GET_COURSE_DETAILS: BASE_URL + "/course/getCourse",
  GET_SECTION_DETAILS: BASE_URL + "/course/getSection",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

//! REVIEWS ENDPOINTS
export const reviewEndpoints = {
  REVIEW_DETAILS_API: BASE_URL + "/course/getReviews",
};

//! CATEGORY ENDPOINTS
export const categoryEndpoints = {
  CATEGORY_PAGE_DATA_API: BASE_URL + "/category/getCategoryPageDetails",
  GET_ALL_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  CREATE_CATEGORY_API: BASE_URL + "/category/createCategory",
};

//! CONTACT ENDPOINT

export const contactEndpoints = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

//! SETTINGS ENDPOINTS
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};
