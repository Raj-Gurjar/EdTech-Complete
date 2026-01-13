import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import HighlightText from "../../../user interfaces/HighlightText";
import { 
  FaBook, 
  FaRupeeSign,
  FaSpinner,
  FaTag,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import { RootState } from "../../../toolkit/reducer";
import { formateDate } from "../../../utils/formatDate";

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
  price?: number;
  category?: {
    name: string;
  };
  instructor?: {
    firstName: string;
    lastName: string;
  };
  courseContent?: CourseSection[];
  createdAt?: string;
  [key: string]: any;
}

export default function MyPurchases() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [purchasedCourses, setPurchasedCourses] = useState<EnrolledCourse[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPurchasedCourses = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await getUserEnrolledCourses(token);
        // Sort by most recent first (assuming courses are added in order)
        const sortedCourses = response?.sort((a: EnrolledCourse, b: EnrolledCourse) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setPurchasedCourses(sortedCourses || []);
      } catch (error) {
        console.log("Unable to fetch Purchased Courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getPurchasedCourses();
    }
  }, [token]);

  // Loading State
  if (isLoading) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"My Purchases"} />
          </h1>
          <p className="text-black6 text-sm sm:text-base">View your course purchase history</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="text-6xl text-purple6 animate-spin mx-auto mb-4" />
            <p className="text-black7 text-lg">Loading your purchases...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!purchasedCourses || purchasedCourses.length === 0) {
    return (
      <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"My Purchases"} />
          </h1>
          <p className="text-black6 text-sm sm:text-base">View your course purchase history</p>
        </div>

        <div className="bg-black4 rounded-2xl shadow-xl p-12 sm:p-16 border border-black6 text-center">
          <div className="mb-6">
            <FaBook className="text-8xl text-black6 mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">No purchases yet</h2>
          <p className="text-black7 mb-8 max-w-md mx-auto">
            You haven't purchased any courses yet. Browse our course catalog and start learning today!
          </p>
          <Link
            to="/allCourses"
            className="inline-flex items-center gap-2 bg-purple6 hover:bg-purple5 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <FaBook />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <HighlightText text={"My Purchases"} />
        </h1>
        <p className="text-black6 text-sm sm:text-base">
          {purchasedCourses.length} {purchasedCourses.length === 1 ? "course" : "courses"} purchased
        </p>
      </div>

      {/* Purchases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {purchasedCourses.map((course) => {
          const purchaseDate = course.createdAt 
            ? formateDate(course.createdAt).split("|")[0] 
            : "N/A";

          return (
            <div
              key={course._id}
              className="bg-black4 rounded-xl overflow-hidden border border-black6 hover:border-purple6 transition-all duration-300 hover:shadow-xl group"
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
                  <div className="w-full h-full bg-black5 flex items-center justify-center">
                    <FaBook className="text-5xl text-white4" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black1/95 to-transparent p-4">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {course.courseName}
                  </h3>
                  {course.instructor && (
                    <p className="text-white4 text-xs">
                      by {course.instructor.firstName} {course.instructor.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Purchase Info */}
              <div className="p-5">
                {/* Category */}
                {course.category && (
                  <div className="flex items-center gap-1 text-purple6 text-xs font-medium mb-4">
                    <FaTag className="text-xs" />
                    <span>{course.category.name}</span>
                  </div>
                )}

                {/* Purchase Details */}
                <div className="bg-black5 rounded-lg p-4 mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white4 text-sm">
                      <FaRupeeSign className="text-purple6" />
                      <span>Purchase Price</span>
                    </div>
                    <span className="text-purple6 font-bold text-xl">
                      ₹{course.price || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white4 text-sm pt-2 border-t border-black6">
                    <FaCalendarAlt className="text-purple6" />
                    <span>Purchased on: <span className="text-white font-medium">{purchaseDate}</span></span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/courseMenu/${course._id}/section/${course.courseContent?.[0]?._id || ''}/subSection/${course.courseContent?.[0]?.subSections?.[0]?._id || ''}`}
                  className="flex items-center justify-center gap-2 w-full bg-purple6 hover:bg-purple5 text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span>Access Course</span>
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
