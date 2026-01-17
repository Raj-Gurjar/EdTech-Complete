import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CourseSlider from "../../components/Sliders/CourseSlider";
import {
  getCategoryPageDetails,
  showAllCategories,
} from "../../services/operations/category";
import CourseCard from "../../components/Cards/CourseCard";

interface Category {
  _id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface Course {
  _id: string;
  courseName: string;
  thumbnail?: string;
  price?: number;
  status?: string;
  category?: {
    name: string;
  };
  instructor?: {
    firstName: string;
    lastName: string;
  };
  ratingAndReviews?: any[];
  studentsEnrolled?: any[];
  courseContent?: any[];
}

interface CategoryPageData {
  selectedCategory?: {
    name: string;
    description?: string;
    courses?: Course[];
  };
  mostSellingCourses?: Course[];
  [key: string]: any;
}

export default function SingleCategory() {
  // Destructure categoryName directly from useParams
  const { categoryName } = useParams<{ categoryName: string }>();
  const [categoryPageData, setCategoryPageData] = useState<CategoryPageData | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const getCategoriesId = async (): Promise<void> => {
    setLoading(true);
    const result = await showAllCategories();
    console.log("getAllCatId res: ", result);

    const category = result.find(
      (ct: Category) => ct.name.split(" ").join("-").toLowerCase() === categoryName
    );

    console.log("cat", category);
    if (category) {
      setCategoryId(category._id);
    }

    setLoading(false);
  };

  const getCatPageDetails = async (): Promise<void> => {
    const result = await getCategoryPageDetails(categoryId);
    console.log("getCatDetail res: ", result);
    if (result) {
      setCategoryPageData(result?.data);
    }
  };

  useEffect(() => {
    if (categoryName) {
      getCategoriesId();
    }
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
          Route data :<Link to="/">Home </Link>/
          <Link to="/allCourses">AllCourses</Link>/
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
              courses={categoryPageData?.selectedCategory?.courses || []}
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
            {categoryPageData?.selectedCategory?.courses?.map(
              (course, index) => (
                <CourseCard course={course} key={index} />
              )
            )}
          </div>
        </section>

        <section className="bg-slate-300 my-5">
          <h1 className="text-2xl">Other Popular Courses</h1>
          <div>
            <CourseSlider courses={categoryPageData?.mostSellingCourses || []} />
          </div>
        </section>
      </div>

      {/* <Footer /> */}
    </div>
  );
}


