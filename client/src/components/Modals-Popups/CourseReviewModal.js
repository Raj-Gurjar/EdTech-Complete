import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import { createRating } from "../../services/operations/courseDetailsAPI";

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseReview", "");
    setValue("courseRating", 0);
  }, []);

  const ratingChange = (newRating) => {
    setValue("courseRating", newRating);
  };

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData?._id,
        rating: data.courseRating,
        review: data.courseReview,
      },
      token
    );

    setReviewModal(false);
  };
  return (
    <div className="flex flex-col p-4 bg-[#0000005d] absolute m-auto top-[50%] left-[50%] translate-[50%] justify-center align-middle">
      <div>
        <h1>Add Review</h1>
        <button onClick={() => setReviewModal(false)}>x</button>
      </div>

      <div>
        User Profile pic :
        <img
          src={user?.profileImage}
          alt="user-profile-pic"
          className="aspect-square w-[50px] rounded-full object-cover"
        />
        <span>
          {user?.firstName} {user?.lastName}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <ReactStars
          count={5}
          onChange={ratingChange}
          size={24}
          activeColor="#ffd700"
        />

        <div>
          <label htmlFor="courseReview">Add Your Review</label>
          <textarea
            name=""
            id="courseReview"
            placeholder="Add Your Experience"
            {...register("courseReview", { required: true })}
            className="form-style min-h-[130px]"
          />
          {errors.courseReview && <span>Please add your Review</span>}
        </div>

        <div>
          <button
            onClick={() => {
              setReviewModal(false);
            }}
          >
            Cancel
          </button>
          <button>Send</button>
        </div>
      </form>
    </div>
  );
}
