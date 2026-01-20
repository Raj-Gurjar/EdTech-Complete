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
import { RootState } from "../../../../../toolkit/reducer";

interface Category {
  _id: string;
  name: string;
  [key: string]: any;
}

interface CourseInfoFormData {
  courseTitle: string;
  courseShortDescription: string;
  coursePrice: number;
  courseLanguage: string;
  courseTags: string[];
  courseBenefits: string;
  courseCategory: string;
  courseRequirements: string[];
  courseImage: File | string;
}

export default function CourseInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CourseInfoFormData>();

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { course, editCourse } = useSelector((state: RootState) => state.course);
  const [loading, setLoading] = useState<boolean>(false);
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);

  const clearFormHandler = (): void => {
    dispatch(resetCourseState());
  };

  useEffect(() => {
    const getCategories = async (): Promise<void> => {
      setLoading(true);
      const categories = await showAllCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse && course) {
      setValue("courseTitle", course.courseName || "");
      setValue("courseShortDescription", course.courseDescription || "");
      setValue("coursePrice", course.price || 0);
      setValue("courseLanguage", course.language || "");
      // Handle tags - check both 'tag' and 'tags' fields, ensure it's an array
      const tags = course.tag || course.tags || [];
      setValue("courseTags", Array.isArray(tags) ? tags : []);
      setValue("courseBenefits", course.whatYouWillLearn || "");
      setValue("courseCategory", course.category?._id || "");
      // Handle instructions - check both 'instruction' and 'instructions' fields, ensure it's an array
      const instructions = course.instruction || course.instructions || [];
      setValue("courseRequirements", Array.isArray(instructions) ? instructions : []);
      setValue("courseImage", course.thumbnail || "");
    }

    getCategories();
  }, [editCourse, course, setValue]);

  const isFormUpdated = (): boolean => {
    if (!course) return true;
    
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDescription !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseLanguage !== course.language ||
      JSON.stringify(currentValues.courseTags) !== JSON.stringify(course.tag || course.tags || []) ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category?._id ||
      currentValues.courseImage !== course.thumbnail ||
      JSON.stringify(currentValues.courseRequirements) !== JSON.stringify(course.instruction || course.instructions || [])
    );
  };

  const onSubmit = async (data: CourseInfoFormData): Promise<void> => {
    if (!token) return;
    
    if (editCourse && course) {
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
          formData.append("price", String(data.coursePrice));
        }
        if (currentValues.courseLanguage !== course.language) {
          formData.append("language", data.courseLanguage);
        }
        const courseTags = course.tag || course.tags || [];
        if (JSON.stringify(currentValues.courseTags) !== JSON.stringify(courseTags)) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatWillYouLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory !== course.category?._id) {
          formData.append("category", data.courseCategory);
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage as File);
        }
        const courseInstructions = course.instruction || course.instructions || [];
        if (JSON.stringify(currentValues.courseRequirements) !== JSON.stringify(courseInstructions)) {
          formData.append("instruction", JSON.stringify(data.courseRequirements));
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if (result) {
          dispatch(setCourse(result));
          dispatch(setStep(2));
        }
      } else {
        toast.error("No changes made to the form", { duration: 4000 });
      }
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDescription);
    formData.append("price", String(data.coursePrice));
    formData.append("language", data.courseLanguage);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("thumbnail", data.courseImage as File);
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {editCourse ? "Edit Course Information" : "Course Information"}
        </h2>
        <p className="text-white4 text-sm">
          Fill in the details about your course. All fields marked with * are required.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Course Title */}
        <div className="space-y-2">
          <label htmlFor="courseTitle" className="block text-sm font-medium text-white">
            Course Title <span className="text-red2">*</span>
          </label>
          <input
            className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
            id="courseTitle"
            placeholder="e.g., Complete Web Development Bootcamp"
            {...register("courseTitle", { required: true })}
          />
          {errors.courseTitle && (
            <p className="text-red2 text-sm mt-1">Course Title is required</p>
          )}
        </div>

        {/* Course Description */}
        <div className="space-y-2">
          <label htmlFor="courseShortDescription" className="block text-sm font-medium text-white">
            Course Description <span className="text-red2">*</span>
          </label>
          <textarea
            className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors min-h-[120px] resize-y"
            id="courseShortDescription"
            placeholder="Provide a brief description of what students will learn in this course..."
            {...register("courseShortDescription", { required: true })}
          />
          {errors.courseShortDescription && (
            <p className="text-red2 text-sm mt-1">Course Description is required</p>
          )}
        </div>

        {/* Price and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Price */}
          <div className="space-y-2">
            <label htmlFor="coursePrice" className="block text-sm font-medium text-white">
              Course Price <span className="text-red2">*</span>
            </label>
            <div className="relative">
              <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white4" />
              <input
                id="coursePrice"
                className="w-full bg-black3 border border-black5 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
                type="number"
                placeholder="0"
                min="0"
                {...register("coursePrice", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
              />
            </div>
            {errors.coursePrice && (
              <p className="text-red2 text-sm mt-1">Course Price is required</p>
            )}
          </div>

          {/* Course Category */}
          <div className="space-y-2">
            <label htmlFor="courseCategory" className="block text-sm font-medium text-white">
              Course Category <span className="text-red2">*</span>
            </label>
            <select
              className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple6 transition-colors"
              id="courseCategory"
              defaultValue=""
              {...register("courseCategory", { required: true })}
            >
              <option value="" disabled className="bg-black2">
                Choose a Category
              </option>
              {!loading &&
                courseCategories.map((category, index) => (
                  <option key={category._id || index} value={category._id} className="bg-black2">
                    {category.name}
                  </option>
                ))}
            </select>
            {errors.courseCategory && (
              <p className="text-red2 text-sm mt-1">Course Category is required</p>
            )}
          </div>
        </div>

        {/* Language and Thumbnail Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Language */}
          <div className="space-y-2">
            <label htmlFor="courseLanguage" className="block text-sm font-medium text-white">
              Course Language <span className="text-red2">*</span>
            </label>
            <input
              className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
              id="courseLanguage"
              placeholder="e.g., English, Hindi"
              {...register("courseLanguage", { required: true })}
            />
            {errors.courseLanguage && (
              <p className="text-red2 text-sm mt-1">Course Language is required</p>
            )}
          </div>

          {/* Course Thumbnail */}
          <div className="space-y-2">
            <UploadMedia
              name="courseImage"
              register={register}
              label="Course Thumbnail"
              errors={errors}
              setValue={setValue}
              image={true}
              previewMedia={editCourse && course ? course.thumbnail : undefined}
            />
          </div>
        </div>

        {/* Course Benefits */}
        <div className="space-y-2">
          <label htmlFor="courseBenefits" className="block text-sm font-medium text-white">
            What Students Will Learn <span className="text-red2">*</span>
          </label>
          <textarea
            id="courseBenefits"
            placeholder="List the key learning outcomes and benefits students will gain from this course..."
            className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors min-h-[120px] resize-y"
            {...register("courseBenefits", { required: true })}
          />
          {errors.courseBenefits && (
            <p className="text-red2 text-sm mt-1">Course Benefits are required</p>
          )}
        </div>

        {/* Requirements/Instructions */}
        <div>
          <ChipInput
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            chipValues={editCourse && course ? (course.instruction || course.instructions || []) : []}
          />
        </div>

        {/* Tags */}
        <div>
          <ChipInput
            name="courseTags"
            label="Tags"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            chipValues={editCourse && course ? (course.tag || course.tags || []) : []}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black5">
          {editCourse && (
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              className="px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
            >
              Continue without Saving
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : !editCourse
              ? "Save & Continue to Course Builder"
              : "Save Changes"}
          </button>
          <button
            type="reset"
            onClick={clearFormHandler}
            className="px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
}

