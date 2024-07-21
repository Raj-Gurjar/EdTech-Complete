import React, { useState } from "react";
import CourseCardAdmin from "../../../../components/Cards/CourseCardAdmin";

export default function AllCoursesAdmin({ coursesData }) {
  console.log("courseddd", coursesData);
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1 className="text-2xl">All Courses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-5">
          {coursesData?.map((course) => (
            <CourseCardAdmin course={course} key={course._id} />
          ))}
        </div>
      )}
    </div>
  );
}
