import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import CoursesTable from "./CoursesTable";

export default function ShowCourse() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const [instCourses, setInstCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    const result = await fetchInstructorCourses(token);
    if (result) {
      setInstCourses(result);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  console.log("instCourse: ", instCourses);
  return (
    <div>
      <h1>My Courses Inst</h1>

      <div>
        <button onClick={() => navigate("/dashboard/createCourse")}>
          Add Course
        </button>
      </div>

      <div>
        {instCourses && (
          <CoursesTable
            instCourses={instCourses}
            setInstCourses={setInstCourses}
          />
        )}
      </div>
    </div>
  );
}
