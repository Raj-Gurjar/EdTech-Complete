import React, { useState } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./CreateCategory";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../toolkit/slice/authSlice";
import { showAllCategories } from "../../../services/operations/category";
import { Link } from "react-router-dom";

export default function CategoryMenu() {
  const dispatch = useDispatch();
  const [courseCategories, setCourseCategories] = useState([]);
  // const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    dispatch(setLoading(true));
    const categories = await showAllCategories();
    console.log("cat:", categories);
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    dispatch(setLoading(false));
  };

  useState(() => {
    getCategories();
  }, []);

  return (
    <div>
      <h1 className="text-3xl m-5">Category Menu</h1>
      <h2 className="bg-red-300 m-auto">
        <Link to="/dashboard/createCategory">Create A category</Link>
      </h2>
      <div className="m-5 bg-yellow-200">
        <CategoryTable
          getCategories={getCategories}
          courseCategories={courseCategories}
        />
      </div>

     
    </div>
  );
}
