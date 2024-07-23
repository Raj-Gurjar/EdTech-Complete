import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminData } from "../../../../services/operations/profileAPI";

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const getAdminDashData = async () => {
    setLoading(true);

    const response = await getAdminData(token);
    setAdminData(response);

    setLoading(false);
  };

  useEffect(() => {
    getAdminDashData();
  }, []);

  return (
    <div>
      <div>
        <h2>Hi {user?.firstName}</h2>
        <p>See your platform stats:</p>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          adminData && (
            <div className="bg-red-400">
              <p>Total Users: {adminData.totalUsers}</p>
              <p>Total Students: {adminData.totalStudents}</p>
              <p>Total Instructors: {adminData.totalInstructors}</p>
              <p>Total Courses: {adminData.totalCourses}</p>
              <p>Total Categories: {adminData.totalCategories}</p>
              <p>Total Active Students: {adminData.totalActiveStudents}</p>
              <p>
                Total Active Instructors: {adminData.totalActiveInstructors}
              </p>
              <p>Total Earnings (Admin): ${adminData.totalEarningAdmin}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
