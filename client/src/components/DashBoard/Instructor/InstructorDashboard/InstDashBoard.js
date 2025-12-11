import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link, useNavigate } from "react-router-dom";
import HighlightText from "../../../../user interfaces/HighlightText";
import { 
  FaBook, 
  FaUsers, 
  FaRupeeSign, 
  FaChartLine, 
  FaPlus,
  FaArrowRight,
  FaGraduationCap
} from "react-icons/fa";
import Loader from "../../../Loader/Loader";

export default function InstDashBoard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);

  useEffect(() => {
    const getInstructorDashData = async () => {
      setLoading(true);
      try {
        const response = await getInstructorData(token);
        if (response?.length) {
          setInstructorData(response);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
      setLoading(false);
    };

    getInstructorDashData();
  }, [token]);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + (curr.totalAmountGenerated || 0),
    0
  ) || 0;
  
  const totalStudentsEnrolled = instructorData?.reduce(
    (acc, curr) => acc + (curr.totalStudentsEnrolled || 0),
    0
  ) || 0;

  const totalCourses = user?.courses?.length || instructorData?.length || 0;

  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: <FaBook className="text-3xl" />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      title: "Students Enrolled",
      value: totalStudentsEnrolled,
      icon: <FaUsers className="text-3xl" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    {
      title: "Total Income",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: <FaRupeeSign className="text-3xl" />,
      color: "text-yellow8",
      bgColor: "bg-yellow8/10",
      borderColor: "border-yellow8/20",
    },
    {
      title: "Avg. per Course",
      value: totalCourses > 0 ? `₹${Math.round(totalAmount / totalCourses).toLocaleString()}` : "₹0",
      icon: <FaChartLine className="text-3xl" />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Welcome back, <HighlightText text={user?.firstName || "Instructor"} />! 👋
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Here's an overview of your teaching journey and course performance.
        </p>
      </div>

      {totalCourses > 0 ? (
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

          {/* Chart Section */}
          <div className="bg-black2 rounded-xl p-6 sm:p-8 border border-black5 shadow-lg mb-8">
            <InstructorChart
              courses={instructorData}
              totalStudents={totalStudentsEnrolled}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/dashboard/myCourses-Instructor"
              className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 border border-black5 hover:border-yellow8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaBook className="text-yellow8" />
                    View All Courses
                  </h3>
                  <p className="text-white4 text-sm">
                    Manage and edit your course content
                  </p>
                </div>
                <FaArrowRight className="text-yellow8 group-hover:translate-x-1 transition-transform text-xl" />
              </div>
            </Link>

            <Link
              to="/dashboard/createCourse"
              className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 border border-black5 hover:border-yellow8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaPlus className="text-yellow8" />
                    Create New Course
                  </h3>
                  <p className="text-white4 text-sm">
                    Start building your next course
                  </p>
                </div>
                <FaArrowRight className="text-yellow8 group-hover:translate-x-1 transition-transform text-xl" />
              </div>
            </Link>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-black2 rounded-xl p-10 sm:p-16 border border-black5 shadow-lg text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="bg-yellow8/10 p-6 rounded-full">
                <FaGraduationCap className="text-6xl text-yellow8" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Your Teaching Journey
            </h2>
            <p className="text-white4 text-sm sm:text-base mb-8 leading-relaxed">
              You haven't created any courses yet. Create your first course and start sharing your knowledge with students around the world!
            </p>
            <button
              onClick={() => navigate("/dashboard/createCourse")}
              className="inline-flex items-center gap-2 bg-yellow8 hover:bg-yellow9 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FaPlus /> Create Your First Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
