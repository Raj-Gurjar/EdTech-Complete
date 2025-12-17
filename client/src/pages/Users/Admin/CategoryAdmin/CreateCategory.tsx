import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../../toolkit/slice/authSlice";
import { createCategory } from "../../../../services/operations/category";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../toolkit/reducer";

interface CategoryFormData {
  categoryName: string;
  categoryDescription: string;
}

export default function CreateCategory() {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData): Promise<void> => {
    dispatch(setLoading(true));

    let result = await createCategory(
      {
        categoryName: data.categoryName,
        categoryDescription: data.categoryDescription,
        name: ""
      },
      token || ""
    );

    if (result) {
      // console.log("cat created", result);
      setValue("categoryName", "");
      setValue("categoryDescription", "");
    }

    dispatch(setLoading(false));
  };

  //! -- Add a back button
  return (
    <div>
      <div>
        <h1>All Current Categories</h1>

        <div></div>
      </div>

      <form>
        <div>
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            placeholder="Enter category name"
            {...register("categoryName", { required: true })}
            className="w-full"
          />
          {errors.categoryName && <span>category name is required</span>}
        </div>

        <div>
          <label htmlFor="categoryName">Category Description</label>
          <input
            type="text"
            id="categoryDescription"
            placeholder="Enter category description"
            {...register("categoryDescription", { required: true })}
            className="w-full"
          />
          {errors.categoryDescription && (
            <span>category description is required</span>
          )}
        </div>
        <div className="mt-4 flex gap-x-5">
          <button onClick={handleSubmit(onSubmit)} className="bg-red-400">
            Create Category
          </button>

          <button type="reset" className="bg-red-400">
            Clear
          </button>
        </div>
      </form>

      <button
        className="m-5"
        onClick={() => navigate("/dashboard/categoryMenu")}
      >
        Back
      </button>
    </div>
  );
}

