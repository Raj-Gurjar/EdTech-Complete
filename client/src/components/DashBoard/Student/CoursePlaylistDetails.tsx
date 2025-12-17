import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaChevronDown, 
  FaChevronRight,
  FaStar,
  FaBook
} from "react-icons/fa";
import { MdCheckCircle, MdPlayArrow } from "react-icons/md";
import { RootState } from "../../../toolkit/reducer";

interface SubSection {
  _id: string;
  title?: string;
  timeDuration?: string;
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

interface CoursePlaylistDetailsProps {
  setReviewModal: (value: boolean) => void;
}

export default function CoursePlaylistDetails({ setReviewModal }: CoursePlaylistDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams<{ sectionId?: string; subSectionId?: string }>();

  const [activeStatus, setActiveStatus] = useState<string>("");
  const [videoActive, setVideoActive] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state: RootState) => state.viewCourse);

  useEffect(() => {
    setActiveFlags();
    // Expand the current section by default
    if (sectionId) {
      setExpandedSections(new Set([sectionId]));
    }
  }, [courseSectionData, courseEntireData, location.pathname, sectionId]);

  const setActiveFlags = (): void => {
    if (!courseSectionData?.length) {
      return;
    }
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndex === -1) return;
    
    const section = courseSectionData[currentSectionIndex] as CourseSectionData;
    const subSections = section?.subSections || section?.subSection || [];
    
    const currentSubSectionIndex = subSections.findIndex(
      (data: any) => data._id === subSectionId
    );

    const activeSubSectionId = subSections[currentSubSectionIndex]?._id;
    
    setActiveStatus(section?._id || "");
    setVideoActive(activeSubSectionId || "");
  };

  const toggleSection = (sectionId: string): void => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const progressPercentage = totalNoOfLectures > 0 
    ? Math.round((completedLectures?.length / totalNoOfLectures) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col bg-black4 min-h-full">
      {/* Header */}
      <div className="p-4 border-b border-black6 flex-shrink-0">
        <button
          onClick={() => navigate("/dashboard/enrolledCourses")}
          className="flex items-center gap-2 text-black7 hover:text-white transition-colors mb-4 group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Courses</span>
        </button>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {courseEntireData?.courseName || "Course"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-black7">
            <FaBook className="text-xs" />
            <span>{totalNoOfLectures} lectures</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-black7">Progress</span>
            <span className="text-xs font-semibold text-yellow8">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-black5 rounded-full h-2">
            <div
              className="bg-yellow8 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-black7 mt-1">
            {completedLectures?.length || 0} of {totalNoOfLectures} completed
          </p>
        </div>

        <button
          onClick={() => setReviewModal(true)}
          className="w-full bg-yellow8 hover:bg-yellow9 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
        >
          <FaStar />
          <span>Add Review</span>
        </button>
      </div>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-black7 mb-4 uppercase tracking-wide">
          Course Content
        </h3>
        
        <div className="space-y-2">
          {courseSectionData.map((section, index: number) => {
            const sectionData = section as CourseSectionData;
            const subSections = sectionData?.subSections || sectionData?.subSection || [];
            const isExpanded = expandedSections.has(sectionData._id);
            const isActive = activeStatus === sectionData._id;
            const completedCount = subSections.filter((sub: any) => 
              completedLectures.includes(sub._id)
            ).length || 0;
            const totalCount = subSections.length || 0;
            const sectionProgress = totalCount > 0 
              ? Math.round((completedCount / totalCount) * 100)
              : 0;

            return (
              <div
                key={sectionData._id || index}
                className="border border-black6 rounded-lg overflow-hidden"
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(sectionData._id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isActive ? "bg-yellow8 bg-opacity-20" : "bg-black5 hover:bg-black6"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isExpanded ? (
                        <FaChevronDown className="text-black7 text-xs flex-shrink-0" />
                      ) : (
                        <FaChevronRight className="text-black7 text-xs flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-white truncate">
                        {sectionData?.sectionName || `Section ${index + 1}`}
                      </span>
                    </div>
                    <span className="text-xs text-black7 ml-2 flex-shrink-0">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-black6 rounded-full h-1">
                    <div
                      className="bg-yellow8 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${sectionProgress}%` }}
                    />
                  </div>
                </div>

                {/* SubSections */}
                {isExpanded && (
                  <div className="bg-black4">
                    {subSections.map((lecture: any, lectureIndex: number) => {
                      const isCompleted = completedLectures.includes(lecture._id);
                      const isActiveLecture = videoActive === lecture._id;

                      return (
                        <div
                          key={lecture._id || lectureIndex}
                          onClick={() => {
                            navigate(
                              `/courseMenu/${courseEntireData?._id}/section/${sectionData?._id}/subSection/${lecture?._id}`
                            );
                            setVideoActive(lecture._id);
                          }}
                          className={`p-3 cursor-pointer transition-all duration-200 border-l-4 ${
                            isActiveLecture
                              ? "bg-yellow8 bg-opacity-20 border-yellow8"
                              : "bg-transparent border-transparent hover:bg-black5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {isCompleted ? (
                                <MdCheckCircle className="text-caribbeanGreen5 text-lg" />
                              ) : (
                                <MdPlayArrow className="text-black7 text-lg" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  isActiveLecture
                                    ? "text-yellow8 font-semibold"
                                    : isCompleted
                                    ? "text-white"
                                    : "text-black7"
                                } line-clamp-2`}
                              >
                                {lecture?.title || `Lecture ${lectureIndex + 1}`}
                              </p>
                              {lecture?.timeDuration && (
                                <p className="text-xs text-black7 mt-1">
                                  {lecture.timeDuration}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

