import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

export default function InstDashBoard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  // console.log("tt", token);

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  const getInstructorDashData = async () => {
    console.log("ins api");
    setLoading(true);

    const response = await getInstructorData(token);
    console.log("resp", response);

    if (response?.length) {
      setInstructorData(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInstructorDashData();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudentsEnrolled = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  console.log("tt", totalAmount, " ", totalStudentsEnrolled);

  return (
    <div>
      <div>
        <h2>Hii {user?.firstName}</h2>
        <p>Let's Start Something New</p>
      </div>
      <div>
        {user?.courses?.length > 0 ? (
          <div>
            <div className="bg-red-300 m-5">
              <InstructorChart
                courses={instructorData}
                totalStudents={totalStudentsEnrolled}
              />
            </div>
            <div className="bg-green-200 m-5">
              <h1>Statistics</h1>
              <p>No. of Courses {user?.courses.length}</p>
              <p>No. of Students Enrolled : {totalStudentsEnrolled}</p>
              <p>Total Income : Rs.{totalAmount} </p>
            </div>
            <div>
              <Link to="/dashboard/myCourses-Instructor">
                <h2 className="bg-yellow-400">See your all Courses </h2>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1>You have not created anything</h1>
          </div>
        )}
      </div>
    </div>
  );
}
