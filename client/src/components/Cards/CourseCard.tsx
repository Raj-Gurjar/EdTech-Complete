import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../utils/RatingStars";
import avgRating from "../../utils/avgRating";
import { FaUsers, FaBook } from "react-icons/fa";

interface Course {
  _id: string;
  courseName: string;
  thumbnail?: string;
  price?: number;
  status?: string;
  category?: {
    name: string;
  };
  instructor?: {
    firstName: string;
    lastName: string;
  };
  ratingAndReviews?: any[];
  studentsEnrolled?: any[];
  courseContent?: any[];
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [avgRatingCount, setAvgRatingCount] = useState<number>(0);

  useEffect(() => {
    const count = avgRating(course.ratingAndReviews);
    setAvgRatingCount(isNaN(count) ? 0 : count);
  }, [course]);

  const studentsEnrolled = course.studentsEnrolled?.length || 0;
  const totalRatings = course.ratingAndReviews?.length || 0;

  return (
    <Link to={`/allCourses/${course._id}`} className="group">
      <div className="bg-black2 rounded-xl overflow-hidden border border-black5 hover:border-yellow8/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow8/10 hover:-translate-y-1 h-full flex flex-col">
        {/* Course Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={course?.thumbnail || "https://via.placeholder.com/400x250"}
            alt={course?.courseName}
            className="w-full h-[180px] sm:h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250";
            }}
          />
          <div className="absolute top-3 right-3">
            {course.status === "Published" && (
              <span className="bg-yellow8 text-black text-xs font-semibold px-2 py-1 rounded-full">
                Published
              </span>
            )}
          </div>
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Course Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Category Badge */}
          {course.category && (
            <div className="mb-2">
              <span className="inline-block bg-black1 text-yellow8 text-xs font-medium px-2 py-1 rounded">
                {course.category.name}
              </span>
            </div>
          )}

          {/* Course Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow8 transition-colors">
            {course?.courseName}
          </h3>

          {/* Instructor */}
          {course?.instructor && (
            <p className="text-sm text-black7 mb-3 line-clamp-1">
              By {course.instructor.firstName} {course.instructor.lastName}
            </p>
          )}

          {/* Rating and Reviews */}
          {(avgRatingCount > 0 || totalRatings > 0) && (
            <div className="flex items-center gap-2 mb-3">
              {avgRatingCount > 0 && (
                <div className="flex items-center gap-1">
                  <RatingStars Review_Count={avgRatingCount} Star_Size={14} />
                  <span className="text-sm font-semibold text-white ml-1">
                    {avgRatingCount.toFixed(1)}
                  </span>
                </div>
              )}
              {totalRatings > 0 && (
                <span className="text-xs text-black7">
                  ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-xs text-black7 mb-4">
            {studentsEnrolled > 0 && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-sm" />
                <span>{studentsEnrolled} {studentsEnrolled === 1 ? "student" : "students"}</span>
              </div>
            )}
            {course.courseContent?.length && course.courseContent.length > 0 && (
              <div className="flex items-center gap-1">
                <FaBook className="text-sm" />
                <span>{course.courseContent.length} {course.courseContent.length === 1 ? "section" : "sections"}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-black5 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">₹{course?.price || "0"}</span>
            </div>
            <button className="text-yellow8 hover:text-yellow9 font-semibold text-sm transition-colors">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

