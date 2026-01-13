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
import { RootState } from "../../../../toolkit/reducer";

interface SubSection {
  _id: string;
  title?: string;
  timeDuration?: string;
  videoUrl?: string;
  description?: string;
  [key: string]: any;
}

// Use a flexible type that matches the Redux state structure
// The slice uses 'subSection' but actual data uses 'subSections'
type CourseSectionData = {
  _id: string;
  sectionName?: string;
  subSection?: any[];
  subSections?: SubSection[];
  [key: string]: any;
};

interface VideoData extends SubSection {
  videoUrl: string;
}

// Player ref type - video-react doesn't have TypeScript types
interface PlayerRef {
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  [key: string]: any;
}

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams<{ 
    courseId: string; 
    sectionId: string; 
    subSectionId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  //!---- playerRef has all functions of a video player
  const playerRef = useRef<PlayerRef | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state: RootState) => state.viewCourse);

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isFirstVideo = (): boolean => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    
    if (currentSectionIndex === -1) return false;
    
    const section = courseSectionData[currentSectionIndex] as CourseSectionData;
    const subSections = section?.subSections || section?.subSection || [];
    const currentSubSectionIndex = subSections.findIndex(
      (data: any) => data._id === subSectionId
    ) ?? -1;

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = (): boolean => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    
    if (currentSectionIndex === -1) return false;
    
    const section = courseSectionData[currentSectionIndex] as CourseSectionData;
    const subSections = section?.subSections || section?.subSection || [];
    const noOfSubSections = subSections.length || 0;

    const currentSubSectionIndex = subSections.findIndex(
      (data: any) => data._id === subSectionId
    ) ?? -1;

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const goToNextVideo = (): void => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    
    if (currentSectionIndex === -1) return;

    const section = courseSectionData[currentSectionIndex] as CourseSectionData;
    const subSections = section?.subSections || section?.subSection || [];
    const noOfSubSections = subSections.length || 0;

    const currentSubSectionIndex = subSections.findIndex(
      (data: any) => data._id === subSectionId
    ) ?? -1;

    //same section next video e.g(lec 1.1 to 1.2)
    if (currentSubSectionIndex !== noOfSubSections - 1 && currentSubSectionIndex !== -1) {
      const nextSubSectionId = subSections[currentSubSectionIndex + 1]?._id;

      if (nextSubSectionId) {
        navigate(
          `/courseMenu/${courseId}/section/${sectionId}/subSection/${nextSubSectionId}`
        );
      }
    }
    //next section 1st video e.g (lec 1.9(last) to 2.1(first))
    else {
      if (currentSectionIndex < courseSectionData.length - 1) {
        const nextSection = courseSectionData[currentSectionIndex + 1] as CourseSectionData;
        const nextSectionSubSections = nextSection?.subSections || nextSection?.subSection || [];
        const nextSectionId = nextSection?._id;
        const nextSubSectionId = nextSectionSubSections[0]?._id;

        if (nextSectionId && nextSubSectionId) {
          navigate(
            `/courseMenu/${courseId}/section/${nextSectionId}/subSection/${nextSubSectionId}`
          );
        }
      }
    }
  };

  const goToPreviousVideo = (): void => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    
    if (currentSectionIndex === -1) return;

    const section = courseSectionData[currentSectionIndex] as CourseSectionData;
    const subSections = section?.subSections || section?.subSection || [];
    const currentSubSectionIndex = subSections.findIndex(
      (data: any) => data._id === subSectionId
    ) ?? -1;

    //same sec prev video
    if (currentSubSectionIndex > 0) {
      const prevSubSectionId = subSections[currentSubSectionIndex - 1]?._id;

      if (prevSubSectionId) {
        navigate(
          `/courseMenu/${courseId}/section/${sectionId}/subSection/${prevSubSectionId}`
        );
      }
    }
    //next section prev video
    else {
      if (currentSectionIndex > 0) {
        const prevSection = courseSectionData[currentSectionIndex - 1] as CourseSectionData;
        const prevSectionSubSections = prevSection?.subSections || prevSection?.subSection || [];
        const prevSectionId = prevSection?._id;
        const prevSubSectionLength = prevSectionSubSections.length || 0;
        const prevSubSectionId = prevSectionSubSections[prevSubSectionLength - 1]?._id;

        if (prevSectionId && prevSubSectionId) {
          navigate(
            `/courseMenu/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`
          );
        }
      }
    }
  };

  const handleLectureCompletion = async (): Promise<void> => {
    if (!courseId || !subSectionId || !token) return;
    
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

  const handleRewatch = (): void => {
    if (playerRef?.current) {
      playerRef.current.seek(0);
      playerRef.current.play();
      setVideoEnded(false);
    }
  };

  useEffect(() => {
    const setVideoSpecificDetails = async (): Promise<void> => {
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

        const section = filteredData?.[0] as CourseSectionData | undefined;
        const subSections = section?.subSections || section?.subSection || [];
        const filteredVideoData = subSections.filter(
          (data: any) => data._id === subSectionId
        );

        // console.log("filerVidD", filteredVideoData);

        if (filteredVideoData?.[0]) {
          setVideoData(filteredVideoData[0] as VideoData);
          setVideoEnded(false);
        }
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate]);

  if (!videoData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="text-6xl text-purple6 animate-spin mx-auto mb-4" />
          <p className="text-black7 text-lg">Loading lecture...</p>
        </div>
      </div>
    );
  }

  const isCompleted = completedLectures.includes(subSectionId || "");

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="bg-black4 rounded-xl shadow-lg overflow-hidden border border-black6 relative">
        <div className="relative w-full bg-black">
          <Player
            ref={playerRef as any}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          />
        </div>

        {/* Video Ended Overlay */}
        {videoEnded && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 rounded-xl">
            <div className="bg-black4 rounded-xl p-8 max-w-md mx-4 border border-purple6">
              <div className="text-center mb-6">
                <MdCheckCircle className="text-6xl text-purple6 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Video Completed!</h3>
                <p className="text-black7">Great job watching this lecture</p>
              </div>

              <div className="space-y-3">
                {!isCompleted && (
                  <button
                    onClick={handleLectureCompletion}
                    disabled={loading}
                    className="w-full bg-purple6 hover:bg-purple5 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      className="flex-1 bg-purple6 hover:bg-purple5 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
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

