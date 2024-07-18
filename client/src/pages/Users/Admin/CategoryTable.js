import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../toolkit/slice/authSlice";
import {
  deleteCategory,
  showAllCategories,
} from "../../../services/operations/category";

export default function CategoryTable({ getCategories, courseCategories }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  console.log("coursec", courseCategories);

  const handleDeleteCategory = async (categoryId) => {
    console.log("cat id", categoryId);

    setLoading(true);

    await deleteCategory({ categoryId: categoryId }, token);

    getCategories();

    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Table</h1>
      {loading ? (
        <div> Loading... </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">
                Category Name
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">
                Created At
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">
                Delete Category
              </th>
            </tr>
          </thead>
          <tbody>
            {courseCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b border-gray-200">
                  {category.name}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {category.createdAt.split("T", 1)}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
