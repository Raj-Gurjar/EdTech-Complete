import React, { useState } from "react";
import { useSelector } from "react-redux";
import { deleteCategory } from "../../../../services/operations/category";
import { FaTrashAlt, FaTags, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import Modal from "../../../../components/Modals-Popups/Modal";
import { formateDate } from "../../../../utils/formatDate";
import Loader from "../../../../components/Loader/Loader";
import { RootState } from "../../../../toolkit/reducer";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  courses?: any[];
  [key: string]: any;
}

interface CategoryTableProps {
  getCategories: () => void;
  courseCategories: Category[];
}

interface ModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

export default function CategoryTable({ getCategories, courseCategories }: CategoryTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<ModalData | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleDeleteCategory = async (categoryId: string, categoryName: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteCategory(categoryId, token || "");
      getCategories();
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setLoading(false);
  };

  if (loading && courseCategories.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow8/10 p-3 rounded-lg">
            <FaTags className="text-yellow8 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Categories</h2>
            <p className="text-white4 text-sm">
              {courseCategories.length} {courseCategories.length === 1 ? "category" : "categories"} total
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      {courseCategories.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-black3 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FaTags className="text-white4 text-3xl" />
          </div>
          <p className="text-white text-xl font-semibold mb-2">No Categories Found</p>
          <p className="text-white4 text-sm">
            Create your first category to organize courses.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {courseCategories.map((category) => (
            <div
              key={category._id || category.id}
              className="bg-black3 hover:bg-black4 rounded-lg p-5 border border-black5 hover:border-yellow8/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow8/10 p-2 rounded-lg">
                      <FaTags className="text-yellow8" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-yellow8 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <p className="text-white4 text-sm ml-11 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 ml-11 text-white6 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-yellow8" />
                      <span>
                        Created: {formateDate(category.createdAt) || 
                          (category.createdAt ? category.createdAt.split("T")[0] : "N/A")}
                      </span>
                    </div>
                    {category.courses && (
                      <div className="flex items-center gap-2">
                        <FaInfoCircle className="text-yellow8" />
                        <span>{category.courses.length || 0} courses</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        text1: "Delete Category?",
                        text2: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteCategory(category._id || category.id || "", category.name),
                        btn2Handler: () => setDeleteModal(null),
                      })
                    }
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-red2 hover:bg-red1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && <Modal modalData={deleteModal} />}
    </div>
  );
}

