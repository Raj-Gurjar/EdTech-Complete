import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import Modal from "../../../Modals-Popups/Modal";
import { formateDate } from "../../../../utils/formatDate";
import {
  FaEdit,
  FaTrash,
  FaClock,
  FaRupeeSign,
  FaTag,
  FaBook,
} from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { RootState } from "../../../../toolkit/reducer";

interface Course {
  _id: string;
  courseName: string;
  courseDescription?: string;
  thumbnail?: string;
  price?: number;
  status?: string;
  category?: {
    name: string;
  };
  courseContent?: Array<{
    _id: string;
    subSections?: Array<{ _id: string }>;
    [key: string]: any;
  }>;
  createdAt?: string;
  [key: string]: any;
}

interface CoursesTableProps {
  instCourses: Course[];
  setInstCourses: (courses: Course[]) => void;
  onRefresh?: () => void;
}

interface ModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

export default function CoursesTable({
  instCourses,
  setInstCourses,
  onRefresh,
}: CoursesTableProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalData | null>(null);

  const handleDeleteCourse = async (courseId: string): Promise<void> => {
    if (!token) return;
    
    setLoading(true);

    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);

    if (result) {
      setInstCourses(result);
      if (onRefresh) onRefresh();
    }

    setModal(null);
    setLoading(false);
  };

  // Calculate total lectures count
  const getTotalLectures = (course: Course): number => {
    if (!course.courseContent) return 0;
    return course.courseContent.reduce((total, section) => {
      return total + (section.subSections?.length || 0);
    }, 0);
  };

  if (instCourses.length === 0) {
    return (
      <div className="bg-black2 rounded-xl p-12 border border-black5 text-center">
        <HiOutlineBookOpen className="text-6xl text-white4 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No Courses Yet
        </h3>
        <p className="text-white4 mb-6">
          Start creating your first course to share your knowledge with students.
        </p>
        <button
          onClick={() => navigate("/dashboard/createCourse")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold"
        >
          <FaBook />
          <span>Create Your First Course</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {instCourses.map((course) => {
        const isDraft = course.status === COURSE_STATUS.DRAFT;
        const totalLectures = getTotalLectures(course);

        return (
          <div
            key={course._id}
            className="bg-black2 rounded-xl border border-black5 overflow-hidden hover:border-purple6 transition-all"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Course Thumbnail */}
              <div className="lg:w-64 flex-shrink-0">
                <img
                  src={course?.thumbnail}
                  className="w-full h-48 lg:h-full object-cover"
                  alt={course.courseName}
                />
              </div>

              {/* Course Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {course.courseName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isDraft
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-green-600/20 text-green-400 border border-green-600/30"
                        }`}
                      >
                        {isDraft ? "DRAFT" : "PUBLISHED"}
                      </span>
                    </div>
                    <p className="text-white4 text-sm line-clamp-2 mb-4">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white3">
                    <FaRupeeSign className="text-purple6" />
                    <div>
                      <p className="text-xs text-white4">Price</p>
                      <p className="text-sm font-semibold text-white">
                        ₹{course?.price || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white3">
                    <FaTag className="text-purple6" />
                    <div>
                      <p className="text-xs text-white4">Category</p>
                      <p className="text-sm font-semibold text-white">
                        {course?.category?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white3">
                    <FaBook className="text-purple6" />
                    <div>
                      <p className="text-xs text-white4">Lectures</p>
                      <p className="text-sm font-semibold text-white">
                        {totalLectures}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white3">
                    <FaClock className="text-purple6" />
                    <div>
                      <p className="text-xs text-white4">Created</p>
                      <p className="text-sm font-semibold text-white">
                        {formateDate(course?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-black5">
                  <button
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-black3 hover:bg-black4 text-white rounded-lg transition-colors font-medium"
                  >
                    <FaEdit />
                    <span>Edit Course</span>
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setModal({
                        text1: "Delete Course?",
                        text2:
                          "This course will be permanently deleted. This action cannot be undone.",
                        btn1Text: "Delete Course",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteCourse(course._id),
                        btn2Handler: () => setModal(null),
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red2/20 hover:bg-red2/30 text-red2 rounded-lg transition-colors font-medium border border-red2/30"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {modal && <Modal modalData={modal} />}
    </div>
  );
}

