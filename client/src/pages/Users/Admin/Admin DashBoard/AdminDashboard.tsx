import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminData } from "../../../../services/operations/profileAPI";
import HighlightText from "../../../../user interfaces/HighlightText";
import Loader from "../../../../components/Loader/Loader";
import {
  FaUsers,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBook,
  FaTags,
  FaUserCheck,
  FaRupeeSign,
  FaArrowRight,
} from "react-icons/fa";
import { ReactElement } from "react";
import { RootState } from "../../../../toolkit/reducer";

interface AdminData {
  totalUsers?: number;
  totalStudents?: number;
  totalInstructors?: number;
  totalCourses?: number;
  totalCategories?: number;
  totalActiveStudents?: number;
  totalActiveInstructors?: number;
  totalEarningAdmin?: number | string;
  [key: string]: any;
}

interface Stat {
  title: string;
  value: string | number;
  icon: ReactElement;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: ReactElement;
  path: string;
  color: string;
}

export default function AdminDashboard() {
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    const getAdminDashData = async (): Promise<void> => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await getAdminData(token);
        setAdminData(response);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
      setLoading(false);
    };

    getAdminDashData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
        <Loader />
      </div>
    );
  }

  const stats: Stat[] = [
    {
      title: "Total Users",
      value: adminData?.totalUsers || 0,
      icon: <FaUsers className="text-3xl" />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      title: "Total Students",
      value: adminData?.totalStudents || 0,
      icon: <FaGraduationCap className="text-3xl" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    {
      title: "Total Instructors",
      value: adminData?.totalInstructors || 0,
      icon: <FaChalkboardTeacher className="text-3xl" />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
    {
      title: "Total Courses",
      value: adminData?.totalCourses || 0,
      icon: <FaBook className="text-3xl" />,
      color: "text-yellow8",
      bgColor: "bg-yellow8/10",
      borderColor: "border-yellow8/20",
    },
    {
      title: "Total Categories",
      value: adminData?.totalCategories || 0,
      icon: <FaTags className="text-3xl" />,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20",
    },
    {
      title: "Active Students",
      value: adminData?.totalActiveStudents || 0,
      icon: <FaUserCheck className="text-3xl" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/20",
    },
    {
      title: "Active Instructors",
      value: adminData?.totalActiveInstructors || 0,
      icon: <FaChalkboardTeacher className="text-3xl" />,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-400/20",
    },
    {
      title: "Total Earnings",
      value: `₹${parseFloat(String(adminData?.totalEarningAdmin || 0)).toLocaleString()}`,
      icon: <FaRupeeSign className="text-3xl" />,
      color: "text-yellow8",
      bgColor: "bg-yellow8/10",
      borderColor: "border-yellow8/20",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Manage Courses",
      description: "View, approve, and manage all courses",
      icon: <FaBook className="text-2xl" />,
      path: "/dashboard/courseMenu-admin",
      color: "text-yellow8",
    },
    {
      title: "Manage Categories",
      description: "Create and manage course categories",
      icon: <FaTags className="text-2xl" />,
      path: "/dashboard/categoryMenu",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Welcome back, <HighlightText text={user?.firstName || "Admin"} />! 👋
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Here's an overview of your platform's performance and statistics.
        </p>
      </div>

      {adminData ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-white4 text-sm font-medium mb-1">{stat.title}</h3>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* User Distribution */}
            <div className="bg-black2 rounded-xl p-6 border border-black5 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Students</span>
                  <span className="text-green-400 font-semibold">
                    {adminData.totalStudents || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Instructors</span>
                  <span className="text-purple-400 font-semibold">
                    {adminData.totalInstructors || 0}
                  </span>
                </div>
                <div className="pt-3 border-t border-black5">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-yellow8 font-bold text-lg">
                      {adminData.totalUsers || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="bg-black2 rounded-xl p-6 border border-black5 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Active Students</span>
                  <span className="text-cyan-400 font-semibold">
                    {adminData.totalActiveStudents || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Active Instructors</span>
                  <span className="text-pink-400 font-semibold">
                    {adminData.totalActiveInstructors || 0}
                  </span>
                </div>
                <div className="pt-3 border-t border-black5">
                  <div className="flex justify-between items-center">
                    <span className="text-white4 text-sm">Engagement Rate</span>
                    <span className="text-yellow8 font-bold">
                      {adminData.totalUsers && adminData.totalUsers > 0
                        ? Math.round(
                            ((adminData.totalActiveStudents || 0) /
                              adminData.totalUsers) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-black2 rounded-xl p-6 border border-black5 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Platform Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Courses</span>
                  <span className="text-yellow8 font-semibold">
                    {adminData.totalCourses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white4 text-sm">Categories</span>
                  <span className="text-orange-400 font-semibold">
                    {adminData.totalCategories || 0}
                  </span>
                </div>
                <div className="pt-3 border-t border-black5">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total Revenue</span>
                    <span className="text-yellow8 font-bold text-lg">
                      ₹{parseFloat(String(adminData.totalEarningAdmin || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 border border-black5 hover:border-yellow8 shadow-lg hover:shadow-xl transition-all duration-300 group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${action.color} bg-black2 p-3 rounded-lg`}>
                          {action.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{action.title}</h3>
                      </div>
                      <p className="text-white4 text-sm">{action.description}</p>
                    </div>
                    <FaArrowRight className={`${action.color} group-hover:translate-x-1 transition-transform text-xl`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-black2 rounded-xl p-10 sm:p-16 border border-black5 shadow-lg text-center">
          <p className="text-white text-xl font-semibold">No data available</p>
          <p className="text-white4 text-sm mt-2">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      )}
    </div>
  );
}

