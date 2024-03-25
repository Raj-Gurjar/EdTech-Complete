const BASE_URL = process.env.REACT_APP_BASE_URL;

//! Auth endpoints
export const authEndpoints = {
  SEND_AUTH_OTP_API: BASE_URL + "/auth/sendOtp",
  SIGN_UP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
};

//! PROFILE ENDPOINTS

export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
};

//! 55 MINS