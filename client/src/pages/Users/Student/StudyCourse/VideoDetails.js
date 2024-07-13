import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../../toolkit/slice/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { FaCirclePlay } from "react-icons/fa6";

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

   //!---- playerRef has all functions of a video player
  const playerRef = useRef();
  
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  // console.log("courseSecDat", courseSectionData);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSections.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSections.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSections.findIndex((data) => data._id === subSectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSections.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSections.findIndex((data) => data._id === subSectionId);

    //same section next video e.g(lec 1.1 to 1.2)
    if (currentSubSectionIndex !== noOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSections[
          currentSectionIndex + 1
        ]._id;

      navigate(
        `/courseMenu/${courseId}/section/${sectionId}/subSection/${nextSubSectionId}`
      );
    }
    //next section 1st video e.g (lec 1.9(last) to 2.1(first))
    else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSections[0]._id;

      navigate(
        `/courseMenu/${courseId}/section/${nextSectionId}/subSection/${nextSubSectionId}`
      );
    }
  };

  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSections.findIndex((data) => data._id === subSectionId);

    //same sec prev video
    // console.log("curre sec ind", currentSectionIndex);
    // console.log("curre subSec ind", currentSubSectionIndex);

    if (currentSubSectionIndex !== 0) {
      console.log("inside sec prev");
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSections[
          currentSectionIndex - 1
        ]._id;
      // console.log("prevSecId", prevSubSectionId);

      navigate(
        `/courseMenu/${courseId}/section/${sectionId}/subSection/${prevSubSectionId}`
      );
    }
    //next section prev video
    else {
      console.log("inside other sec  prev");
      // console.log("curre sub ind", currentSectionIndex);
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;

      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSections.length;

      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSections[
          prevSubSectionLength - 1
        ]._id;

      // console.log("2prevSecId", prevSubSectionId);

      navigate(
        `/courseMenu/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    //! Add controller for it
    setLoading(true);

    const res = await markLectureAsComplete({ courseId, subSectionId }, token);

    //update state

    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  const handleRewatch = () => {
    //!---- playerRef has all functions of a video player
    if (playerRef?.current) {
      playerRef?.current?.seek(0);
      playerRef?.current?.play();

      setVideoEnded(false);
    }
  };

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) {
        return;
      }
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolledCourses");
      } else {
        //let's assume all 3 fields are present
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );

        // console.log("filerD", filteredData);

        const filteredVideoData = filteredData?.[0].subSections.filter(
          (data) => data._id === subSectionId
        );

        // console.log("filerVidD", filteredVideoData);

        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <div className="bg-red-300">
      <div className="bg-green-300">
        {!videoData ? (
          <div>No Data Found</div>
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <div>
              <FaCirclePlay />
            </div>

            {videoEnded && (
              <div>
                {!completedLectures.includes(subSectionId) && (
                  <button onClick={() => handleLectureCompletion()}>
                    Mark as Completed
                  </button>
                )}

                <button onClick={handleRewatch}>ReWatch</button>

                <div>
                  {!isFirstVideo() && (
                    <button onClick={goToPreviousVideo}>Prev</button>
                  )}

                  {!isLastVideo() && (
                    <button onClick={goToNextVideo}>Next</button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}
      </div>
      <div>
        <p>Lecture Name:{videoData?.title}</p>
        <p>Lect description :{videoData?.description}</p>
      </div>
    </div>
  );
}
