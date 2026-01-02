import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import MyDashBoard from "./MyDashBoard";
import InstDashBoard from "./Instructor/InstructorDashboard/InstDashBoard";
import AdminDashboard from "../../pages/Users/Admin/Admin DashBoard/AdminDashboard";
import Loader from "../Loader/Loader";
import { RootState } from "../../toolkit/reducer";

export default function DashboardRouter() {
  const { user } = useSelector((state: RootState) => state.profile);

  // Show loader while user data is loading
  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
        <Loader />
      </div>
    );
  }

  // Route to appropriate dashboard based on account type
  if (user.accountType === ACCOUNT_TYPE.STUDENT) {
    return <MyDashBoard />;
  } else if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
    return <InstDashBoard />;
  } else if (user.accountType === ACCOUNT_TYPE.ADMIN) {
    return <AdminDashboard />;
  }

  // Fallback - should not reach here if account types are correct
  return <Navigate to="/login" replace />;
}

