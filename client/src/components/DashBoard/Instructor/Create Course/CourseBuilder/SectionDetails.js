import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaPlay } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import SubSectionModal from "./SubSectionModal";


import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../toolkit/slice/courseSlice";
import Modal from "../../../../Modals-Popups/Modal";

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

  const [expandedSections, setExpandedSections] = useState(() => {
    return course?.courseContent?.map((section) => section._id) || [];
  });

  // Update expanded sections when course content changes
  React.useEffect(() => {
    if (course?.courseContent) {
      setExpandedSections(
        course.courseContent.map((section) => section._id)
      );
    }
  }, [course?.courseContent]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Course Sections ({course?.courseContent?.length || 0})
        </h3>
      </div>

      <div className="space-y-3">
        {course?.courseContent?.map((section, sectionIndex) => {
          const isExpanded = expandedSections.includes(section._id);
          const lectureCount = section.subSections?.length || 0;

          return (
            <div
              key={section._id}
              className="bg-black3 rounded-xl border border-black5 overflow-hidden transition-all hover:border-yellow8"
            >
              {/* Section Header */}
              <div className="p-4 bg-black2 border-b border-black5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="text-white4 hover:text-yellow8 transition-colors"
                    >
                      {isExpanded ? (
                        <FaChevronUp className="text-lg" />
                      ) : (
                        <FaChevronDown className="text-lg" />
                      )}
                    </button>
                    <HiOutlineBookOpen className="text-yellow8 text-xl" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base">
                        Section {sectionIndex + 1}: {section.sectionName}
                      </h4>
                      <p className="text-white4 text-xs mt-1">
                        {lectureCount} {lectureCount === 1 ? "lecture" : "lectures"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleEditSecName(section._id, section.sectionName)
                      }
                      className="p-2 text-white4 hover:text-yellow8 hover:bg-black3 rounded-lg transition-colors"
                      title="Edit Section"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setModal({
                          text1: "Delete Section?",
                          text2:
                            "All lectures in this section will be permanently deleted. This action cannot be undone.",
                          btn1Text: "Delete Section",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSection(section._id),
                          btn2Handler: () => setModal(null),
                        });
                      }}
                      className="p-2 text-white4 hover:text-red2 hover:bg-black3 rounded-lg transition-colors"
                      title="Delete Section"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lectures List */}
              {isExpanded && (
                <div className="p-4 space-y-2">
                  {lectureCount === 0 ? (
                    <div className="text-center py-8 text-white4">
                      <HiOutlineBookOpen className="text-4xl mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No lectures in this section yet</p>
                    </div>
                  ) : (
                    section.subSections.map((lecture, lectureIndex) => (
                      <div
                        key={lecture?._id}
                        className="group bg-black2 border border-black5 rounded-lg p-3 hover:border-yellow8 transition-all cursor-pointer"
                        onClick={() => setViewSubSection(lecture)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-black3 flex items-center justify-center text-yellow8 text-xs font-semibold">
                              {lectureIndex + 1}
                            </div>
                            <FaPlay className="text-white4 text-sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">
                                {lecture.title}
                              </p>
                              {lecture.description && (
                                <p className="text-white4 text-xs mt-1 line-clamp-1">
                                  {lecture.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button
                              onClick={() =>
                                setEditSubSection({
                                  ...lecture,
                                  sectionId: section._id,
                                })
                              }
                              className="p-1.5 text-white4 hover:text-yellow8 hover:bg-black3 rounded transition-colors"
                              title="Edit Lecture"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => {
                                setModal({
                                  text1: "Delete Lecture?",
                                  text2:
                                    "This lecture will be permanently deleted. This action cannot be undone.",
                                  btn1Text: "Delete Lecture",
                                  btn2Text: "Cancel",
                                  btn1Handler: () =>
                                    handleDeleteSubSection(
                                      lecture._id,
                                      section._id
                                    ),
                                  btn2Handler: () => setModal(null),
                                });
                              }}
                              className="p-1.5 text-white4 hover:text-red2 hover:bg-black3 rounded transition-colors"
                              title="Delete Lecture"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Lecture Button */}
                  <button
                    onClick={() => setAddSubSection(section._id)}
                    className="w-full mt-3 py-2.5 px-4 bg-black2 border-2 border-dashed border-black5 hover:border-yellow8 rounded-lg text-white4 hover:text-yellow8 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <FaPlus className="text-sm" />
                    <span>Add Lecture</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
