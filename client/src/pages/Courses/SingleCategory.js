import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import CourseSlider from "../../components/CourseSlider";
import {
  getCategoryPageDetails,
  showAllCategories,
} from "../../services/operations/category";

export default function SingleCategory() {
  // Destructure categoryName directly from useParams
  const { categoryName } = useParams();
  const [categoryPageData, setCategoryPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);


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
      setCategoryPageData(result);
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

 

  return (
    <div>
      <div className="bg-blue-300 my-5">
        <p>Route data : Home / Category /{categoryPageData?.data?.selectedCategory?.name} </p>
        <p>Category Name : {categoryName}</p>
        <p>Category Description : {categoryPageData?.description}</p>
      </div>

      <div>
        <section className="bg-green-300 my-5">
          <div className="flex gap-x-5">
            <p>Most Popular</p>
            <p>New</p>
          </div>
          <CourseSlider courses={categoryPageData?.mostPopularCourses} />
        </section>

        <section className="bg-red-300 my-5">
          <p>Top Courses</p>
          <div>
            <CourseSlider courses={categoryPageData?.topCourses} />
          </div>
        </section>

        <section className="bg-slate-300 my-5">
          <p>Frequently Bought Together</p>
          <CourseSlider
            courses={categoryPageData?.frequentlyBoughtTogetherCourses}
          />
        </section>
      </div>

      <Footer />
    </div>
  );
}
