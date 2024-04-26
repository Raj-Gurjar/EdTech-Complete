import React, { useEffect, useState } from "react";
import { getCourseDetails } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyCourse } from "../../services/operations/paymentApi";
import Modal from "../../components/Modal";
import avgRating from "../../utils/avgRating";
import RatingStars from "../../components/RatingStars";
import { formateDate } from "../../utils/formatDate";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { addToCart } from "../../toolkit/slice/cartSlice";

export default function CourseDetails() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avgRatingCount, setAvgRatingCount] = useState(0);
  const [modal, setModal] = useState(null);

  const { paymentLoading } = useSelector((state) => state.course);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("user", user);
  useEffect(() => {
    const count = avgRating(courseData?.ratingAndReviews);
    setAvgRatingCount(count);
  }, [courseData]);

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

  console.log("courseData :", courseData);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setModal({
      text1: "You are not Logged in",
      text2: "Please Login to buy a course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setModal(null),
    });
  };
  const handleAddToCart = () => {
    if (
      user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ||
      user?.accountType === ACCOUNT_TYPE.ADMIN
    ) {
      toast.error("Only a Student Account can buy a course");
    }

    if (token) {
      console.log("Add to cart...");
      dispatch(addToCart(courseData));
      return;
    }
    setModal({
      text1: "You are not Logged in",
      text2: "Please Login to add the course in your cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied");
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
        <p>
          Rating Stars:{" "}
          <RatingStars Review_Count={avgRatingCount} Star_Size={24} />{" "}
        </p>
        <p>Avg Rating : {avgRatingCount}</p>
        <p>Student Enrolled : {courseData?.studentsEnrolled?.length} </p>
        <p>Course Desc : {courseData?.courseDescription}</p>
        <p>Created at : {formateDate(courseData?.createdAt)} </p>
        <p>Last Updated at : {formateDate(courseData?.updatedAt)} </p>
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
            {user && courseData?.studentsEnrolled?.includes(user?._id) ? (
              <button onClick={() => navigate("/dashboard/enrolledCourses")}>
                {" "}
                Go To Course{" "}
              </button>
            ) : (
              <button onClick={() => handleBuyCourse()}> Buy Now </button>
            )}

            {user && !courseData?.studentsEnrolled?.includes(user?._id) && (
              <button onClick={() => handleAddToCart()}>Add to Cart</button>
            )}
          </div>
        </div>

        <button onClick={handleShare}>Copy Link and Share Course</button>
      </div>

      <div className="bg-green-300 m-5">
        <div>
          <h1 className="text-2xl">Course Content</h1>

          <div>
            <p>Instructions</p>

            <div>
              {courseData?.instructions.map((item, index) => (
                <div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
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

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
