import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../utils/RatingStars";
import avgRating from "../../utils/avgRating";
import { COURSE_STATUS } from "../../utils/constants";
import { FaUser, FaRupeeSign, FaStar, FaBookOpen } from "react-icons/fa";

export default function CourseCardAdmin({ course }) {
  const [avgRatingCount, setAvgRatingCount] = useState(0);

  useEffect(() => {
    const count = avgRating(course.ratingAndReviews);
    setAvgRatingCount(count);
  }, [course]);

  const totalStudents = course?.studentsEnrolled?.length || 0;
  const totalLectures = course?.courseContent?.reduce(
    (acc, section) => acc + (section?.subSections?.length || 0),
    0
  ) || 0;

  return (
    <Link to={`${course._id}`}>
      <div className="bg-black2 rounded-xl border border-black5 shadow-lg overflow-hidden hover:shadow-xl hover:border-yellow8 transition-all duration-300 group">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                course?.status === COURSE_STATUS.PUBLISHED
                  ? "bg-green-500 text-white"
                  : "bg-orange-400 text-black"
              }`}
            >
              {course?.status?.toUpperCase() || "DRAFT"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Course Title */}
          <h3 className="text-white text-lg font-semibold line-clamp-2 group-hover:text-yellow8 transition-colors">
            {course?.courseName}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-white4 text-sm">
            <FaUser className="text-yellow8" />
            <span>
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </span>
          </div>

          {/* Category */}
          {course?.category?.name && (
            <div className="flex items-center gap-2 text-white4 text-sm">
              <FaBookOpen className="text-yellow8" />
              <span>{course?.category?.name}</span>
            </div>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow8 text-sm" />
              <span className="text-white font-semibold text-sm">
                {avgRatingCount.toFixed(1) || "0.0"}
              </span>
            </div>
            <RatingStars Review_Count={avgRatingCount} Star_Size={14} />
            <span className="text-white4 text-sm">
              ({course?.ratingAndReviews?.length || 0})
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-black5">
            <div className="flex items-center gap-4 text-white6 text-sm">
              <div className="flex items-center gap-1">
                <FaUser className="text-yellow8" />
                <span>{totalStudents} students</span>
              </div>
              {totalLectures > 0 && (
                <div className="flex items-center gap-1">
                  <FaBookOpen className="text-yellow8" />
                  <span>{totalLectures} lectures</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-yellow8 font-bold">
              <FaRupeeSign />
              <span>{course?.price || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
