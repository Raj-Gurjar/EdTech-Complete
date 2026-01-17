
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBook, FaSpinner } from "react-icons/fa";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import CoursesTable from "./CoursesTable";
import HighlightText from "../../../../user interfaces/HighlightText";
import { RootState } from "../../../../toolkit/reducer";

interface Course {
  _id: string;
  courseName: string;
  status?: string;
  [key: string]: any;
}

export default function ShowCourse() {
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.auth);

  const [instCourses, setInstCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async (): Promise<void> => {
    if (!token) return;
    
    setLoading(true);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setInstCourses(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const totalCourses = instCourses.length;
  const publishedCourses = instCourses.filter(
    (course) => course.status === "Published"
  ).length;
  const draftCourses = instCourses.filter(
    (course) => course.status === "Draft"
  ).length;

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
              My <HighlightText text="Courses" />
            </h1>
            <p className="text-white4 text-sm sm:text-base">
              Manage and track all your created courses
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/createCourse")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple6 hover:bg-purple5 text-black rounded-lg transition-all font-semibold hover:scale-105 shadow-lg"
          >
            <FaPlus />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-4 border border-black5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple6 flex items-center justify-center">
                <FaBook className="text-black text-lg" />
              </div>
              <div>
                <p className="text-white4 text-sm">Total Courses</p>
                <p className="text-white text-2xl font-bold">{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-4 border border-black5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <p className="text-white4 text-sm">Published</p>
                <p className="text-white text-2xl font-bold">{publishedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-4 border border-black5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <p className="text-white4 text-sm">Drafts</p>
                <p className="text-white text-2xl font-bold">{draftCourses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-purple6 text-4xl animate-spin" />
        </div>
      ) : (
        <CoursesTable
          instCourses={instCourses}
          setInstCourses={setInstCourses}
          onRefresh={fetchCourses}
        />
      )}
    </div>
  );
}

