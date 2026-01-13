import React, { useState, useEffect } from "react";
import CategoryTable from "./CategoryTable";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../toolkit/slice/authSlice";
import { showAllCategories } from "../../../../services/operations/category";
import { Link, useNavigate } from "react-router-dom";
import HighlightText from "../../../../user interfaces/HighlightText";
import { FaPlus, FaTags } from "react-icons/fa";
import Loader from "../../../../components/Loader/Loader";

interface Category {
  _id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export default function CategoryMenuAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [loading, setLoadingState] = useState<boolean>(false);

  const getCategories = async (): Promise<void> => {
    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      const categories = await showAllCategories();
      if (categories && categories.length > 0) {
        setCourseCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoadingState(false);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Manage <HighlightText text="Categories" />
          </h1>
          <p className="text-white4 text-sm sm:text-base">
            Create, view, and manage course categories.
          </p>
        </div>
        <Link
          to="/dashboard/createCategory"
          className="inline-flex items-center gap-2 bg-purple6 hover:bg-purple5 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <FaPlus /> Create Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-black2 rounded-xl border border-black5 shadow-lg overflow-hidden">
        <CategoryTable
          getCategories={getCategories}
          courseCategories={courseCategories}
        />
      </div>
    </div>
  );
}

