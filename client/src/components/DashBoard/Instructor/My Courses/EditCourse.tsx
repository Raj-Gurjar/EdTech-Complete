import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import RenderFormSteps from "../Create Course/RenderFormSteps";
import {
  setCourse,
  setEditCourse,
  resetCourseState,
} from "../../../../toolkit/slice/courseSlice";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import HighlightText from "../../../../user interfaces/HighlightText";
import { FaSpinner, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";
import { RootState } from "../../../../toolkit/reducer";

export default function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { course } = useSelector((state: RootState) => state.course);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);

  const populateCourseDetails = async (): Promise<void> => {
    if (!courseId || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFullDetailsOfCourse(courseId, token);

      // Handle different response structures - API returns { data: { courseDetails, totalDuration } }
      const courseDetails = result?.courseDetails || result?.data?.courseDetails;

      if (courseDetails && courseDetails._id) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(courseDetails));
      } else {
        setError("Course not found or invalid course data");
        toast.error("Failed to load course details");
      }
    } catch (err) {
      console.error("Error loading course:", err);
      setError("Failed to load course. Please try again.");
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset course state when component mounts
    dispatch(resetCourseState());
    populateCourseDetails();

    // Cleanup on unmount
    return () => {
      dispatch(resetCourseState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (loading) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="text-purple6 text-5xl animate-spin mb-4" />
          <p className="text-white text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
        <div className="bg-black2 rounded-xl p-8 border border-black5 text-center">
          <FaExclamationTriangle className="text-red2 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {error || "Course Not Found"}
          </h2>
          <p className="text-white4 mb-6">
            {error || "The course you're trying to edit doesn't exist or you don't have permission to access it."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/myCourses-Instructor")}
              className="flex items-center gap-2 px-6 py-3 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
            >
              <FaArrowLeft />
              <span>Back to My Courses</span>
            </button>
            <button
              onClick={populateCourseDetails}
              className="px-6 py-3 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Edit <HighlightText text="Course" />
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Update your course information, content, and settings.
        </p>
      </div>

      {/* Form Steps */}
      <RenderFormSteps instructions={[]} />
    </div>
  );
}

