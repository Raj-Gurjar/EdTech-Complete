import { useSelector } from "react-redux";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../toolkit/slice/authSlice";
import { isTokenValid, getStoredToken, removeToken } from "./tokenUtils";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check token validity on mount and periodically
    const checkTokenValidity = () => {
      const storedToken = getStoredToken();
      
      if (!storedToken) {
        // No token in storage, clear Redux state
        if (token) {
          dispatch(setToken(null));
        }
        return;
      }

      if (!isTokenValid(storedToken)) {
        // Token is expired or invalid
        removeToken();
        dispatch(setToken(null));
        localStorage.removeItem("user");
        
        if (window.location.pathname !== "/login") {
          toast.error("Session expired. Please login again.", { duration: 4000 });
          window.location.href = "/login";
        }
        return;
      }

      // Token is valid, sync with Redux if needed
      if (token !== storedToken) {
        dispatch(setToken(storedToken));
      }
    };

    // Check immediately
    checkTokenValidity();

    // Check every 5 minutes
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, dispatch]);

  // Check if token exists and is valid
  const storedToken = getStoredToken();
  const isValid = isTokenValid(storedToken);

  if (!storedToken || !isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
