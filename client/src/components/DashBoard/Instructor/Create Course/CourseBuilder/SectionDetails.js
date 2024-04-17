import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import SubSectionModal from "./SubSectionModal";
import Modal from "../../../../Modal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../toolkit/slice/courseSlice";

export default function SectionDetails({ handleEditSecName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [modal, setModal] = useState(null);

  // console.log("editSubSection :", editSubSection);
  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    });
    // console.log("sec delete result: ", result);
    if (result) {
      dispatch(setCourse(result));
    }
    setModal(null);
  };
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    // console.log("sub sec delete result: ", result);
    if (result) {
      // // TODO: something we can add here
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };

      dispatch(setCourse(updatedCourse));
    }
    setModal(null);
  };

  // console.log("viewSubSection: ", viewSubSection);
  return (
    <div className="my-6">
      <h1 className="text-2xl ">Section Details</h1>

      <div>
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className="flex bg-green-300 m-1 justify-between gap-x-3">
              <div className="flex bg-red-300 gap-4">
                <RxDropdownMenu />
                <p>{section.sectionName}</p>
                <div className="flex gap-x-5 bg-slate-400">
                  <button
                    onClick={() =>
                      handleEditSecName(section._id, section.sectionName)
                    }
                  >
                    <FaRegEdit />
                  </button>

                  <button
                    onClick={() => {
                      setModal({
                        text1: "Are You Sure?",
                        text2:
                          "All the lectures will be deleted of this section",
                        btn1Text: "Delete Section",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSection(section._id),
                        btn2Handler: () => setModal(null),
                      });
                    }}
                  >
                    <AiTwotoneDelete />
                  </button>

                  <span>|</span>
                  <div>
                    <IoIosArrowDropdownCircle />
                  </div>
                </div>
              </div>
            </summary>

            <div className="bg-pink-300 flex flex-col justify-between">
              {section.subSections.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex item-center  justify-between gap-x-3 border-b-2 border-black"
                >
                  <div>
                    {/* <RxDropdownMenu /> */}
                    <p>{data.title}</p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-x-5 bg-slate-400"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <FaRegEdit />
                    </button>

                    <button
                      onClick={() => {
                        setModal({
                          text1: "Delete SubSection ! Are You Sure?",
                          text2:
                            "All the lectures will be deleted of this section",
                          btn1Text: "Delete SubSection",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setModal(null),
                        });
                      }}
                    >
                      <AiTwotoneDelete />
                    </button>

                    <div></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setAddSubSection(section._id)}>
                Add Lecture
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <div></div>
      )}

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
