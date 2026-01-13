import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  FaArrowLeft,
  FaShareAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaBook,
  FaLanguage,
  FaCalendarAlt,
  FaCheckCircle,
  FaTag,
  FaInfoCircle,
  FaPlayCircle,
  FaRupeeSign,
  FaBan,
} from "react-icons/fa";
import {
  getCourseDetailsAdmin,
  publishCourseAdmin,
  unpublishCourseAdmin,
} from "../../../../services/operations/courseDetailsAPI";
import avgRating from "../../../../utils/avgRating";
import { formateDate } from "../../../../utils/formatDate";
import RatingStars from "../../../../utils/RatingStars";
import { COURSE_STATUS } from "../../../../utils/constants";
import Loader from "../../../../components/Loader/Loader";
import { RootState } from "../../../../toolkit/reducer";

interface SubSection {
  _id: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  [key: string]: any;
}

interface CourseSection {
  _id: string;
  sectionName?: string;
  shortDescription?: string;
  subSections?: SubSection[];
  [key: string]: any;
}

interface Instructor {
  _id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  [key: string]: any;
}

interface Category {
  _id: string;
  name?: string;
  [key: string]: any;
}

interface CourseData {
  _id: string;
  courseName?: string;
  courseDescription?: string;
  thumbnail?: string;
  price?: number;
  language?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  instructor?: Instructor;
  ratingAndReviews?: any[];
  studentsEnrolled?: string[] | any[];
  courseContent?: CourseSection[];
  whatYouWillLearn?: string;
  instructions?: string[];
  tags?: string[];
  [key: string]: any;
}

