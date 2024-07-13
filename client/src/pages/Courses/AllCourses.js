import React, { useEffect, useState } from "react";
import { showAllCategories } from "../../services/operations/category";
import { NavLink, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { getAllCourses } from "../../services/operations/courseDetailsAPI";
import CourseCard from "../../components/Cards/CourseCard";
import CourseSlider from "../../components/Sliders/CourseSlider";

export default function AllCourses() {
  const [courseCategories, setCourseCategories] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const getCategories = async () => {
    setLoading(true);
    const categories = await showAllCategories();
    // console.log("cat:", categories);
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };

  const showAllCourses = async () => {
    setLoading(true);
    const courses = await getAllCourses();
    // console.log("courses:", courses);
    if (courses.length > 0) {
      setCoursesData(courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    showAllCourses();
  }, []);

  return (
    <div className="p-2">
      <div>
        <h1 className="text-2xl">Show Categories</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="flex">
            {courseCategories.map((category, index) => (
              <NavLink
                to={`category/${category.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}`}
                key={index}
              >
                <div key={index} className="bg-yellow-100 flex gap-10 m-5 ">
                  <p className="text-blue-700">{category.name}</p>
                  {/* <p>{category.description}</p> */}
                </div>
              </NavLink>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1 className="text-2xl my-10">
          Top Courses //! make a slider for top courses
        </h1>
        <CourseSlider courses={coursesData} />
      </div>
      <div>
        <h1 className="text-2xl">All Courses</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-5">
            {coursesData?.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </div>
  );
}
