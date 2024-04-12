import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createSubSection,
  updateSubSection,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../toolkit/slice/courseSlice";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleEditSubSection = async () => {
    const currentValues = getValues();

    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }

    setLoading(true);
    //!API call

    const result = await updateSubSection(formData, token);

    if (result) {
      //TODO check to add extra
      dispatch(setCourse(result));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) {
      return;
    }
    if (edit) {
      if (!isFormUpdated) {
        toast.error("No changes made to the form");
      } else {
        //edit subSection
        handleEditSubSection();
      }
      return;
    }

    //create subSection
    const formData = new FormData();

    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);

    setLoading(true);

    //!API call
    const result = await createSubSection(formData, token);

    if (result) {
      //TODO: check to add something else

      dispatch(setCourse(result));
    }

    setModalData(null);
    setLoading(false);
  };
  return (
    <div className="bg-orange-300 absolute top-[10%] left-[50%] p-[10px]">
      <div className="flex bg-slate-400">
        {/* <h1>Sub-section</h1> */}

        <h2>
          {view && "Viewing"} {add && "Adding"} {edit && "Edit"} Lecture
        </h2>
        <button onClick={() => (!loading ? setModalData(null) : {})}>X</button>
      </div>

      <form onClick={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="lectureTitle">Lecture Title</label>
          <input
            type="text"
            id="lectureTitle"
            placeholder="Enter lecture Title"
            {...register("lectureTitle", { required: true })}
            className="w-full"
          />
          {errors.lectureTitle && <span>Lecture Title is required</span>}
        </div>

        <div>
          <label htmlFor="lectureDesc">Lecture Description</label>
          <textarea
            type="text"
            id="lectureDesc"
            placeholder="Enter lecture Description"
            {...register("lectureDesc", { required: true })}
            className="w-full min-h-[130px]"
          />
          {errors.lectureDesc && <span>Lecture Description is required</span>}
        </div>

        <Upload
          name="lectureVideo"
          label="lecture Video"
          register={register}
          setValue={setValue}
          errors={errors}
          video={true}
          viewData={view ? modalData.videoUrl : null}
          editData={edit ? modalData.videoUrl : null}
        />

        <button>
          {!loading ? (
            "Loading.."
          ) : (
            <>
              {edit && "Save Edit"}
              {add && "Add Lecture"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
