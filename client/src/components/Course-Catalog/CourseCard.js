import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../RatingStars";
import avgRating from "../../utils/avgRating";

export default function CourseCard({ course }) {
  const [avgRatingCount, setAvgRatingCount] = useState(0);

  useEffect(() => {
    const count = avgRating(course.ratingAndReviews);
    setAvgRatingCount(count);
  }, [course]);
  return (
    <div>
      <Link to={`/allCourses/${course._id}`}>
        <div className="bg-[#6287d8] rounded p-2">
          <div>
            <img
              src={`${course?.thumbnail}`}
              alt="course-thumbnail"
              className="h-[200px] w-full rounded object-cover bg-orange-300"
            />
          </div>
          <div>
            <p>Title:{course?.courseName}</p>
            <p>
              Instructor : {course?.instructor?.firstName}{" "}
              {course?.instructor?.lastName}
            </p>

            <div className="flex gap-x-3">
              <span>avg rating: {avgRatingCount || 0}</span>
              <RatingStars Review_Count={avgRatingCount} Star_Size={15} />
              <span>rating no : {course?.ratingAndReviews?.length}</span>
            </div>

            <div>
              <p>Price : Rs.{course?.price}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
