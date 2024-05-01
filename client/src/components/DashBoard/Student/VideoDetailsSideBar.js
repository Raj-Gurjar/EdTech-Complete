import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  courseEntireData,
  courseSectionData,
  setCourseSectionData,
} from "../../../toolkit/slice/viewCourseSlice";

export default function VideoDetailsSideBar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoActive, setVideoActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  // const {
  //   courseSectionData,
  //   courseEntireData,
  //   totalNoOfLectures,
  //   compeltedLectures,
  // } = useSelector((state) => state.viewCourseSlice);

  const setActiveFlags = () => {
    if (!courseSectionData?.length) {
      return;
    }
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId);

    const activeSubSectionId =
      courseSectionData[currentSectionIndex]?.subSection?.[
        currentSubSectionIndex
      ]?._id;
    //set current section
    setActiveStatus(setCourseSectionData?.[currentSectionIndex]?._id);
    //set current subSec
    setVideoActive(activeSubSectionId);
  };
  useEffect(() => {
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <div>
      <div className="flex justify-between my-3 mx-1">
        <button onClick={() => navigate("/dashboard/enrolledCourses")}>
          Back
        </button>
        <button onClick={() => setReviewModal(true)}>Add Review</button>
      </div>
      <p>My Course</p>
      <p>1/12</p>

      <div>Lectures</div>
    </div>
  );
}