export default function CourseDetailsAdmin() {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [courseDuration, setCourseDuration] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [avgRatingCount, setAvgRatingCount] = useState<number>(0);
  const [openSection, setOpenSection] = useState<string[]>([]);

  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const count = avgRating(courseData?.ratingAndReviews);
    setAvgRatingCount(count);
  }, [courseData]);

  const showCourse = useCallback(async (): Promise<void> => {
    if (!courseId || !token) return;
    
    setLoading(true);
    try {
      const response = await getCourseDetailsAdmin(courseId, token);
      const course = response?.data?.courseDetails;
      const courseDur = response?.data?.totalDuration;

      if (course) {
        setCourseData(course);
      }
      if (courseDur) {
        setCourseDuration(courseDur);
      }
    } catch (error) {
      console.error("Error fetching course details: ", error);
      toast.error("Failed to fetch course details.");
    }
    setLoading(false);
  }, [courseId, token]);

  const publishCourseHandler = async (): Promise<void> => {
    if (!courseId || !token) return;
    
    setLoading(true);
    try {
      await publishCourseAdmin(courseId, token);
      // Update courseData state to reflect the published status
      setCourseData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          status: COURSE_STATUS.PUBLISHED,
        };
      });
      toast.success("Course published successfully.");
    } catch (error) {
      console.error("Error publishing course: ", error);
      toast.error("Failed to publish the course.");
    }
    setLoading(false);
  };

  const unpublishCourseHandler = async (): Promise<void> => {
    if (!courseId || !token) return;
    
    setLoading(true);
    try {
      await unpublishCourseAdmin(courseId, token);
      // Update courseData state to reflect the draft status
      setCourseData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          status: COURSE_STATUS.DRAFT,
        };
      });
      toast.success("Course unpublished successfully.");
    } catch (error) {
      console.error("Error unpublishing course: ", error);
      toast.error("Failed to unpublish the course.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) {
      showCourse();
    }
  }, [courseId, showCourse]);

  const handleShare = (): void => {
    copy(window.location.href);
    toast.success("Link Copied");
  };

  const handleToggleSection = (id: string): void => {
    setOpenSection(
      openSection.includes(id)
        ? openSection.filter((e) => e !== id)
        : [...openSection, id]
    );
  };

  const toggleAllSections = (): void => {
    if (openSection.length === courseData?.courseContent?.length) {
      setOpenSection([]);
    } else {
      setOpenSection(courseData?.courseContent?.map((sec) => sec._id) || []);
    }
  };

  const totalLectures = courseData?.courseContent?.reduce(
    (acc, section) => acc + (section?.subSections?.length || 0),
    0
  ) || 0;

  if (loading && !courseData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaInfoCircle className="text-6xl text-white4 mb-4" />
        <p className="text-xl text-white4">Course not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Breadcrumbs and Back Button */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/courseMenu-admin")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black2 hover:bg-black4 border border-black5 text-white transition-all duration-200 hover:border-purple6 group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span>Back to Courses</span>
          </button>
          <nav className="flex items-center gap-2 text-sm text-white4">
            <Link to="/dashboard" className="hover:text-purple6 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              to="/dashboard/courseMenu-admin"
              className="hover:text-purple6 transition-colors"
            >
              Courses
            </Link>
            <span>/</span>
            <span className="text-white">{courseData?.courseName}</span>
          </nav>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black2 hover:bg-black4 border border-black5 text-white transition-all duration-200 hover:border-purple6"
        >
          <FaShareAlt />
          <span>Share</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6 mb-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {courseData?.courseName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  courseData?.status === COURSE_STATUS.PUBLISHED
                    ? "bg-caribbeanGreen8 text-white"
                    : "bg-purple6 text-black"
                }`}
              >
                {courseData?.status}
              </span>
            </div>
            <p className="text-white4 text-base leading-relaxed">
              {courseData?.courseDescription}
            </p>
          </div>
          <div className="relative w-full sm:w-[400px] h-[225px] rounded-xl overflow-hidden border border-black5">
            <img
              src={courseData?.thumbnail}
              alt={courseData?.courseName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Instructor and Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Instructor Card */}
        <div className="bg-black2 rounded-xl p-6 border border-black5">
          <h3 className="text-lg font-bold text-white mb-4">Instructor</h3>
          <div className="flex items-center gap-4">
            <img
              src={courseData?.instructor?.profileImage}
              alt={courseData?.instructor?.firstName}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple6"
            />
            <div>
              <p className="text-white font-semibold">
                {courseData?.instructor?.firstName}{" "}
                {courseData?.instructor?.lastName}
              </p>
              <p className="text-white4 text-sm">Course Instructor</p>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="bg-black2 rounded-xl p-6 border border-black5">
          <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
          {courseData?.status === COURSE_STATUS.DRAFT && (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-purple6 font-semibold">
                  Course is in Draft
                </p>
                <p className="text-white4 text-sm mt-1">
                  Publishing this course will make it live and available to all students on the platform
                </p>
              </div>
              <button
                onClick={publishCourseHandler}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-purple6 hover:bg-purple5 text-black font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Publish Course</span>
                  </>
                )}
              </button>
            </div>
          )}
          {courseData?.status === COURSE_STATUS.PUBLISHED && (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-caribbeanGreen8 font-semibold">
                  Course is Published
                </p>
                <p className="text-white4 text-sm mt-1">
                  This course is live and available to students
                </p>
              </div>
              <button
                onClick={unpublishCourseHandler}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-red5 hover:bg-red4 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Unpublishing...</span>
                  </>
                ) : (
                  <>
                    <FaBan />
                    <span>Remove from Live</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-black2 rounded-xl p-6 border border-black5 hover:border-purple6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple6/20">
              <FaUsers className="text-purple6 text-xl" />
            </div>
            <div>
              <p className="text-white4 text-sm">Students Enrolled</p>
              <p className="text-2xl font-bold text-white">
                {Array.isArray(courseData?.studentsEnrolled) 
                  ? courseData.studentsEnrolled.length 
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black2 rounded-xl p-6 border border-black5 hover:border-purple6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue8/20">
              <FaStar className="text-blue8 text-xl" />
            </div>
            <div>
              <p className="text-white4 text-sm">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">
                  {avgRatingCount.toFixed(1)}
                </p>
                <RatingStars Review_Count={avgRatingCount} Star_Size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black2 rounded-xl p-6 border border-black5 hover:border-purple6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-caribbeanGreen8/20">
              <FaBook className="text-caribbeanGreen8 text-xl" />
            </div>
            <div>
              <p className="text-white4 text-sm">Total Lectures</p>
              <p className="text-2xl font-bold text-white">{totalLectures}</p>
            </div>
          </div>
        </div>

        <div className="bg-black2 rounded-xl p-6 border border-black5 hover:border-purple6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-pink8/20">
              <FaClock className="text-pink8 text-xl" />
            </div>
            <div>
              <p className="text-white4 text-sm">Total Duration</p>
              <p className="text-2xl font-bold text-white">
                {courseDuration || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* What You'll Learn */}
          <div className="bg-black2 rounded-xl p-6 border border-black5">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-purple6" />
              What You'll Learn
            </h2>
            <p className="text-white4 leading-relaxed whitespace-pre-line">
              {courseData?.whatYouWillLearn}
            </p>
          </div>

          {/* Course Content */}
          <div className="bg-black2 rounded-xl p-6 border border-black5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaPlayCircle className="text-purple6" />
                Course Content
              </h2>
              <button
                onClick={toggleAllSections}
                className="text-sm text-purple6 hover:text-purple5 transition-colors"
              >
                {openSection.length === courseData?.courseContent?.length
                  ? "Collapse All"
                  : "Expand All"}
              </button>
            </div>

            <div className="space-y-3">
              {courseData?.courseContent?.map((section, index) => (
                <div
                  key={section._id}
                  className="border border-black5 rounded-lg overflow-hidden bg-black3"
                >
                  <div
                    onClick={() => handleToggleSection(section._id)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-black4 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {openSection.includes(section._id) ? (
                        <IoIosArrowUp className="text-purple6 text-xl flex-shrink-0" />
                      ) : (
                        <IoIosArrowDown className="text-purple6 text-xl flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">
                          Section {index + 1}: {section?.sectionName}
                        </p>
                        <p className="text-white4 text-sm mt-1">
                          {section?.subSections?.length || 0} lectures
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/sections/${section?._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-purple6 hover:text-purple5 text-sm font-medium px-3 py-1 rounded border border-purple6/30 hover:border-purple6 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>

                  {openSection.includes(section._id) && (
                    <div className="px-4 pb-4 pt-2 border-t border-black5">
                      <p className="text-white4 text-sm mb-3">
                        {section?.shortDescription}
                      </p>
                      <div className="space-y-2">
                        {section?.subSections?.map((subSection, subIndex) => (
                          <div
                            key={subSection._id}
                            className="flex items-center gap-2 text-sm text-white4 pl-4"
                          >
                            <FaPlayCircle className="text-purple6 text-xs" />
                            <span>
                              {subIndex + 1}. {subSection?.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Details Card */}
          <div className="bg-black2 rounded-xl p-6 border border-black5">
            <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaTag className="text-purple6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white4 text-sm">Category</p>
                  <p className="text-white font-medium">
                    {courseData?.category?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaRupeeSign className="text-purple6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white4 text-sm">Price</p>
                  <p className="text-white font-medium">
                    ₹{courseData?.price || "0"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaLanguage className="text-purple6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white4 text-sm">Language</p>
                  <p className="text-white font-medium">
                    {courseData?.language || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-purple6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white4 text-sm">Created</p>
                  <p className="text-white font-medium">
                    {formateDate(courseData?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-purple6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white4 text-sm">Last Updated</p>
                  <p className="text-white font-medium">
                    {formateDate(courseData?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags and Instructions */}
          {courseData?.tags && courseData.tags.length > 0 && (
            <div className="bg-black2 rounded-xl p-6 border border-black5">
              <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-black3 text-white4 text-sm border border-black5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {courseData?.instructions && courseData.instructions.length > 0 && (
            <div className="bg-black2 rounded-xl p-6 border border-black5">
              <h3 className="text-lg font-bold text-white mb-4">
                Instructions
              </h3>
              <ul className="space-y-2">
                {courseData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-white4 text-sm">
                    <FaCheckCircle className="text-purple6 mt-1 flex-shrink-0 text-xs" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

