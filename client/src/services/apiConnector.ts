import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getStoredToken, isTokenExpired, removeToken, saveToken } from "../utils/tokenUtils";
import { authEndpoints } from "./api";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    
    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      console.warn("Token expired, removing from storage");
      removeToken();
      // Don't add expired token to request
    } else if (token && !isTokenExpired(token)) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle token expiration
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          authEndpoints.REFRESH_TOKEN_API,
          {},
          { withCredentials: true }
        );

        if (response.data.success && response.data.token) {
          const newToken = response.data.token;
          saveToken(newToken);
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear token and redirect to login
        removeToken();
        localStorage.removeItem("user");
        
        // Only show toast if not already on login page
        if (window.location.pathname !== "/login") {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors (invalid token, etc.)
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      if (errorCode === "TOKEN_INVALID" || errorCode === "TOKEN_ERROR") {
        removeToken();
        localStorage.removeItem("user");
        
        if (window.location.pathname !== "/login") {
          toast.error("Authentication failed. Please login again.");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const apiConnector = (
  method: string,
  url: string,
  bodyData?: any,
  headers?: Record<string, string>,
  params?: Record<string, any>,
  onUploadProgress?: (progressEvent: any) => void
): Promise<AxiosResponse> => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
    onUploadProgress: onUploadProgress || undefined,
  });
};
