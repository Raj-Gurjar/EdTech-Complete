import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { getAllCoursesPublic } from "../../services/operations/courseDetailsAPI";
import CourseCard from "../../components/Cards/CourseCard";
import CourseSlider from "../../components/Sliders/CourseSlider";
import { IoSearch, IoClose } from "react-icons/io5";
import { BsFilter } from "react-icons/bs";
import { showAllCategories } from "../../services/operations/category";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import "../Home/Home.scss";

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
  courseDescription?: string;
  ratingAndReviews?: any[];
  studentsEnrolled?: any[];
  courseContent?: any[];
}

export default function AllCourses() {
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const getCategories = async (): Promise<void> => {
    setLoading(true);
    const categories = await showAllCategories();
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };

  const showAllCourses = async (): Promise<void> => {
    setLoading(true);
    const courses = await getAllCoursesPublic();
    if (courses.length > 0) {
      setCoursesData(courses);
      setFilteredCourses(courses);
    }
    setLoading(false);
  };

  // Filter courses based on search and category
  useEffect(() => {
    let filtered = [...coursesData];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category?.name === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, coursesData]);

  useEffect(() => {
    getCategories();
    showAllCourses();
  }, []);

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-blackBg relative overflow-hidden">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Explore Our <HighlightText text={"Courses"} textSize={"text-3xl sm:text-4xl lg:text-5xl"} />
          </h1>
          <p className="text-base sm:text-lg text-white4 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover thousands of courses designed to help you achieve your goals.
            Learn from industry experts and advance your career.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white4 text-xl" />
              <input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-white4 focus:outline-none focus:border-purple6 focus:ring-2 focus:ring-purple6/20 transition-colors"
                style={{
                  fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white4 hover:text-white transition-colors"
                >
                  <IoClose className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-purple6 text-white font-semibold shadow-lg shadow-purple6/30"
                  : "bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-purple6/50"
              }`}
              style={{
                fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
              }}
            >
              All Courses
            </button>
            {loading ? (
              <div className="text-white4">Loading categories...</div>
            ) : (
              courseCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-purple6 text-white font-semibold shadow-lg shadow-purple6/30"
                      : "bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-purple6/50"
                  }`}
                  style={{
                    fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                  }}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
              <span className="text-sm text-white4">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-sm text-white border border-white/10">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-sm text-white border border-white/10">
                  Category: {selectedCategory}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-red1/20 hover:bg-red1/30 text-red1 rounded-full text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* All Courses Grid */}
      <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {selectedCategory === "all" ? "All Courses" : selectedCategory}
              </h2>
              <p className="text-white4 text-sm sm:text-base">
                {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple6"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
              <p className="text-white4 mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "No courses available at the moment"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <PrimaryCTA onClick={clearFilters}>
                  Clear Filters
                </PrimaryCTA>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <CourseCard course={course} key={course._id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses Slider */}
      {coursesData.length > 0 && (
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-maxContent mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
              Featured <HighlightText text={"Courses"} textSize={"text-2xl sm:text-3xl lg:text-4xl"} />
            </h2>
            <CourseSlider courses={coursesData.slice(0, 10)} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}


