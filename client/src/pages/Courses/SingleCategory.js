import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import CourseSlider from "../../components/Course-Catalog/CourseSlider";
import {
  getCategoryPageDetails,
  showAllCategories,
} from "../../services/operations/category";
import SelectedCategory from "../../components/Course-Catalog/SelectedCategory";
import CourseCard from "../../components/Course-Catalog/CourseCard";

export default function SingleCategory() {
  // Destructure categoryName directly from useParams
  const { categoryName } = useParams();
  const [categoryPageData, setCategoryPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const getCategoriesId = async () => {
    setLoading(true);
    const result = await showAllCategories();
    console.log("getAllCatId res: ", result);

    const category = result.find(
      (ct) => ct.name.split(" ").join("-").toLowerCase() === categoryName
    );

    console.log("cat", category);
    if (category) {
      setCategoryId(category._id);
    }

    setLoading(false);
  };

  const getCatPageDetails = async () => {
    const result = await getCategoryPageDetails(categoryId);
    console.log("getCatDetail res: ", result);
    if (result) {
      setCategoryPageData(result?.data);
    }
  };

  useEffect(() => {
    getCategoriesId();
  }, [categoryName]);

  useEffect(() => {
    if (categoryId) {
      getCatPageDetails();
    }
  }, [categoryId]);

  console.log("Active:", active);

  return (
    <div>
      <div className="bg-blue-300 my-5">
        <p>
          Route data : Home / AllCourses /{" "}
          {categoryPageData?.selectedCategory?.name}{" "}
        </p>
        <p>Category Name : {categoryPageData?.selectedCategory?.name}</p>
        <p>
          Category Description :
          {categoryPageData?.selectedCategory?.description}
        </p>
      </div>

      <div>
        <section className="bg-red-300 my-5">
          <h1 className="text-2xl">
            Top Courses in {categoryPageData?.selectedCategory?.name}
          </h1>
          <div>
            <CourseSlider
              courses={categoryPageData?.selectedCategory?.courses}
            />
          </div>
        </section>

        <section className="bg-green-300 my-5">
          <h1 className="text-2xl">
            Courses for {categoryPageData?.selectedCategory?.name}
          </h1>
          <div className="flex gap-x-5">
            <p
              onClick={() => setActive(false)}
              className={`${
                !active && "text-red-600 underline"
              } cursor-pointer`}
            >
              All Courses
            </p>
            <p
              onClick={() => setActive(true)}
              className={`${
                active && "text-red-600 underline"
              }  cursor-pointer`}
            >
              New
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-5">
            {categoryPageData?.selectedCategory?.courses.map(
              (course, index) => (
                <CourseCard course={course} key={index} />
              )
            )}
          </div>
        </section>

        <section className="bg-slate-300 my-5">
          <h1 className="text-2xl">Other Popular Courses</h1>
          <div>
            <CourseSlider courses={categoryPageData?.mostSellingCourses} />
          </div>
        </section>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
