import React, { useEffect, useState } from "react";
import { getCourseDetails, getAllReviews } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyCourse } from "../../services/operations/paymentApi";
import Modal from "../../components/Modals-Popups/Modal";
import avgRating from "../../utils/avgRating";
import RatingStars from "../../utils/RatingStars";
import { formateDate } from "../../utils/formatDate";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { addToCart } from "../../toolkit/slice/cartSlice";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { 
  FaBook, 
  FaClock, 
  FaUsers, 
  FaStar, 
  FaCheckCircle, 
  FaPlayCircle,
  FaShareAlt,
  FaHeart,
  FaLanguage,
  FaCalendarAlt
} from "react-icons/fa";
import ReviewCard from "../../components/Cards/ReviewCard";
import CourseReviewModal from "../../components/Modals-Popups/CourseReviewModal";

export default function CourseDetails() {
  const [courseData, setCourseData] = useState(null);
  const [courseDuration, setCourseDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avgRatingCount, setAvgRatingCount] = useState(0);
  const [modal, setModal] = useState(null);
  const [openSection, setOpenSection] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [totalLectures, setTotalLectures] = useState(0);

  const { paymentLoading } = useSelector((state) => state.course);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEnrolled = user && courseData?.studentsEnrolled?.includes(user?._id);

  const handleToggleSection = (id) => {
    setOpenSection(
      openSection.includes(id)
        ? openSection.filter((e) => e !== id)
        : [...openSection, id]
    );
  };

  const toggleAllSections = () => {
    if (openSection.length === courseData?.courseContent?.length) {
      setOpenSection([]);
    } else {
      setOpenSection(courseData?.courseContent?.map((sec) => sec._id) || []);
    }
  };

  useEffect(() => {
    const count = avgRating(courseData?.ratingAndReviews);
    setAvgRatingCount(count);
  }, [courseData]);

  useEffect(() => {
    if (courseData?.courseContent) {
      const total = courseData.courseContent.reduce((acc, section) => {
        return acc + (section.subSections?.length || 0);
      }, 0);
      setTotalLectures(total);
    }
  }, [courseData]);

  const showCourse = async () => {
    setLoading(true);
    try {
      const response = await getCourseDetails(courseId);
      const course = response?.data?.courseDetails;
      const courseDur = response?.data?.totalDuration;

      if (course) {
        setCourseData(course);
      }

      if (courseDur) {
        setCourseDuration(courseDur);
      }

      // Use reviews from courseData if available, otherwise fetch all
      if (course?.ratingAndReviews && course.ratingAndReviews.length > 0) {
        // If ratingAndReviews contains full review objects
        if (typeof course.ratingAndReviews[0] === 'object') {
          setReviews(course.ratingAndReviews);
        } else {
          // If it's just IDs, fetch all reviews and filter
          try {
            const allReviews = await getAllReviews();
            const courseReviewIds = course.ratingAndReviews.map(r => r._id || r);
            const courseReviews = allReviews.filter(
              (review) => courseReviewIds.includes(review._id) || review.course?._id === courseId
            );
            setReviews(courseReviews);
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) {
      showCourse();
    }
  }, [courseId]);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setModal({
      text1: "You are not Logged in",
      text2: "Please Login to buy a course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setModal(null),
    });
  };

  const handleAddToCart = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR || user?.accountType === ACCOUNT_TYPE.ADMIN) {
      toast.error("Only a Student Account can buy a course");
      return;
    }

    if (token) {
      dispatch(addToCart(courseData));
      return;
    }
    setModal({
      text1: "You are not Logged in",
      text2: "Please Login to add the course to your cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Course link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black3 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow8"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-black3 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course not found</h2>
          <Link
            to="/allCourses"
            className="text-yellow8 hover:text-yellow9 transition-colors"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  const ratingCount = courseData?.ratingAndReviews?.length || 0;
  const studentsEnrolled = courseData?.studentsEnrolled?.length || 0;

  return (
    <div className="min-h-screen bg-black3">
      {/* Breadcrumb */}
      <div className="bg-black2 border-b border-black5 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-black7">
            <Link to="/" className="hover:text-yellow8 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/allCourses" className="hover:text-yellow8 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-white">{courseData?.courseName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black2 to-black4 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Title & Category */}
              <div>
                <span className="inline-block bg-black1 text-yellow8 text-sm font-medium px-3 py-1 rounded-full mb-3">
                  {courseData?.category?.name || "Uncategorized"}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {courseData?.courseName}
                </h1>
                <p className="text-lg sm:text-xl text-black8 leading-relaxed">
                  {courseData?.courseDescription}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <RatingStars Review_Count={avgRatingCount} Star_Size={20} />
                    <span className="ml-2 font-semibold text-white">
                      {avgRatingCount.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-black7">
                    ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-black7">
                  <FaUsers className="text-yellow8" />
                  <span>{studentsEnrolled} {studentsEnrolled === 1 ? "student" : "students"}</span>
                </div>
                {courseDuration && (
                  <div className="flex items-center gap-2 text-black7">
                    <FaClock className="text-yellow8" />
                    <span>{courseDuration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-black7">
                  <FaBook className="text-yellow8" />
                  <span>{totalLectures} {totalLectures === 1 ? "lecture" : "lectures"}</span>
                </div>
                <div className="flex items-center gap-2 text-black7">
                  <FaLanguage className="text-yellow8" />
                  <span>{courseData?.language || "English"}</span>
                </div>
              </div>

              {/* Instructor */}
              {courseData?.instructor && (
                <div className="flex items-center gap-4 pt-4 border-t border-black5">
                  <img
                    src={courseData.instructor.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${courseData.instructor.firstName}${courseData.instructor.lastName}`}
                    alt={`${courseData.instructor.firstName} ${courseData.instructor.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow8"
                  />
                  <div>
                    <p className="text-black7 text-sm">Created by</p>
                    <p className="text-white font-semibold text-lg">
                      {courseData.instructor.firstName} {courseData.instructor.lastName}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-sm text-black7">
                <FaCalendarAlt className="text-yellow8" />
                <span>Last updated: {formateDate(courseData?.updatedAt)}</span>
              </div>
            </div>

            {/* Sidebar - Pricing & CTA */}
            <div className="lg:col-span-1">
              <div className="bg-black2 border border-black5 rounded-xl p-6 sticky top-24">
                {/* Course Thumbnail */}
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={courseData?.thumbnail || "https://via.placeholder.com/400x250"}
                    alt={courseData?.courseName}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold text-white">
                      ₹{courseData?.price || "0"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isEnrolled ? (
                    <Link
                      to="/dashboard/enrolledCourses"
                      className="block w-full bg-yellow8 hover:bg-yellow9 text-black font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 hover:scale-105"
                    >
                      Go to Course
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={handleBuyCourse}
                        disabled={paymentLoading}
                        className="w-full bg-yellow8 hover:bg-yellow9 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? "Processing..." : "Buy Now"}
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-black1 hover:bg-black border border-black5 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full mt-3 flex items-center justify-center gap-2 text-black7 hover:text-yellow8 transition-colors text-sm"
                >
                  <FaShareAlt />
                  <span>Share this course</span>
                </button>

                {/* Course Includes */}
                <div className="mt-6 pt-6 border-t border-black5">
                  <h3 className="font-semibold text-white mb-3">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-black7">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-yellow8" />
                      <span>{totalLectures} on-demand video lectures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-yellow8" />
                      <span>{courseDuration || "Lifetime"} access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-yellow8" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-yellow8" />
                      <span>Mobile and TV access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              {courseData?.whatYouWillLearn && courseData.whatYouWillLearn.length > 0 && (
                <div className="bg-black2 border border-black5 rounded-xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courseData.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="text-yellow8 flex-shrink-0 mt-1" />
                        <span className="text-black8">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Content */}
              <div className="bg-black2 border border-black5 rounded-xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Course Content
                  </h2>
                  <button
                    onClick={toggleAllSections}
                    className="text-sm text-yellow8 hover:text-yellow9 transition-colors"
                  >
                    {openSection.length === courseData?.courseContent?.length ? "Collapse All" : "Expand All"}
                  </button>
                </div>

                <div className="mb-4 text-black7 text-sm">
                  <span className="font-semibold text-white">
                    {courseData?.courseContent?.length || 0} sections
                  </span>
                  {" • "}
                  <span>{totalLectures} lectures</span>
                  {" • "}
                  <span>{courseDuration || "N/A"}</span>
                </div>

                <div className="space-y-2">
                  {courseData?.courseContent?.map((section, index) => (
                    <div
                      key={section._id || index}
                      className="border border-black5 rounded-lg overflow-hidden bg-black1"
                    >
                      <button
                        onClick={() => handleToggleSection(section._id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-black2 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          {openSection.includes(section._id) ? (
                            <IoIosArrowUp className="text-yellow8 text-xl flex-shrink-0" />
                          ) : (
                            <IoIosArrowDown className="text-black7 text-xl flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              Section {index + 1}: {section?.sectionName}
                            </h3>
                            {section?.shortDescription && (
                              <p className="text-sm text-black7">{section.shortDescription}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-black7 ml-4">
                          {section?.subSections?.length || 0} {section?.subSections?.length === 1 ? "lecture" : "lectures"}
                        </div>
                      </button>

                      {openSection.includes(section._id) && (
                        <div className="border-t border-black5 bg-black2 p-4">
                          <div className="space-y-2">
                            {section?.subSections?.map((subSection, subIndex) => (
                              <div
                                key={subSection._id || subIndex}
                                className="flex items-center gap-3 p-3 hover:bg-black1 rounded transition-colors"
                              >
                                <FaPlayCircle className="text-yellow8 flex-shrink-0" />
                                <span className="text-black8 flex-1">{subSection?.title || `Lecture ${subIndex + 1}`}</span>
                                {subSection?.timeDuration && (
                                  <span className="text-sm text-black7">{subSection.timeDuration}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <Link
                            to={`/sections/${section._id}`}
                            className="block mt-4 text-yellow8 hover:text-yellow9 text-sm font-medium transition-colors"
                          >
                            View full section details →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements/Instructions */}
              {courseData?.instructions && courseData.instructions.length > 0 && (
                <div className="bg-black2 border border-black5 rounded-xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {courseData.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3 text-black8">
                        <span className="text-yellow8 mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-black2 border border-black5 rounded-xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Student Reviews
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RatingStars Review_Count={avgRatingCount} Star_Size={24} />
                        <span className="text-xl font-bold text-white ml-2">
                          {avgRatingCount.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-black7">
                        Based on {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                  {token && user?.accountType === ACCOUNT_TYPE.STUDENT && !isEnrolled && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-yellow8 hover:bg-yellow9 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Write Review
                    </button>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FaStar className="text-6xl text-black5 mx-auto mb-4" />
                    <p className="text-black7">No reviews yet. Be the first to review this course!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review, index) => (
                      <ReviewCard key={review._id || index} data={review} />
                    ))}
                    {reviews.length > 5 && (
                      <button className="w-full py-3 text-yellow8 hover:text-yellow9 font-medium transition-colors">
                        View all {reviews.length} reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal && <Modal modalData={modal} />}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-black2 border border-black5 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CourseReviewModal setReviewModal={setShowReviewModal} />
          </div>
        </div>
      )}
    </div>
  );
}
