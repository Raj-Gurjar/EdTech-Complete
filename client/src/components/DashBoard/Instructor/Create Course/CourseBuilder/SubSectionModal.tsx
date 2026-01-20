import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaTimes, FaPlay } from "react-icons/fa";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../toolkit/slice/courseSlice";
import UploadMedia from "../../../../../utils/UploadMedia";
import { RootState } from "../../../../../toolkit/reducer";

interface SubSection {
  _id: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  sectionId?: string;
  [key: string]: any;
}

interface SubSectionModalProps {
  modalData: string | SubSection;
  setModalData: (data: string | SubSection | null) => void;
  add?: boolean;
  view?: boolean;
  edit?: boolean;
}

interface LectureFormData {
  lectureTitle: string;
  lectureDesc: string;
  lectureVideo: File | string;
}

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}: SubSectionModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<LectureFormData>();
  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if ((view || edit) && typeof modalData === 'object' && modalData !== null) {
      setValue("lectureTitle", modalData.title || "");
      setValue("lectureDesc", modalData.description || "");
      setValue("lectureVideo", modalData.videoUrl || "");
    }
  }, [view, edit, modalData, setValue]);

  const isFormUpdated = (): boolean => {
    if (typeof modalData !== 'object' || modalData === null) return false;
    
    const currentValues = getValues();
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    );
  };

  const handleEditSubSection = async (): Promise<void> => {
    if (typeof modalData !== 'object' || modalData === null || !token || !course) return;
    
    const currentValues = getValues();

    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId || "");
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoUrl", currentValues.lectureVideo as File);
    }

    setLoading(true);
    const result = await updateSubSection(formData, token);

    if (result && course.courseContent) {
      const updatedCourseContent = course.courseContent.map((section: any) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data: LectureFormData): Promise<void> => {
    if (view) {
      return;
    }
    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        await handleEditSubSection();
      }
      return;
    }

    if (typeof modalData !== 'string' || !token || !course) return;

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("videoUrl", data.lectureVideo as File);

    setLoading(true);
    const result = await createSubSection(formData, token);

    if (result && course.courseContent) {
      const updatedCourseContent = course.courseContent.map((section: any) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);
  };

  const videoUrl = typeof modalData === 'object' && modalData !== null ? modalData.videoUrl : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black1 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-black2 rounded-xl border border-black5 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-black2 border-b border-black5 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple6 flex items-center justify-center">
              <FaPlay className="text-black text-sm" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {view && "View Lecture"}
                {add && "Add New Lecture"}
                {edit && "Edit Lecture"}
              </h2>
              <p className="text-white4 text-xs mt-1">
                {view
                  ? "View lecture details"
                  : add
                  ? "Fill in the details to create a new lecture"
                  : "Update lecture information"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalData(null)}
            className="p-2 text-white4 hover:text-white hover:bg-black3 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Lecture Title */}
          <div className="space-y-2">
            <label
              htmlFor="lectureTitle"
              className="block text-sm font-medium text-white"
            >
              Lecture Title <span className="text-red2">*</span>
            </label>
            <input
              type="text"
              id="lectureTitle"
              placeholder="e.g., Introduction to React Hooks"
              {...register("lectureTitle", { required: true })}
              disabled={view}
              className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.lectureTitle && (
              <p className="text-red2 text-sm mt-1">Lecture Title is required</p>
            )}
          </div>

          {/* Lecture Description */}
          <div className="space-y-2">
            <label
              htmlFor="lectureDesc"
              className="block text-sm font-medium text-white"
            >
              Lecture Description <span className="text-red2">*</span>
            </label>
            <textarea
              id="lectureDesc"
              placeholder="Provide a detailed description of what students will learn in this lecture..."
              {...register("lectureDesc", { required: true })}
              disabled={view}
              className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors min-h-[120px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.lectureDesc && (
              <p className="text-red2 text-sm mt-1">
                Lecture Description is required
              </p>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <UploadMedia
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              previewMedia={view || edit ? videoUrl || undefined : undefined}
            />
          </div>

          {/* Action Buttons */}
          {!view && (
            <div className="flex gap-4 pt-4 border-t border-black5">
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="flex-1 px-6 py-2.5 bg-black5 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : edit
                  ? "Save Changes"
                  : "Add Lecture"}
              </button>
            </div>
          )}

          {view && (
            <div className="flex justify-end pt-4 border-t border-black5">
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="px-6 py-2.5 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

