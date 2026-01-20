import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetCourseState,
  setStep,
} from "../../../../../toolkit/slice/courseSlice";
import {
  deleteCourse,
} from "../../../../../services/operations/courseDetailsAPI";
import Modal from "../../../../Modals-Popups/Modal";
import { RootState } from "../../../../../toolkit/reducer";

interface ModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

export default function CourseDraft() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);

  const [modal, setModal] = useState<ModalData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteCourse = async (courseId: string): Promise<void> => {
    if (!token) return;
    
    setLoading(true);

    await deleteCourse({ courseId: courseId }, token);

    dispatch(setStep(1));
    dispatch(resetCourseState());
    // navigate("/dashboard/createCourse");

    setModal(null);
    setLoading(false);
  };

  const goBack = (): void => {
    dispatch(setStep(2));
  };

  const goToCourses = (): void => {
    dispatch(resetCourseState());
    navigate("/dashboard/myCourses-Instructor");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Finalize Your Course</h2>
        <p className="text-white4 text-sm">
          Save your course as draft. Once admin verifies it, it will be published and visible to all students.
        </p>
      </div>

      {/* Draft Course Form */}
      <div className="bg-black3 rounded-xl p-6 border border-black5">
        <form onSubmit={(e) => { e.preventDefault(); goToCourses(); }} className="space-y-6">
          <div className="bg-black2 rounded-lg p-4 border border-black5">
            <p className="text-white3 text-sm leading-relaxed">
              Your course will be saved as a draft. After admin verification, it will be published and made available to all students on the platform.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-black2 rounded-lg border border-black5">
            <input
              type="checkbox"
              id="draft"
              required
              className="mt-1 w-5 h-5 accent-purple6 cursor-pointer"
            />
            <label htmlFor="draft" className="flex-1 text-white cursor-pointer">
              <span className="font-medium block mb-1">
                I confirm that I want to save this course as draft
              </span>
              <span className="text-white4 text-sm">
                By checking this box, you acknowledge that your course will be reviewed by admin before publication.
              </span>
            </label>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full px-6 py-3 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Save Course as Draft"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-black5"></div>
        <span className="text-white4 text-sm font-medium">OR</span>
        <div className="flex-1 h-px bg-black5"></div>
      </div>

      {/* Alternative Actions */}
      <div className="bg-black3 rounded-xl p-6 border border-black5">
        <h3 className="text-lg font-semibold text-white mb-4">Other Options</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex-1 px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
          >
            ← Go Back & Edit
          </button>

          <button
            disabled={loading}
            onClick={() => {
              if (!course) return;
              setModal({
                text1: "Are You Sure?",
                text2: "This course will be deleted permanently and cannot be recovered.",
                btn1Text: "Delete Course",
                btn2Text: "Cancel",
                btn1Handler: () => handleDeleteCourse(course._id),
                btn2Handler: () => setModal(null),
              });
            }}
            className="flex-1 px-6 py-2.5 bg-red2 hover:bg-red1 text-white rounded-lg transition-colors font-medium"
          >
            Discard Course
          </button>
        </div>
      </div>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}

