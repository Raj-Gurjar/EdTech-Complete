import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/api";
import HighlightText from "../../user interfaces/HighlightText";
import { FaStar, FaUsers, FaBook, FaArrowRight } from "react-icons/fa";
import avgRating from "../../utils/avgRating";

interface Course {
  _id: string;
  courseName: string;
  courseDescription?: string;
  thumbnail?: string;
  price: number;
  ratingAndReviews?: any[];
  studentsEnrolled?: any[];
  instructor?: {
    firstName?: string;
    lastName?: string;
  };
  [key: string]: any;
}

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      try {
        const response = await apiConnector("GET", courseEndpoints.GET_ALL_COURSES_PUBLIC_API);
        if (response?.data?.success) {
          const allCourses = response.data.data || [];
          // Get top 6 courses (by students enrolled or rating)
          const sortedCourses = [...allCourses]
            .sort((a, b) => {
              const aStudents = a.studentsEnrolled?.length || 0;
              const bStudents = b.studentsEnrolled?.length || 0;
              return bStudents - aStudents;
            })
            .slice(0, 6);
          setCourses(sortedCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Featured <HighlightText text="Courses" />
          </h2>
          <p className="text-white4 text-sm sm:text-base max-w-2xl mx-auto">
            Discover our most popular courses taught by expert instructors
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black2 rounded-xl p-6 animate-pulse">
              <div className="bg-black3 h-48 rounded-lg mb-4"></div>
              <div className="bg-black3 h-6 rounded mb-2"></div>
              <div className="bg-black3 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Featured <HighlightText text="Courses" />
        </h2>
        <p className="text-white4 text-sm sm:text-base max-w-2xl mx-auto">
          Discover our most popular courses taught by expert instructors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {courses.map((course) => {
          const rating = avgRating(course.ratingAndReviews || []);
          const studentsCount = course.studentsEnrolled?.length || 0;
          const instructorName = course.instructor
            ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
            : "Instructor";

          return (
            <Link
              key={course._id}
              to={`/allCourses/${course._id}`}
              className="bg-black2 rounded-xl overflow-hidden border border-black5 hover:border-purple6 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-black3 flex items-center justify-center">
                    <FaBook className="text-6xl text-white4" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple6 transition-colors">
                  {course.courseName}
                </h3>
                
                <p className="text-white4 text-sm mb-4 line-clamp-2">
                  {course.courseDescription || "Learn from expert instructors"}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm text-white6">
                  {rating > 0 && (
                    <div className="flex items-center gap-1">
                      <FaStar className="text-purple6" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  )}
                  {studentsCount > 0 && (
                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>{studentsCount}</span>
                    </div>
                  )}
                </div>

                {/* Instructor & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-black5">
                  <div>
                    <p className="text-white4 text-xs sm:text-sm">{instructorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple6 font-bold text-lg sm:text-xl">
                      ₹{course.price || 0}
                    </span>
                    <FaArrowRight className="text-purple6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8 sm:mt-12">
        <Link to="/allCourses">
          <button className="bg-purple6 hover:bg-purple5 text-black font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base inline-flex items-center gap-2">
            View All Courses
            <FaArrowRight />
          </button>
        </Link>
      </div>
    </div>
  );
}

