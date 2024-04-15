import React, { useEffect, useState } from "react";
import { resetCourseState, setStep } from "../../../toolkit/slice/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { COURSE_STATUS } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { editCourseDetails } from "../../../services/operations/courseDetailsAPI";

export default function CoursePublish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, getValues } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const goBack = () => {
    dispatch(setStep(2));
  };

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  });
  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/myCourses-Instructor");
  };

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)
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

  const onSubmit = () => {
    handleCoursePublish();
  };

  return (
    <div className="bg-slate-400 my-5">
      <h1> Publish Course</h1>

      <form action={onSubmit}>
        <div>
          <label htmlFor="public">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className=""
            />
            <span>Make this Course as Public</span>
          </label>
        </div>

        <div className="flex gap-x-5 my-6">
          <button disabled={loading} type="button" onClick={() => goBack}>
            Back
          </button>
          <button disabled={loading}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}
