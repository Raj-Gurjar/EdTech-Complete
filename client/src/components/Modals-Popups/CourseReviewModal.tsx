import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import { createRating } from "../../services/operations/courseDetailsAPI";
import { 
  FaStar, 
  FaSpinner
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";

interface CourseReviewModalProps {
  setReviewModal: (value: boolean) => void;
}

interface ReviewFormData {
  courseReview: string;
  courseRating: number;
}

export default function CourseReviewModal({ setReviewModal }: CourseReviewModalProps) {
  const { user } = useSelector((state: any) => state.profile);
  const { courseEntireData } = useSelector((state: any) => state.viewCourse);
  const { token } = useSelector((state: any) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>();

  useEffect(() => {
    setValue("courseReview", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const ratingChange = (newRating: number) => {
    setRating(newRating);
    setValue("courseRating", newRating);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!data.courseRating || data.courseRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createRating(
        {
          courseId: courseEntireData?._id,
          rating: data.courseRating,
          review: data.courseReview,
        },
        token
      );

      if (result) {
        toast.success("Review submitted successfully!");
        setReviewModal(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setReviewModal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black4 rounded-2xl shadow-2xl border border-black6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-black4 border-b border-black6 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Share Your Experience</h2>
            <p className="text-sm text-black7">
              Help others by sharing your thoughts about this course
            </p>
          </div>
          <button
            onClick={() => setReviewModal(false)}
            className="text-black7 hover:text-white transition-colors p-2 hover:bg-black5 rounded-lg"
            aria-label="Close modal"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Course Info */}
        <div className="p-6 border-b border-black6">
          <div className="flex items-center gap-4">
            {courseEntireData?.thumbnail && (
              <img
                src={courseEntireData.thumbnail}
                alt={courseEntireData.courseName}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x150";
                }}
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                {courseEntireData?.courseName || "Course"}
              </h3>
              <p className="text-sm text-black7">
                {courseEntireData?.instructor?.firstName} {courseEntireData?.instructor?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Rate this course <span className="text-red3">*</span>
            </label>
            <div className="flex items-center gap-4 p-4 bg-black5 rounded-lg">
              <ReactStars
                count={5}
                onChange={ratingChange}
                size={40}
                activeColor="#ffe344"
                color2="#4d4d4d"
                value={rating}
              />
              {rating > 0 && (
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow8 text-xl" />
                  <span className="text-lg font-bold text-white">{rating}</span>
                  <span className="text-sm text-black7">out of 5</span>
                </div>
              )}
            </div>
            {errors.courseRating && (
              <p className="text-red3 text-xs mt-2">Please select a rating</p>
            )}
          </div>

          {/* Review Textarea */}
          <div>
            <label htmlFor="courseReview" className="block text-sm font-semibold text-white mb-3">
              Write your review <span className="text-red3">*</span>
            </label>
            <textarea
              id="courseReview"
              placeholder="Share your experience with this course. What did you like? What could be improved? Your feedback helps other students make informed decisions."
              {...register("courseReview", { 
                required: "Please write a review",
                minLength: {
                  value: 10,
                  message: "Review must be at least 10 characters long"
                }
              })}
              rows={6}
              className="w-full px-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-yellow8 focus:border-transparent transition-all resize-none"
            />
            {errors.courseReview && (
              <p className="text-red3 text-xs mt-2">{errors.courseReview.message}</p>
            )}
            <p className="text-xs text-black7 mt-2">
              {watch("courseReview")?.length || 0} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-black6">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black5 hover:bg-black6 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-6 py-3 bg-yellow8 hover:bg-yellow9 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaStar />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

