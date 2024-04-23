import React, { useEffect, useState } from "react";
import { getCourseDetails } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyCourse } from "../../services/operations/paymentApi";

export default function CourseDetails() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showCourse = async () => {
    setLoading(true);
    const course = await getCourseDetails(courseId);

    if (course) {
      setCourseData(course?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) {
      showCourse();
    }
  }, []);

  // console.log("courseData :", courseData);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
  };

  return (
    <div>
      <p>
        Route data :<Link to="/">Home </Link>/
        <Link to="/allCourses">AllCourses</Link>/{courseData?.courseName}{" "}
      </p>
      <h1 className="text-3xl">Course Details of: {courseData?.courseName}</h1>

      <div className="bg-red-300 m-5">
        <p>CourseName : {courseData?.courseName}</p>
        <p>Category: {courseData?.category?.name}</p>
        <p>
          Instructor: {courseData?.instructor?.firstName}{" "}
          {courseData?.instructor?.lastName}
        </p>

        <p>Rating No: {courseData?.ratingAndReviews?.length}</p>
        <p>Rating Stars: </p>
        <p>Avg Rating : </p>
        <p>Student Enrolled : {courseData?.studentsEnrolled?.length} </p>
        <p>Course Desc : {courseData?.courseDescription}</p>
        <p>Created at :{courseData?.createdAt} </p>
        <p>Language: {courseData?.language}</p>
      </div>

      <div className="bg-green-300 m-5">
        <div>
          <h1 className="text-2xl">What You'll learn</h1>
          <p>{courseData?.whatYouWillLearn}</p>
        </div>
      </div>

      <div className="bg-pink-300 m-5">
        <div>
          <h1 className="text-2xl">What You'll learn</h1>
          <img
            src={courseData?.thumbnail}
            alt="course-thumbnail"
            className="w-[300px] h-[200px] bg-blue-300 m-3"
          />
          <p>Price: {courseData?.price}</p>
          <div className="flex gap-x-4 my-5">
            <button onClick={() => handleBuyCourse()}>Buy Now</button>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="bg-green-300 m-5">
        <div>
          <h1 className="text-2xl">Course Content</h1>

          <div className="flex">
            <p>Total Lessons: {courseData?.courseContent?.length}</p>
          </div>

          {courseData?.courseContent.map((section, index) => (
            <div key={index}>
              <Link to={`/sections/${section?._id}`}>
                <div className="bg-slate-300 my-2">
                  <p>Section name : {section?.sectionName}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
