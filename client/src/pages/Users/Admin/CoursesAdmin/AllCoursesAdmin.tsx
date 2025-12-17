import React, { useState, useEffect } from "react";
import CourseCardAdmin from "../../../../components/Cards/CourseCardAdmin";
import { IoSearch, IoClose } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { COURSE_STATUS } from "../../../../utils/constants";

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
  [key: string]: any;
}

interface AllCoursesAdminProps {
  coursesData: Course[];
}

export default function AllCoursesAdmin({ coursesData }: AllCoursesAdminProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get unique categories from courses
  const categories: string[] = Array.from(
    new Set(
      coursesData
        ?.map((course) => course.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  // Filter courses
  useEffect(() => {
    let filtered = [...(coursesData || [])];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category?.name === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [searchQuery, statusFilter, categoryFilter, coursesData]);

  const clearFilters = (): void => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-black2 rounded-xl p-6 border border-black5 shadow-lg">
        {/* Search Bar */}
        <div className="relative mb-4">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white4 text-xl" />
          <input
            type="text"
            placeholder="Search courses by name, instructor, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black3 border border-black5 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-yellow8 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white4 hover:text-white transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-black3 hover:bg-black4 border border-black5 rounded-lg text-white transition-colors"
          >
            <FaFilter /> Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-yellow8 hover:text-yellow9 text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-black5 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-yellow8 text-black"
                      : "bg-black3 text-white4 hover:bg-black4"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter(COURSE_STATUS.PUBLISHED)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === COURSE_STATUS.PUBLISHED
                      ? "bg-green-500 text-white"
                      : "bg-black3 text-white4 hover:bg-black4"
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setStatusFilter(COURSE_STATUS.DRAFT)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === COURSE_STATUS.DRAFT
                      ? "bg-orange-400 text-black"
                      : "bg-black3 text-white4 hover:bg-black4"
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === "all"
                        ? "bg-yellow8 text-black"
                        : "bg-black3 text-white4 hover:bg-black4"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        categoryFilter === category
                          ? "bg-yellow8 text-black"
                          : "bg-black3 text-white4 hover:bg-black4"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-black5">
          <p className="text-white4 text-sm">
            Showing <span className="text-yellow8 font-semibold">{filteredCourses.length}</span>{" "}
            of <span className="text-white font-semibold">{coursesData?.length || 0}</span> courses
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-black2 rounded-xl p-12 border border-black5 shadow-lg text-center">
          <p className="text-white text-xl font-semibold mb-2">No courses found</p>
          <p className="text-white4 text-sm">
            {hasActiveFilters
              ? "Try adjusting your filters or search query."
              : "No courses available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCardAdmin course={course} key={course._id} />
          ))}
        </div>
      )}
    </div>
  );
}

