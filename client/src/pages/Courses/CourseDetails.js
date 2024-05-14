import React, { useEffect, useState } from "react";
import { getCourseDetails } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyCourse } from "../../services/operations/paymentApi";
import Modal from "../../components/Modals-Popups/Modal";
import avgRating from "../../utils/avgRating";
import RatingStars from "../../utils/RatingStars";
import { formateDate } from "../../utils/formatDate";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { addToCart } from "../../toolkit/slice/cartSlice";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { isAction } from "@reduxjs/toolkit";

export default function CourseDetails() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avgRatingCount, setAvgRatingCount] = useState(0);
  const [modal, setModal] = useState(null);
  const [openSection, setOpenSection] = useState(Array(0));

  const cart = localStorage.getItem("cart");
  const { paymentLoading } = useSelector((state) => state.course);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("cart", cart);
  console.log("user", user);

  const handelToggleSection = (id) => {
    setOpenSection(
      !openSection.includes(id)
        ? openSection.concat(id)
        : openSection.filter((e) => e !== id)
    );
  };

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
        <p>
          Instructor img :
          <img
            src={courseData?.instructor?.profileImage}
            alt="instructor Img"
            className="h-[50px] w-[50px] rounded"
          />
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
              // !cart.includes(courseData)
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
          <div className="flex bg-yellow-100 justify-between mx-5 ">
            <p>Total Lessons: {courseData?.courseContent?.length}</p>
            <p
              onClick={() => setOpenSection(Array(0))}
              className="bg-red-400 cursor-pointer"
            >
              Collapse All
            </p>
          </div>

          {courseData?.courseContent.map((section, index) => (
            <div key={index} onClick={() => handelToggleSection(section._id)}>
              <div className="bg-slate-300  m-5">
                <div className="flex justify-between bg-red-400">
                  <icon>
                    <IoIosArrowDown
                      className={`cursor-pointer bg-blue-400 ${
                        !openSection.includes(section._id)
                          ? "rotate-180 ease-in-out duration-300"
                          : "ease-in-out duration-300"
                      }`}
                    />
                  </icon>

                  <p>Section name : {section?.sectionName}</p>

                  <p className="bg-yellow-300">
                    <Link to={`/sections/${section?._id}`}>View Section</Link>
                  </p>
                </div>

                {openSection.includes(section._id) && (
                  <div>
                    <p>Section Short Details : {section?.shortDescription}</p>
                    <p>No of lectures : {section?.subSections.length}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
