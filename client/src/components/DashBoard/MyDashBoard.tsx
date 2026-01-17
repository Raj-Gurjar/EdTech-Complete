import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import HighlightText from "../../user interfaces/HighlightText";
import Loader from "../Loader/Loader";
import { 
  FaBook, 
  FaCheckCircle, 
  FaClock, 
  FaPlayCircle,
  FaGraduationCap,
  FaArrowRight,
  FaChartLine,
  FaTrophy
} from "react-icons/fa";
import { RootState } from "../../toolkit/reducer";
import "../../pages/Home/Home.scss";

interface CourseSection {
  _id: string;
  sectionName: string;
  subSections?: {
    _id: string;
    [key: string]: any;
  }[];
  [key: string]: any;
}

interface EnrolledCourse {
  _id: string;
  courseName: string;
  thumbnail?: string;
  courseDescription?: string;
  totalDuration?: string;
  progressPercentage?: number;
  category?: {
    name: string;
  };
  ratingAndReviews?: any[];
  studentsEnrolled?: any[];
  courseContent?: CourseSection[];
  [key: string]: any;
}

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function MyDashBoard() {
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[] | null>(null);

  useEffect(() => {
    const getStudentDashData = async (): Promise<void> => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await getUserEnrolledCourses(token);
        if (response?.length) {
          setEnrolledCourses(response);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
      setLoading(false);
    };

    getStudentDashData();
  }, [token]);

  // Calculate statistics
  const totalEnrolled = enrolledCourses?.length || 0;
  const completedCoursesCount = enrolledCourses?.filter(
    (course) => course.progressPercentage === 100
  ).length || 0;
  const inProgressCourses = enrolledCourses?.filter(
    (course) => course.progressPercentage && course.progressPercentage > 0 && course.progressPercentage < 100
  ).length || 0;
  const notStartedCourses = enrolledCourses?.filter(
    (course) => !course.progressPercentage || course.progressPercentage === 0
  ).length || 0;

  // Calculate average progress
  const avgProgress = enrolledCourses && enrolledCourses.length > 0
    ? Math.round(
        enrolledCourses.reduce((acc, course) => acc + (course.progressPercentage || 0), 0) /
        enrolledCourses.length
      )
    : 0;

  // Separate courses by completion status
  const completedCourses = enrolledCourses?.filter(
    (course) => course.progressPercentage === 100
  ) || [];
  
  const notCompletedCourses = enrolledCourses?.filter(
    (course) => !course.progressPercentage || course.progressPercentage < 100
  ) || [];
  
  // Get recent courses (last 3 from not completed)
  const recentNotCompleted = notCompletedCourses.slice(0, 3);
  const recentCompleted = completedCourses.slice(0, 3);

  const stats: Stat[] = [
    {
      title: "Enrolled Courses",
      value: totalEnrolled,
      icon: <FaBook className="text-3xl" />,
      color: "text-purple6",
      bgColor: "bg-purple6/10",
      borderColor: "border-purple6/20",
    },
    {
      title: "Completed",
      value: completedCoursesCount,
      icon: <FaCheckCircle className="text-3xl" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    {
      title: "In Progress",
      value: inProgressCourses,
      icon: <FaPlayCircle className="text-3xl" />,
      color: "text-purple6",
      bgColor: "bg-purple6/10",
      borderColor: "border-purple6/20",
    },
    {
      title: "Avg. Progress",
      value: `${avgProgress}%`,
      icon: <FaChartLine className="text-3xl" />,
      color: "text-purple6",
      bgColor: "bg-purple6/10",
      borderColor: "border-purple6/20",
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
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8 relative z-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Welcome back, <HighlightText text={user?.firstName || "Student"} />! 👋
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Continue your learning journey and track your progress.
        </p>
      </div>

      {totalEnrolled > 0 ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
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

          {/* Continue Learning Section - Not Completed Courses */}
          {notCompletedCourses.length > 0 && (
            <div 
              className="rounded-xl p-6 sm:p-8 border shadow-lg mb-8"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Continue Learning</h2>
                  <p className="text-white4 text-sm">Pick up where you left off</p>
                </div>
                {notCompletedCourses.length > 3 && (
                  <Link
                    to="/dashboard/enrolledCourses"
                    className="text-purple6 hover:text-purple5 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentNotCompleted.map((course) => {
                  const progress = course.progressPercentage || 0;
                  
                  return (
                    <Link
                      key={course._id}
                      to={`/courseMenu/${course._id}/section/${course.courseContent?.[0]?._id || ''}/subSection/${course.courseContent?.[0]?.subSections?.[0]?._id || ''}`}
                      className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl group"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Course Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-black4 flex items-center justify-center">
                            <FaBook className="text-4xl text-white4" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black1/90 to-transparent p-3">
                          <p className="text-white text-sm font-semibold line-clamp-1">
                            {course.courseName}
                          </p>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-4">
                        {course.category && (
                          <p className="text-white4 text-xs mb-2">
                            {course.category.name}
                          </p>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white4 text-xs">Progress</span>
                            <span className="text-purple6 text-xs font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full bg-black5 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${progress}%`,
                                backgroundColor: 'rgb(139, 92, 246)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-xs text-white4">
                          {course.totalDuration && (
                            <div className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              <span>{course.totalDuration}</span>
                            </div>
                          )}
                          {course.studentsEnrolled && (
                            <div className="flex items-center gap-1">
                              <FaGraduationCap className="text-xs" />
                              <span>{course.studentsEnrolled.length} students</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Courses Section */}
          {completedCourses.length > 0 && (
            <div 
              className="rounded-xl p-6 sm:p-8 border shadow-lg mb-8"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaTrophy className="text-purple6" />
                    Completed Courses
                  </h2>
                  <p className="text-white4 text-sm">Great job! Review your completed courses</p>
                </div>
                {completedCourses.length > 3 && (
                  <Link
                    to="/dashboard/enrolledCourses"
                    className="text-purple6 hover:text-purple5 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCompleted.map((course) => {
                  return (
                    <Link
                      key={course._id}
                      to={`/courseMenu/${course._id}/section/${course.courseContent?.[0]?._id || ''}/subSection/${course.courseContent?.[0]?.subSections?.[0]?._id || ''}`}
                      className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl group"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Course Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-black4 flex items-center justify-center">
                            <FaBook className="text-4xl text-white4" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white"
                          style={{ backgroundColor: 'rgb(139, 92, 246)' }}
                        >
                          <FaTrophy className="text-xs" />
                          Completed
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black1/90 to-transparent p-3">
                          <p className="text-white text-sm font-semibold line-clamp-1">
                            {course.courseName}
                          </p>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-4">
                        {course.category && (
                          <p className="text-white4 text-xs mb-2">
                            {course.category.name}
                          </p>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white4 text-xs">Progress</span>
                            <span className="text-purple6 text-xs font-semibold">100%</span>
                          </div>
                          <div className="w-full bg-black5 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: "100%",
                                backgroundColor: 'rgb(139, 92, 246)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-xs text-white4">
                          {course.totalDuration && (
                            <div className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              <span>{course.totalDuration}</span>
                            </div>
                          )}
                          {course.studentsEnrolled && (
                            <div className="flex items-center gap-1">
                              <FaGraduationCap className="text-xs" />
                              <span>{course.studentsEnrolled.length} students</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/dashboard/enrolledCourses"
              className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaBook className="text-purple6" />
                    View All Courses
                  </h3>
                  <p className="text-white4 text-sm">
                    Browse and continue your enrolled courses
                  </p>
                </div>
                <FaArrowRight className="text-purple6 group-hover:translate-x-1 transition-transform text-xl" />
              </div>
            </Link>

            <Link
              to="/allCourses"
              className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-purple6" />
                    Explore Courses
                  </h3>
                  <p className="text-white4 text-sm">
                    Discover new courses to expand your skills
                  </p>
                </div>
                <FaArrowRight className="text-purple6 group-hover:translate-x-1 transition-transform text-xl" />
              </div>
            </Link>
          </div>
        </>
      ) : (
        /* Empty State */
        <div 
          className="rounded-xl p-10 sm:p-16 border shadow-lg text-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="p-6 rounded-full"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              >
                <FaGraduationCap className="text-6xl text-purple6" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-white4 text-sm sm:text-base mb-8 leading-relaxed">
              You haven't enrolled in any courses yet. Explore our course catalog and start learning something new today!
            </p>
            <button
              onClick={() => navigate("/allCourses")}
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'rgb(139, 92, 246)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(139, 92, 246, 0.5) 0px 8px 50px 0px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px';
              }}
            >
              <FaBook /> Explore Courses
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
