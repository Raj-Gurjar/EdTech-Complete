import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import SectionDetails from "./SectionDetails";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../toolkit/slice/courseSlice";
import toast from "react-hot-toast";
import {
  updateSection,
  createSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { RootState } from "../../../../../toolkit/reducer";

interface SectionFormData {
  sectionName: string;
  shortDescription?: string;
  longDescription?: string;
}

export default function CourseBuilder() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SectionFormData>();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [editSectionName, setEditSectionName] = useState<string | null>(null);
  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);

  const cancelEdit = (): void => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  function goBack(): void {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  function goToNext(): void {
    if (course?.courseContent?.length === 0) {
      toast.error("Please add atleast one Section.");
      return;
    }
    if (
      course?.courseContent?.some((section: any) => section?.subSections?.length === 0)
    ) {
      toast.error("Please add atleast one Lecture in each section");
      return;
    }

    //if every thing is ok
    dispatch(setStep(3));
  }

  const onSubmit = async (data: SectionFormData): Promise<void> => {
    if (!course || !token) return;
    
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

  const handleEditSecName = (sectionId: string, sectionName: string): void => {
    console.log("Edit Sec Name called");
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Course Builder</h2>
        <p className="text-white4 text-sm">
          Create sections and add lectures to structure your course content.
        </p>
      </div>

      {/* Add Section Form */}
      <div className="bg-black3 rounded-xl p-6 border border-black5">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editSectionName ? "Edit Section" : "Add New Section"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sectionName" className="block text-sm font-medium text-white">
              Section Name <span className="text-red2">*</span>
            </label>
            <input
              type="text"
              id="sectionName"
              placeholder="e.g., Introduction to React"
              {...register("sectionName", { required: true })}
              className="w-full bg-black2 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
            />
            {errors.sectionName && (
              <p className="text-red2 text-sm mt-1">Section name is required</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-white">
              Brief Description <span className="text-red2">*</span>
            </label>
            <input
              type="text"
              id="shortDescription"
              placeholder="A short overview of this section"
              {...register("shortDescription", { required: true })}
              className="w-full bg-black2 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
            />
            {errors.shortDescription && (
              <p className="text-red2 text-sm mt-1">Brief description is required</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="longDescription" className="block text-sm font-medium text-white">
              Detailed Description (Optional)
            </label>
            <textarea
              id="longDescription"
              placeholder="Provide more details about this section..."
              {...register("longDescription")}
              className="w-full bg-black2 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors min-h-[100px] resize-y"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : !editSectionName
                ? "Create Section"
                : "Save Changes"}
            </button>
            {editSectionName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sections List */}
      {course?.courseContent && course.courseContent.length > 0 && (
        <div className="bg-black3 rounded-xl p-6 border border-black5">
          <h3 className="text-lg font-semibold text-white mb-4">
            Course Sections ({course.courseContent.length})
          </h3>
          <SectionDetails handleEditSecName={handleEditSecName} />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black5">
        <button
          onClick={goBack}
          className="px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
        >
          ← Back to Course Info
        </button>
        <button
          onClick={goToNext}
          className="flex-1 px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold"
        >
          Continue to Publish →
        </button>
      </div>
    </div>
  );
}

