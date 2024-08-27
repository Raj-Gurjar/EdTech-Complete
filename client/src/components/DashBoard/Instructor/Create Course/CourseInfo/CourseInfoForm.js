import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaRupeeSign } from "react-icons/fa";
import { showAllCategories } from "../../../../../services/operations/category";
import {
  resetCourseState,
  setCourse,
  setStep,
} from "../../../../../toolkit/slice/courseSlice";
import {
  addCourseDetails,
  editCourseDetails,
} from "../../../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import UploadMedia from "../../../../../utils/UploadMedia";
import ChipInput from "./ChipInput";

export default function CourseInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  const clearFormHandler = () => {
    dispatch(resetCourseState());
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await showAllCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDescription", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseLanguage", course.language);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instruction);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, [editCourse, course, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDescription !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseLanguage !== course.language ||
      currentValues.courseTags !== course.tag ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements !== course.instruction
    );
  };

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const formData = new FormData();
        const currentValues = getValues();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDescription !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDescription);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseLanguage !== course.language) {
          formData.append("language", data.courseLanguage);
        }
        if (currentValues.courseTags !== course.tag) {
          formData.append("tag", data.courseTags);
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatWillYouLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage);
        }
        if (currentValues.courseRequirements !== course.instructions) {
          formData.append("instruction", data.courseRequirements);
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if (result) {
          dispatch(setCourse(result));
          dispatch(setStep(2));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDescription);
    formData.append("price", data.coursePrice);
    formData.append("language", data.courseLanguage);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", data.courseRequirements);
    formData.append("tag", data.courseTags);
    formData.append("thumbnail", data.courseImage);
    formData.append("status", COURSE_STATUS.DRAFT);

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    setLoading(false);

    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    }
  };

  return (
    <div className="createCourse">
      <h1>Create Info Form</h1>
      <form
        className="bg-[#4baca6] flex flex-col gap-5 w-10/12 m-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label htmlFor="courseTitle">Course Title</label>
          <input
            className="w-full"
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
          />
          {errors.courseTitle && <span>Course Title is Required </span>}
        </div>
        <div>
          <label htmlFor="courseShortDescription">
            Course Short Description
          </label>
          <textarea
            className="w-full"
            id="courseShortDescription"
            placeholder="Enter Course Description"
            {...register("courseShortDescription", { required: true })}
          />
          {errors.courseShortDescription && (
            <span>Course Description is Required </span>
          )}
        </div>
        <div>
          <label htmlFor="coursePrice">Course Price</label>
          <FaRupeeSign />
          <input
            id="coursePrice"
            className="w-full"
            type="number"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors.coursePrice && <span>Course Price is Required </span>}
        </div>
        <div>
          <label htmlFor="courseCategory">Course Category</label>
          <select
            className="w-full"
            id="courseCategory"
            defaultValue=""
            {...register("courseCategory", { required: true })}
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {!loading &&
              courseCategories.map((category, index) => (
                <option key={index} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>
          {errors.courseCategory && <span>Course Category is Required </span>}
        </div>
        <div>
          <label htmlFor="courseLanguage">Course Language</label>
          <input
            className="w-full"
            id="courseLanguage"
            placeholder="Enter Course Language"
            {...register("courseLanguage", { required: true })}
          />
          {errors.courseLanguage && <span>Course Language is Required </span>}
        </div>
        <div>
          <UploadMedia
            name="courseImage"
            register={register}
            label="Course Thumbnail"
            errors={errors}
            setValue={setValue}
            image={true}
            previewMedia={editCourse ? course.thumbnail : ""}
          />
        </div>
        <div>
          <label htmlFor="courseBenefits">Course Benefits</label>
          <textarea
            id="courseBenefits"
            placeholder="Enter the Course Benefits"
            className="w-full"
            {...register("courseBenefits", { required: true })}
          />
          {errors.courseBenefits && <span>Course Benefits are required.</span>}
        </div>
        <div>
          <ChipInput
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            chipValues={editCourse ? course.instructions : ""}
          />
        </div>
        <div>
          <ChipInput
            name="courseTags"
            label="Tags"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            chipValues={editCourse ? course.tags : ""}
          />
        </div>
        <div>
          {editCourse && (
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              className="bg-red-500"
            >
              Continue without Saving
            </button>
          )}
          <button type="submit" className="bg-blue-400">
            {!editCourse ? "Next" : "Save Changes"}
          </button>
          <button type="reset" onClick={clearFormHandler}>
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
}
