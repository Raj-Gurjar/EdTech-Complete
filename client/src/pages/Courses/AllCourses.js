import React, { useEffect, useState } from "react";
import { showAllCategories } from "../../services/operations/category";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

export default function AllCourses() {
  const [courseCategories, setCourseCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const getCategories = async () => {
    setLoading(true);
    const categories = await showAllCategories();
    console.log("cat:", categories);
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // console.log("courseCategory", courseCategories);
  // const matchRoute = (route) => {
  //   return matchPath({ path: route }, location.pathname);
  // };
  return (
    <div>
      <h1 className="text-2xl">Show Categories</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
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
                <p>{category.description}</p>
              </div>
            </NavLink>
          ))}
        </ul>
      )}

      <Footer/>
    </div>
  );
}
