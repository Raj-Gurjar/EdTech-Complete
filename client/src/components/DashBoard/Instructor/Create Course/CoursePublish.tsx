import React, { useEffect, useState } from "react";
import { resetCourseState, setStep } from "../../../../toolkit/slice/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { COURSE_STATUS } from "../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { editCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import { RootState } from "../../../../toolkit/reducer";

interface PublishFormData {
  public: boolean;
}

export default function CoursePublish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, getValues } = useForm<PublishFormData>();

  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);

  const goBack = (): void => {
    dispatch(setStep(2));
  };

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [course, setValue]);

  const goToCourses = (): void => {
    dispatch(resetCourseState());
    navigate("/dashboard/myCourses-Instructor");
  };

  const handleCoursePublish = async (): Promise<void> => {
    if (!course || !token) return;

    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      //no updating in form then no need to make api call
      goToCourses();
      return;
    }
      
    //if form is updated

    const formData = new FormData();

    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;

    formData.append("status", courseStatus);

    setLoading(true);

    const result = await editCourseDetails(formData, token);
    
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = (): void => {
    handleCoursePublish();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Publish Your Course</h2>
        <p className="text-white4 text-sm">
          Review your course and choose to publish it or save as draft.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Publish Option */}
        <div className="bg-black3 rounded-xl p-6 border border-black5">
          <label
            htmlFor="public"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="public"
                {...register("public")}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-black5 rounded-full peer peer-checked:bg-purple6 transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-purple6 peer-focus:ring-offset-2 peer-focus:ring-offset-black2"></div>
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-6"></div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium block">
                Make this Course Public
              </span>
              <span className="text-white4 text-sm">
                {getValues("public")
                  ? "Your course will be visible to all students"
                  : "Your course will be saved as draft"}
              </span>
            </div>
          </label>
        </div>

        {/* Course Summary */}
        {course && (
          <div className="bg-black3 rounded-xl p-6 border border-black5">
            <h3 className="text-lg font-semibold text-white mb-4">Course Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white4">Course Name:</span>
                <span className="text-white ml-2 font-medium">{course.courseName}</span>
              </div>
              <div>
                <span className="text-white4">Price:</span>
                <span className="text-white ml-2 font-medium">₹{course.price}</span>
              </div>
              <div>
                <span className="text-white4">Sections:</span>
                <span className="text-white ml-2 font-medium">
                  {course.courseContent?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-white4">Status:</span>
                <span className="text-white ml-2 font-medium">{course.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black5">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
          >
            ← Back to Course Builder
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Save & Complete"}
          </button>
        </div>
      </form>
    </div>
  );
}

