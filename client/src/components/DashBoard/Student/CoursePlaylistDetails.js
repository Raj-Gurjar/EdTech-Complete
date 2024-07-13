import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  courseEntireData,
  courseSectionData,
  setCourseSectionData,
} from "../../../toolkit/slice/viewCourseSlice";

export default function VideoDetailsSideBar({ setReviewModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  const [activeStatus, setActiveStatus] = useState("f");
  const [videoActive, setVideoActive] = useState("");

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  // console.log("courseSectionData", courseSectionData);
  // console.log("courseEntireData", courseEntireData);

  useEffect(() => {
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // console.log("active s", activeStatus);
  const setActiveFlags = () => {
    if (!courseSectionData?.length) {
      return;
    }
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSections.findIndex((data) => data._id === subSectionId);

    const activeSubSectionId =
      courseSectionData[currentSectionIndex]?.subSections?.[
        currentSubSectionIndex
      ]?._id;
    //set current section
    setActiveStatus(setCourseSectionData?.[currentSectionIndex]?._id);
    //set current subSec
    setVideoActive(activeSubSectionId);
  };

  return (
    <div>
      <div className="flex justify-between my-3 mx-1">
        <button onClick={() => navigate("/dashboard/enrolledCourses")}>
          Back
        </button>
        <button onClick={() => setReviewModal(true)}>Add Review</button>
      </div>

      <div>
        <p>Course Name:{courseEntireData?.courseName}</p>
        <p>
          {completedLectures?.length}/{totalNoOfLectures}
        </p>
      </div>

      <div>
        <h1>Lectures</h1>
        {courseSectionData.map((section, index) => (
          <div onClick={() => setActiveStatus(section?._id)} key={index}>
            {/* section */}
            <div className="flex">
              <p>{section?.sectionName}</p>
              <button onClick={() => {}}>V</button>
            </div>

            {/* subsections */}
            <div>
              {activeStatus === section?._id && (
                <div>
                  {section?.subSections.map((lecture, index) => (
                    <div
                      className={`flex gap-3 p-4 ${
                        videoActive === lecture?._id
                          ? "bg-yellow-200 text-black"
                          : "bg-red-400 text-white"
                      }`}
                      key={index}
                      onClick={() => {
                        navigate(
                          `/courseMenu/${courseEntireData?._id}/section/${section?._id}/subSection/${lecture?._id}`
                        );
                        setVideoActive(lecture?._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(lecture?._id)}
                        onChange={() => {}}
                      />
                      <span>{lecture?.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
