import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../utils/RatingStars";
import avgRating from "../../utils/avgRating";
import { FaUsers, FaBook } from "react-icons/fa";
import FramerImageEffect from "../Home/FramerImageEffect";

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
      <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple6/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(139,_92,_246,_0.4)] hover:-translate-y-1 h-full flex flex-col">
        {/* Course Thumbnail */}
        <FramerImageEffect className="w-full">
          <div className="relative rounded-[19px] overflow-hidden">
          <img
            src={course?.thumbnail || "https://via.placeholder.com/400x250"}
            alt={course?.courseName}
            className="w-full h-[180px] sm:h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250";
            }}
          />
            <div className="absolute top-3 right-3 z-10">
            {course.status === "Published" && (
                <span className="bg-purple6 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                Published
              </span>
            )}
          </div>
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        </FramerImageEffect>

        {/* Course Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Category Badge */}
          {course.category && (
            <div className="mb-2">
              <span className="inline-block bg-purple6/20 text-purple6 text-xs font-medium px-2 py-1 rounded border border-purple6/30">
                {course.category.name}
              </span>
            </div>
          )}

          {/* Course Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple6 transition-colors">
            {course?.courseName}
          </h3>

          {/* Instructor */}
          {course?.instructor && (
            <p className="text-sm text-white4 mb-3 line-clamp-1">
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
                <span className="text-xs text-white4">
                  ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-xs text-white4 mb-4">
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
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">₹{course?.price || "0"}</span>
            </div>
            <button className="text-purple6 hover:text-purple5 font-semibold text-sm transition-colors">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

