import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../../toolkit/slice/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { 
  FaCheckCircle, 
  FaArrowLeft, 
  FaArrowRight,
  FaRedo,
  FaSpinner,
  FaClock
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import toast from "react-hot-toast";

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
          currentSubSectionIndex + 1
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
    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSections[
          currentSubSectionIndex - 1
        ]._id;

      navigate(
        `/courseMenu/${courseId}/section/${sectionId}/subSection/${prevSubSectionId}`
      );
    }
    //next section prev video
    else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;

      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSections.length;

      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSections[
          prevSubSectionLength - 1
        ]._id;

      navigate(
        `/courseMenu/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);

    const res = await markLectureAsComplete({ courseId, subSectionId }, token);

    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
      toast.success("Lecture marked as completed!");
    } else {
      toast.error("Failed to mark lecture as completed");
    }
    setLoading(false);
  };

  const handleRewatch = () => {
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

  if (!videoData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="text-6xl text-yellow8 animate-spin mx-auto mb-4" />
          <p className="text-black7 text-lg">Loading lecture...</p>
        </div>
      </div>
    );
  }

  const isCompleted = completedLectures.includes(subSectionId);

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="bg-black4 rounded-xl shadow-lg overflow-hidden border border-black6 relative">
        <div className="relative w-full bg-black">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          />
        </div>

        {/* Video Ended Overlay */}
        {videoEnded && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 rounded-xl">
            <div className="bg-black4 rounded-xl p-8 max-w-md mx-4 border border-yellow8">
              <div className="text-center mb-6">
                <MdCheckCircle className="text-6xl text-yellow8 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Video Completed!</h3>
                <p className="text-black7">Great job watching this lecture</p>
              </div>

              <div className="space-y-3">
                {!isCompleted && (
                  <button
                    onClick={handleLectureCompletion}
                    disabled={loading}
                    className="w-full bg-yellow8 hover:bg-yellow9 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Marking...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleRewatch}
                  className="w-full bg-black5 hover:bg-black6 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRedo />
                  <span>Watch Again</span>
                </button>

                <div className="flex gap-3 pt-2">
                  {!isFirstVideo() && (
                    <button
                      onClick={goToPreviousVideo}
                      className="flex-1 bg-black5 hover:bg-black6 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaArrowLeft />
                      <span>Previous</span>
                    </button>
                  )}

                  {!isLastVideo() && (
                    <button
                      onClick={goToNextVideo}
                      className="flex-1 bg-yellow8 hover:bg-yellow9 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>Next</span>
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lecture Details Section */}
      <div className="bg-black4 rounded-xl shadow-lg p-6 border border-black6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {isCompleted && (
                <div className="bg-caribbeanGreen6 bg-opacity-20 p-2 rounded-lg">
                  <MdCheckCircle className="text-caribbeanGreen5 text-xl" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-white">
                {videoData?.title || "Lecture"}
              </h2>
            </div>
            
            {videoData?.timeDuration && (
              <div className="flex items-center gap-2 text-black7 mb-4">
                <FaClock className="text-sm" />
                <span className="text-sm">Duration: {videoData.timeDuration}</span>
              </div>
            )}
          </div>
        </div>

        {videoData?.description && (
          <div className="pt-4 border-t border-black6">
            <h3 className="text-lg font-semibold text-white mb-3">About this lecture</h3>
            <p className="text-black7 leading-relaxed">{videoData.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
