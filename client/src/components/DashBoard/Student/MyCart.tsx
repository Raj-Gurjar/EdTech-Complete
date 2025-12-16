import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../toolkit/slice/cartSlice";
import { buyCourse } from "../../../services/operations/paymentApi";
import { useNavigate, Link } from "react-router-dom";
import HighlightText from "../../../user interfaces/HighlightText";
import RatingStars from "../../../utils/RatingStars";
import avgRating from "../../../utils/avgRating";
import { 
  FaTrash, 
  FaShoppingCart, 
  FaArrowRight,
  FaBook,
  FaUsers,
  FaTag
} from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { RootState } from "../../../toolkit/reducer";

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

export default function MyCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, totalAmount, totalItems } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Fallback to localStorage if Redux state is empty
  const finalTotalAmount = totalAmount || JSON.parse(localStorage.getItem("totalAmount") || "0");
  const finalTotalItems = totalItems || JSON.parse(localStorage.getItem("totalItem") || "0");

  const handleBuyCourse = async (): Promise<void> => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    const courses = cart.map((course: Course) => course._id);
    await buyCourse(token, courses, user, navigate, dispatch);
    setIsProcessing(false);
  };

  const handleRemoveFromCart = (courseId: string): void => {
    dispatch(removeFromCart(courseId));
  };

  // Empty Cart Component
  if (cart.length === 0 || finalTotalItems === 0) {
    return (
      <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"Shopping Cart"} />
          </h1>
          <p className="text-black6 text-sm sm:text-base">Your selected courses</p>
        </div>

        <div className="bg-black4 rounded-2xl shadow-xl p-12 sm:p-16 border border-black6 text-center">
          <div className="mb-6">
            <MdShoppingCart className="text-8xl text-black6 mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-black7 mb-8 max-w-md mx-auto">
            Looks like you haven't added any courses to your cart yet. Start exploring our amazing courses!
          </p>
          <Link
            to="/allCourses"
            className="inline-flex items-center gap-2 bg-yellow8 hover:bg-yellow9 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <FaBook />
            <span>Browse Courses</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <HighlightText text={"Shopping Cart"} />
        </h1>
        <p className="text-black6 text-sm sm:text-base">
          {finalTotalItems} {finalTotalItems === 1 ? "course" : "courses"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((course: Course) => {
            const courseRating = avgRating(course?.ratingAndReviews || []);
            const totalRatings = course?.ratingAndReviews?.length || 0;

            return (
              <div
                key={course._id}
                className="bg-black4 rounded-xl shadow-lg p-4 sm:p-6 border border-black6 hover:border-yellow8/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Course Thumbnail */}
                  <Link
                    to={`/allCourses/${course._id}`}
                    className="flex-shrink-0 w-full sm:w-48 h-32 rounded-lg overflow-hidden"
                  >
                    <img
                      src={course?.thumbnail || "https://via.placeholder.com/400x250"}
                      alt={course?.courseName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250";
                      }}
                    />
                  </Link>

                  {/* Course Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      {/* Category Badge */}
                      {course.category && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 bg-blue6 bg-opacity-20 text-blue5 text-xs font-medium px-2 py-1 rounded">
                            <FaTag className="text-xs" />
                            {course.category.name}
                          </span>
                        </div>
                      )}

                      {/* Course Title */}
                      <Link to={`/allCourses/${course._id}`}>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 hover:text-yellow8 transition-colors line-clamp-2">
                          {course?.courseName}
                        </h3>
                      </Link>

                      {/* Instructor */}
                      {course?.instructor && (
                        <p className="text-sm text-black7 mb-3">
                          By {course.instructor.firstName} {course.instructor.lastName}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <RatingStars Review_Count={courseRating} Star_Size={14} />
                          <span className="text-sm font-semibold text-white ml-1">
                            {courseRating.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        {totalRatings > 0 && (
                          <span className="text-xs text-black7">
                            ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
                          </span>
                        )}
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-xs text-black7">
                        {course.studentsEnrolled && course.studentsEnrolled.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FaUsers className="text-sm" />
                            <span>{course.studentsEnrolled.length} students</span>
                          </div>
                        )}
                        {course.courseContent && course.courseContent.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FaBook className="text-sm" />
                            <span>{course.courseContent.length} sections</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Remove Button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-black6">
                      <div>
                        <p className="text-2xl font-bold text-yellow8">
                          ₹{course?.price || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(course._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red5 bg-opacity-20 hover:bg-red5 hover:bg-opacity-30 text-red3 rounded-lg transition-all duration-300"
                        aria-label="Remove from cart"
                      >
                        <FaTrash className="text-sm" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-black4 rounded-xl shadow-lg p-6 border border-black6 sticky top-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaShoppingCart />
              <span>Order Summary</span>
            </h2>

            <div className="space-y-4 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-black7">Subtotal ({finalTotalItems} {finalTotalItems === 1 ? "course" : "courses"})</span>
                <span className="text-white font-semibold">₹{finalTotalAmount || 0}</span>
              </div>

              {/* Tax (if applicable) */}
              <div className="flex justify-between items-center text-black7">
                <span>Tax</span>
                <span>₹0</span>
              </div>

              {/* Divider */}
              <div className="border-t border-black6 my-4"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-yellow8">₹{finalTotalAmount || 0}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleBuyCourse}
              disabled={isProcessing || cart.length === 0}
              className="w-full bg-yellow8 hover:bg-yellow9 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <FaArrowRight />
                </>
              )}
            </button>

            {/* Continue Shopping Link */}
            <Link
              to="/allCourses"
              className="block mt-4 text-center text-black7 hover:text-yellow8 transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

