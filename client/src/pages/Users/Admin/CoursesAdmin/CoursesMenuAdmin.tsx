import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllCoursesAdmin } from "../../../../services/operations/courseDetailsAPI";
import { showAllCategories } from "../../../../services/operations/category";
import AllCoursesAdmin from "./AllCoursesAdmin";
import { useSelector } from "react-redux";
import HighlightText from "../../../../user interfaces/HighlightText";
import { FaTags} from "react-icons/fa";
import Loader from "../../../../components/Loader/Loader";
import { RootState } from "../../../../toolkit/reducer";

interface Category {
  _id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface Course {
  _id: string;
  courseName: string;
  thumbnail?: string;
  price?: number;
  status?: string;
  category?: {
    name: string;
  };
  instructor?: {
    firstName: string;
    lastName: string;
  };
  [key: string]: any;
}

export default function CoursesMenuAdmin() {
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useSelector((state: RootState) => state.auth);

  const getCategories = async (): Promise<void> => {
    try {
      const categories = await showAllCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const showAllCourses = async (): Promise<void> => {
    if (!token) return;
    
    setLoading(true);
    try {
      const courses = await getAllCoursesAdmin(token);
      if (courses && courses.length > 0) {
        setCoursesData(courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
    showAllCourses();
  }, [token]);

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Manage <HighlightText text="Courses" />
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          View, approve, and manage all courses on the platform.
        </p>
      </div>

      {/* Categories Section */}
      {courseCategories.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaTags className="text-purple6 text-xl" />
            <h2 className="text-xl font-semibold text-white">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {courseCategories.map((category, index) => (
              <NavLink
                to={`category/${category.name.split(" ").join("-").toLowerCase()}`}
                key={category._id || index}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-purple6 text-black shadow-lg"
                      : "bg-black3 text-white hover:bg-black4 border border-black5"
                  }`
                }
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <AllCoursesAdmin coursesData={coursesData} />
        )}
      </div>
    </div>
  );
}

