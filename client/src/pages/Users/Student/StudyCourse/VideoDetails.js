import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSectionId.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = () => {};

  const goToNextVideo = () => {};

  const goToPreviousVideo = () => {};

  const handleLectureCompletion = () => {};

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) {
        return;
      }
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolledCourses");
      } else {
        //let's assume all 3 fields are present
        const filterData = courseSectionData.filter(
          (course) => course._id === sectionId
        );

        const filteredVideoData = filterData?.[0].subSection.filter(
          (data) => data._id === subSectionId
        );

        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <div>
      <h1>hii</h1>
    </div>
  );
}
