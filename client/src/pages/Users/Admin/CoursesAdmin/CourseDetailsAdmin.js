import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";
import {
  getCourseDetailsAdmin,
  publishCourseAdmin,
} from "../../../../services/operations/courseDetailsAPI";
import Modal from "../../../../components/Modals-Popups/Modal";
import avgRating from "../../../../utils/avgRating";
import { formateDate } from "../../../../utils/formatDate";
import RatingStars from "../../../../utils/RatingStars";
import { COURSE_STATUS } from "../../../../utils/constants";

export default function CourseDetailsAdmin() {
  const [courseData, setCourseData] = useState(null);
  const [courseDuration, setCourseDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avgRatingCount, setAvgRatingCount] = useState(0);
  const [modal, setModal] = useState(null);
  const [openSection, setOpenSection] = useState(Array(0));

  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const count = avgRating(courseData?.ratingAndReviews);
    setAvgRatingCount(count);
  }, [courseData]);

  const showCourse = async () => {
    setLoading(true);
    try {
      const response = await getCourseDetailsAdmin({ courseId }, token);
      const course = response?.data?.courseDetails;
      const courseDur = response?.data?.totalDuration;

      if (course) {
        setCourseData(course);
      }
      if (courseDur) {
        setCourseDuration(courseDur);
      }
    } catch (error) {
      console.error("Error fetching course details: ", error);
      toast.error("Failed to fetch course details.");
    }
    setLoading(false);
  };

  const publishCourseHandler = async () => {
    setLoading(true);
    try {
      await publishCourseAdmin(courseId, token);
      // Update courseData state to reflect the published status
      setCourseData((prevData) => ({
        ...prevData,
        status: COURSE_STATUS.PUBLISHED,
      }));
      toast.success("Course published successfully.");
    } catch (error) {
      console.error("Error publishing course: ", error);
      toast.error("Failed to publish the course.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) {
      showCourse();
    }
  }, [courseId]);

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied");
  };

  const handelToggleSection = (id) => {
    setOpenSection(
      !openSection.includes(id)
        ? openSection.concat(id)
        : openSection.filter((e) => e !== id)
    );
  };

  return (
    <div>
      <p>
        Route data: <Link to="/">Home </Link>/
        <Link to="/allCourses">AllCourses</Link>/{courseData?.courseName}
      </p>
      <h1 className="text-3xl">Course Details of: {courseData?.courseName}</h1>

      <div className="bg-red-300 m-5">
        <p>CourseName: {courseData?.courseName}</p>
        <p>Category: {courseData?.category?.name}</p>
        <p>
          Instructor: {courseData?.instructor?.firstName}{" "}
          {courseData?.instructor?.lastName}
        </p>
        <p>
          Instructor img:
          <img
            src={courseData?.instructor?.profileImage}
            alt="instructor Img"
            className="h-[50px] w-[50px] rounded"
          />
        </p>

        <p>Rating No: {courseData?.ratingAndReviews?.length}</p>
        <p>
          Rating Stars:
          <RatingStars Review_Count={avgRatingCount} Star_Size={24} />
        </p>
        <p>Total Duration: {courseDuration} </p>
        <p>Avg Rating: {avgRatingCount}</p>
        <p>Student Enrolled: {courseData?.studentsEnrolled?.length} </p>
        <p>Course Desc: {courseData?.courseDescription}</p>
        <p>Created at: {formateDate(courseData?.createdAt)} </p>
        <p>Last Updated at: {formateDate(courseData?.updatedAt)} </p>
        <p>Language: {courseData?.language}</p>

        <div className="bg-gray-200 m-5 p-5">
          <p className="">Status: {courseData?.status}</p>
          {courseData?.status === COURSE_STATUS.DRAFT && (
            <div>
              <p>Change the Status to Publish</p>
              <button onClick={publishCourseHandler}>Publish it</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-green-300 m-5">
        <div>
          <h1 className="text-2xl">What You'll learn</h1>
          <p>{courseData?.whatYouWillLearn}</p>
        </div>
      </div>

      <div className="bg-pink-300 m-5">
        <div>
          <h1 className="text-2xl">Course Thumbnail</h1>
          <img
            src={courseData?.thumbnail}
            alt="course-thumbnail"
            className="w-[300px] h-[200px] bg-blue-300 m-3"
          />
          <p>Price: {courseData?.price}</p>
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
                <div key={index}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p>Tags</p>

            <div>
              {courseData?.tags.map((item, index) => (
                <div key={index}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex bg-yellow-100 justify-between mx-5">
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
              <div className="bg-slate-300 m-5">
                <div className="flex justify-between bg-red-400">
                  <IoIosArrowDown
                    className={`cursor-pointer bg-blue-400 ${
                      !openSection.includes(section._id)
                        ? "rotate-180 ease-in-out duration-300"
                        : "ease-in-out duration-300"
                    }`}
                  />
                  <p>Section name: {section?.sectionName}</p>
                  <p className="bg-yellow-300">
                    <Link to={`/sections/${section?._id}`}>View Section</Link>
                  </p>
                </div>

                {openSection.includes(section._id) && (
                  <div>
                    <p>Section Short Details: {section?.shortDescription}</p>
                    <p>No of lectures: {section?.subSections.length}</p>
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
