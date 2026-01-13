import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { Link } from "react-router-dom";
import HighlightText from "../../../user interfaces/HighlightText";
import RatingStars from "../../../utils/RatingStars";
import avgRating from "../../../utils/avgRating";
import { 
  FaBook, 
  FaClock, 
  FaPlayCircle, 
  FaGraduationCap,
  FaUsers,
  FaTag,
  FaSpinner
} from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { RootState } from "../../../toolkit/reducer";

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

export default function EnrolledCourses() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEnrolledCourses = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await getUserEnrolledCourses(token);
        setEnrolledCourses(response);
      } catch (error) {
        console.log("Unable to fetch Enrolled Courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getEnrolledCourses();
    }
  }, [token]);

  // Loading State
  if (isLoading) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"My Enrolled Courses"} />
          </h1>
          <p className="text-black6 text-sm sm:text-base">Continue your learning journey</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="text-6xl text-purple6 animate-spin mx-auto mb-4" />
            <p className="text-black7 text-lg">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"My Enrolled Courses"} />
          </h1>
          <p className="text-black6 text-sm sm:text-base">Continue your learning journey</p>
        </div>

        <div className="bg-black4 rounded-2xl shadow-xl p-12 sm:p-16 border border-black6 text-center">
          <div className="mb-6">
            <FaGraduationCap className="text-8xl text-black6 mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">No enrolled courses yet</h2>
          <p className="text-black7 mb-8 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Browse our course catalog and start learning today!
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
          <HighlightText text={"My Enrolled Courses"} />
        </h1>
        <p className="text-black6 text-sm sm:text-base">
          {enrolledCourses.length} {enrolledCourses.length === 1 ? "course" : "courses"} enrolled
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course, index) => {
          // Calculate rating - handle both populated objects and IDs
          let courseRating = 0;
          let totalRatings = 0;
          
          if (course?.ratingAndReviews && Array.isArray(course.ratingAndReviews)) {
            totalRatings = course.ratingAndReviews.length;
            // Check if ratingAndReviews contains objects with rating property
            const hasRatingObjects = course.ratingAndReviews.some(
              (item) => item && typeof item === 'object' && item.rating !== undefined
            );
            
            if (hasRatingObjects) {
              courseRating = avgRating(course.ratingAndReviews);
            } else {
              // If it's just IDs, we can't calculate rating from enrolled courses
              // Rating will show as 0, but we'll still show review count
              courseRating = 0;
            }
          }
          
          // Ensure rating is valid number
          courseRating = isNaN(courseRating) ? 0 : courseRating;
          
          const progress = course.progressPercentage || 0;
          const firstSection = course.courseContent?.[0];
          const firstSubSection = firstSection?.subSections?.[0];
          const courseLink = firstSection && firstSubSection
            ? `/courseMenu/${course._id}/section/${firstSection._id}/subSection/${firstSubSection._id}`
            : `/allCourses/${course._id}`;

          return (
            <div
              key={course._id || index}
              className="bg-black4 rounded-xl shadow-lg overflow-hidden border border-black6 hover:border-purple6/50 transition-all duration-300 group"
            >
              <Link to={courseLink} className="block">
                {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/400x250"}
                    alt={course.courseName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250";
                    }}
                  />
                  {/* Progress Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-semibold">Progress</span>
                      <span className="text-purple6 text-sm font-bold">{progress}%</span>
                    </div>
                    <ProgressBar
                      completed={progress}
                      maxCompleted={100}
                      height="8px"
                      width="100%"
                      isLabelVisible={false}
                      bgColor="#ffe344"
                      baseBgColor="rgba(255, 255, 255, 0.2)"
                      className="rounded-full"
                    />
                  </div>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-purple6 text-black rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
                      <MdPlayArrow className="text-3xl" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  {/* Category Badge */}
                  {course.category && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 bg-blue6 bg-opacity-20 text-blue5 text-xs font-medium px-2 py-1 rounded">
                        <FaTag className="text-xs" />
                        {course.category.name}
                      </span>
                    </div>
                  )}

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple6 transition-colors">
                    {course.courseName}
                  </h3>

                  {/* Course Description */}
                  {course.courseDescription && (
                    <p className="text-sm text-black7 mb-4 line-clamp-2">
                      {course.courseDescription}
                    </p>
                  )}

                  {/* Rating */}
                  {totalRatings > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      {courseRating > 0 ? (
                        <>
                          <div className="flex items-center gap-1">
                            <RatingStars Review_Count={courseRating} Star_Size={14} />
                            <span className="text-sm font-semibold text-white ml-1">
                              {courseRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-black7">
                            ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-black7">
                          {totalRatings} {totalRatings === 1 ? "review" : "reviews"} (no ratings yet)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-xs text-black7 mb-4 pb-4 border-b border-black6">
                    {course.totalDuration && (
                      <div className="flex items-center gap-1">
                        <FaClock className="text-sm" />
                        <span>{course.totalDuration}</span>
                      </div>
                    )}
                    {course.studentsEnrolled && course.studentsEnrolled.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-sm" />
                        <span>{course.studentsEnrolled.length} students</span>
                      </div>
                    )}
                    {course.courseContent && course.courseContent.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FaBook className="text-sm" />
                        <span>{course.courseContent.length} sections</span>
                      </div>
                    )}
                  </div>

                  {/* Continue Learning Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {progress === 100 ? (
                        <div className="flex items-center gap-2 text-caribbeanGreen5">
                          <FaGraduationCap />
                          <span className="text-sm font-semibold">Completed</span>
                        </div>
                      ) : progress > 0 ? (
                        <div className="flex items-center gap-2 text-purple6">
                          <FaPlayCircle />
                          <span className="text-sm font-semibold">Continue Learning</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-blue5">
                          <MdPlayArrow />
                          <span className="text-sm font-semibold">Start Learning</span>
                        </div>
                      )}
                    </div>
                    <MdPlayArrow className="text-purple6 text-xl group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

