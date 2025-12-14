import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useSelector((state: any) => state.auth);

  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
