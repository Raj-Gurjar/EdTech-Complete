import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import VideoDetailsSideBar from "../../components/DashBoard/Student/VideoDetailsSideBar";
import CourseReviewModal from "../../components/Modals-Popups/CourseReviewModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseDetails,
  getFullDetailsOfCourse,
} from "../../services/operations/courseDetailsAPI";
import {
  setCompletedLecture,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../../toolkit/slice/viewCourseSlice";

export default function CourseMenu() {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const setCourseDetails = async () => {
    const courseData = await getFullDetailsOfCourse(courseId, token);
    console.log("course Data", courseData);

    dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
    dispatch(setEntireCourseData(courseData.courseDetails));
    dispatch(setCompletedLecture(courseData.completedVideos));

    let lectures = 0;
    courseData?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSections.length;
    });
    dispatch(setTotalNoOfLectures(lectures));
  };
  useEffect(() => {
    setCourseDetails();
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <div className=" bg-green-300 flex min-w-[150px] flex-col border-r-[1px] border-black-700 h-[calc(100vh-3.5rem)] bg-black-400 py-5">
        <h1>Course Menu</h1>
        <VideoDetailsSideBar setReviewModal={setReviewModal} />
      </div>
      <div className="h-[calc(100vh - 3.5rem)] overflow-auto bg-blue-200 mx-auto w-11/12 p-5 max-w-[1000px]">
        <Outlet />
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
}
