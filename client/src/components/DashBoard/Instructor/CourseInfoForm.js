import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaRupeeSign } from "react-icons/fa";
import { showAllCategories } from "../../../services/operations/category";
import CreateTags from "./CreateTags";
import UploadThumbnail from "./UploadThumbnail";
import RequirementField from "./RequirementField";
import { setCourse, setStep } from "../../../toolkit/slice/courseSlice";
import {
  addCourseDetails,
  editCourseDetails,
} from "../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../utils/constants";

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

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await showAllCategories();
      // console.log("categories inside courseInfo", categories);

      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDescription", course.courseDescription);
      setValue("coursePrice", course.price);
      // setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instruction);
      // setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  const isFormUpdated = () => {
    console.log("inside isFormUpdated");
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDescription !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      // currentValues.courseTags !== course.tag ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category._id ||
      // currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !==
        course.instruction.toString()
    ) {
      return true;
    } else {
      return false;
    }
  };

  //handle next button
  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        console.log("current values: ", currentValues);
        const formData = new FormData();

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
        // if ( currentValues.courseTags !== course.tag) {
        //   formData.append("tag", data.courseTags);
        // }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatWillYouLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        // if ( currentValues.courseImage !== course.thumbnail) {
        //   formData.append("thumbnail", data.courseImage);
        // }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instruction",
            JSON.stringify(data.courseRequirements)
          );
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          setStep(2);
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    //! create a new course

    // console.log("createCourse cp1");
    console.log("data", data);
    const formData = new FormData();

    // console.log("category id:", data.courseCategory._id);
    // console.log("category", data.courseCategory);
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDescription);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    // formData.append("tag", data.courseTags);
    // formData.append("thumbnail", data.courseImage);
    formData.append("status", COURSE_STATUS.DRAFT);

    // console.log("form2", formData);
    setLoading(true);
    const result = await addCourseDetails(formData, token);
    console.log("result2", result);
    if (result) {
      console.log("going inside result");
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
    console.log("result", result);
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
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />
        </div>

        <div>
          {editCourse && (
            <button onClick={() => dispatch(setStep(2))} className="bg-red-500">
              Continue without Saving
            </button>
          )}

          <button type="submit" className="bg-blue-400">
            {!editCourse ? "Next" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
