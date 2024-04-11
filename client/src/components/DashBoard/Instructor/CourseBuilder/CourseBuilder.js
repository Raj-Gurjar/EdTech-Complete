import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import SectionDetails from "./SectionDetails";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../toolkit/slice/courseSlice";
import toast from "react-hot-toast";
import {
  updateSection,
  createSection,
} from "../../../../services/operations/courseDetailsAPI";

export default function CourseBuilder() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  function goBack() {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }
  function goToNext() {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one Section.");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one Lecture in each section");
      return;
    }

    //if every thing is ok
    dispatch(setStep(3));
  }

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    //if we edit

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    }
    // You are creating new Section
    else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    //update values
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const handleChangeEditSecName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  console.log("course details", course);
  return (
    <div>
      <h1 className="text-2xl">Course Builder</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName">Section Name</label>
          <input
            type="text"
            id="sectionName"
            placeholder="Enter section name"
            {...register("sectionName", { required: true })}
            className="w-full"
          />
          {errors.sectionName && <span>section name is required</span>}
        </div>

        <div className="my-5">
          <button type="submit" className="bg-blue-500">
            {!editSectionName ? "Create Section" : "Edit Section Name"}
          </button>
          {editSectionName && (
            <button className="mx-5" onClick={cancelEdit}>
              cancel edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        
        <SectionDetails handleChangeEditSecName={handleChangeEditSecName} />
      )}

      <div className="flex gap-x-5">
        <button onClick={goBack}>Back</button>
        <button onClick={goToNext}>Next</button>
      </div>
    </div>
  );
}
