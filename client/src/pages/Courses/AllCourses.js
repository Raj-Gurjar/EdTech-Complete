import React, { useEffect, useState } from "react";
import { showAllCategories } from "../../services/operations/category";

export default function AllCourses() {
  const [courseCategories, setCourseCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    const categories = await showAllCategories();
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // console.log("courseCategory", courseCategories);

  return (
    <div>
      <h1 className="text-2xl">Show Categories</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {courseCategories.map((category, index) => (
            <div key={index} className="bg-yellow-100 flex gap-10 m-5">
              <p>{category.name}</p>
              <p>{category.description}</p>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
