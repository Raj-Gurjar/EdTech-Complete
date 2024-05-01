import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { Link } from "react-router-dom";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  console.log("user", user);
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      console.log("Calling getEnroll cor API connector");
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);

      console.log("response inside myCourse...", response);
    } catch (error) {
      console.log("Unable to fetch Enrolled Courses:", error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  // console.log("enro: ",enrolledCourses);
  return (
    <div>
      <h1>Enrolled Courses</h1>

      {!enrolledCourses ? (
        <div>Loading....</div>
      ) : enrolledCourses.length === 0 ? (
        <p>You have not enrolled in any course</p>
      ) : (
        <div>
          <div>
            <p>Course Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>

          <div>
            {enrolledCourses.length === 0 ? (
              <p>Not enrolled in any course yet</p>
            ) : (
              enrolledCourses.map((course, index) => (
                <Link
                  to={`/courseMenu/${course?._id}/section/${course.courseContent?.[0]?._id}/subSection/${course.courseContent?.[0]?.subSections?.[0]?._id}`}
                >
                  <div
                    key={index}
                    className="bg-slate-300 m-5 flex gap-x-5 p-2"
                  >
                    <div>
                      <img
                        src={course.thumbnail}
                        alt="course-thumbnail"
                        className="h-[100px] w-[150px] bg-pink-300"
                      />
                    </div>
                    <div>
                      <p>Name: {course.courseName}</p>
                      <p>Desc: {course.courseDescription}</p>
                    </div>
                    <div>Duration: {course?.totalDuration}</div>
                    <div>
                      <p>Progress: {course.progressPercentage || 0}</p>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        maxCompleted={100}
                        height="8px"
                        width="60px"
                        isLabelVisible={false}
                        className="bg-red-500 p-2"
                      />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
