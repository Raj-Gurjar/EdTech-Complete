import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseCategory } from "../../../services/operations/courseDetailsAPI";
import { FaRupeeSign } from "react-icons/fa";
import { showAllCategories } from "../../../services/operations/category";
import CreateTags from "./CreateTags";
import UploadThumbnail from "./UploadThumbnail";
import RequirementField from "./RequirementField";

export default function CourseInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  const [courseCategories, setCourseCategories] = useState([]);

  const getCategories = async () => {
    setLoading(true);
    const categories = await showAllCategories();

    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDescription", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instruction);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  const onSubmit = async (data) => {};
  return (
    <div>
      <h1>Create Info Form</h1>

      <form
        action=""
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
                <option key={index} value={category?.id}>
                  {category?.name}
                </option>
              ))}
          </select>

          {errors.courseCategory && <span>Course Category is Required </span>}
        </div>
        <label htmlFor="courseTags">Course Tag</label>
        {/* //TODO: Create Tags Component vid 56 min mfe9 */}
        <div>
          <CreateTags />
        </div>
        {/* //TODO: Upload Thumbnail Component vid 56 min mfe9 */}
        <label htmlFor="CourseImage">Course Thumbnail</label>
        <div>
          <UploadThumbnail />
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
          <RequirementField
          name = "courseRequirements"
          label = "Requirements/Instructions"
          register={register}
          errors= {errors}
          setValue = {setValue}
          getValues = {getValues}/>
        </div>

        <button type="submit" className="bg-red-500">
          Sub
        </button>
      </form>
    </div>
  );
}
