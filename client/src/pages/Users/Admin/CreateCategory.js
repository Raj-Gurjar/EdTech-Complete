import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { setLoading } from "../../../toolkit/slice/authSlice";
import { createCategory } from "../../../services/operations/category";

export default function CreateCategory() {
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    let result = await createCategory(
      {
        categoryName: data.categoryName,
        categoryDescription: data.categoryDescription,
      },
      token
    );

    console.log("cat created");

    if (result) {
    }

    setLoading(false);
  };

  //! -- Add a back button
  return (
    <div>
      <div>
        <h1>All Current Categories</h1>

        <div></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
          {errors.categoryName && <span>category description is required</span>}
        </div>

        <button className="mt-4">Create Category</button>
      </form>
    </div>
  );
}
