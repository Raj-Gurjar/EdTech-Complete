import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to fetch Enrolled Courses:", error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

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
            {enrolledCourses.map((course, index) => (
              <div key={index}>
                <div>
                  <img src={course.thumbnail} alt="course-thumbnail" />
                </div>
                <div>
                  <p>{course.courseName}</p>
                  <p>{course.courseDescription}</p>
                </div>
                <div>{course?.totalDuration}</div>
                <div>
                  <p>Progress: {course.progressPercentage || 0}</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    maxCompleted={100}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
