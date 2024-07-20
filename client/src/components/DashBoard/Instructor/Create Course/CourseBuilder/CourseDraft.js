import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  resetCourseState,
  setCourse,
  setStep,
} from "../../../../../toolkit/slice/courseSlice";
import {
  deleteCourse,
  editCourseDetails,
  fetchInstructorCourses,
} from "../../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../../utils/constants";
import Modal from "../../../../Modals-Popups/Modal";

export default function CourseDraft() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [modal, setModal] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);

    await deleteCourse({ courseId: courseId }, token);

    console.log("course dele");
    dispatch(setStep(1));
    dispatch(resetCourseState());
    // navigate("/dashboard/createCourse");

    setModal(null);
    setLoading(false);
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/myCourses-Instructor");
  };

  //     if (
  //       (course?.status === COURSE_STATUS.PUBLISHED &&
  //         getValues("public") === true) ||
  //       (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
  //     ) {
  //       //no updating in form then no need to make api call

  //       goToCourses();
  //       return;
  //     }

  //     console.log("inside else");
  //     //if form is updated

  //     const formData = new FormData();

  //     formData.append("courseId", course._id);
  //     const courseStatus = getValues("public")
  //       ? COURSE_STATUS.PUBLISHED
  //       : COURSE_STATUS.DRAFT;

  //     formData.append("status", courseStatus);

  //     setLoading(true);

  //     const result = await editCourseDetails(formData, token);

  //     // console.log("result: ",result);
  //     if (result) {
  //       goToCourses();
  //     }
  //     setLoading(false);
  //   };

  //   const onSubmit = () => {
  //     handleCoursePublish();
  //   };

  return (
    <div className="bg-slate-400 my-5">
      <h1>Draft Course</h1>

      <form onSubmit={goToCourses} className="bg-red-400">
        <p>
          You can here Draft the course and when the admin verifies your course
          it will be labelled as published and visible to all
        </p>
        <div>
          <label htmlFor="draft">
            <input type="checkbox" id="draft" required className="" />
            <span>Are you Sure you want to draft the course</span>
          </label>
        </div>

        <div className="flex gap-x-5 my-6">
          <button disabled={loading} type="submit" className="bg-yellow-200">
            Draft the Course
          </button>
        </div>
      </form>

      <div>
        <h1>OR</h1>
      </div>

      <div className="flex gap-x-4">
        <button disabled={loading} type="button" onClick={goBack}>
          Go Back & Edit
        </button>

        <button
          disabled={loading}
          onClick={() => {
            setModal({
              text1: "Are You Sure?",
              text2: "This course will be deleted permanently",
              btn1Text: "Delete Course",
              btn2Text: "Cancel",
              btn1Handler: () => handleDeleteCourse(course._id),
              btn2Handler: () => setModal(null),
            });
          }}
        >
          Discard Course
        </button>
      </div>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
