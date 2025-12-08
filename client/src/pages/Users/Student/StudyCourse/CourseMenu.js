import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CoursePlaylistDetails from "../../../../components/DashBoard/Student/CoursePlaylistDetails";
import {
  setCompletedLecture,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../../../../toolkit/slice/viewCourseSlice";
import {
  getFullDetailsOfCourse,
  getCourseDetails,
} from "../../../../services/operations/courseDetailsAPI";
import CourseReviewModal from "../../../../components/Modals-Popups/CourseReviewModal";

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
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-black3">
      {/* Sidebar */}
      <div className="hidden lg:flex min-w-[350px] max-w-[400px] flex-col border-r border-black6 fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-black4 overflow-y-auto z-10">
        <CoursePlaylistDetails setReviewModal={setReviewModal} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[350px] min-h-[calc(100vh-3.5rem)] overflow-auto">
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
}
