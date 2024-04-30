import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { removeFromCart } from "../../../toolkit/slice/cartSlice";
import { buyCourse } from "../../../services/operations/paymentApi";
import { useNavigate } from "react-router-dom";

export default function MyCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  
  let totalAmount = localStorage.getItem("totalAmount");
  let totalItems = localStorage.getItem("totalItem");

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    console.log("Bought these Courses:", courses);
    buyCourse(token, courses, user, navigate, dispatch);
    //TODO : API integrate for payment gateway
  };
  console.log("cc ", cart[1]);
  return (
    <div>
      <h1 className="text-2xl">Your Cart</h1>

      <p>{totalItems} Courses in your Cart</p>

      {totalAmount === 0 ? (
        <div>
          {/* //! Can make a Empty Cart Component */}
          Nothing is in your Cart
        </div>
      ) : (
        <div>
          <section className="bg-pink-200">
            {/* //!Courses display section */}
            {cart.map((course, index) => (
              <div key={index}>
                <div>
                  Course Image:
                  <img
                    src={course?.thumbnail}
                    alt="course-thumbnail"
                    className="h-[100px] w-[200px] bg-slate-100"
                  />
                </div>

                <div>
                  <p>Course Name : {course?.courseName}</p>
                  <p>Course Category : {course?.category?.name}</p>
                </div>

                <div>
                  {/* //! Here to get average rating through backend */}
                  <ReactStars
                    count={1}
                    // onChange={ratingChanged}
                    size={24}
                    edit={false}
                    actionColor="ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaRegStar />}
                  />
                  <span>Ratings : </span>
                  <span>Rating No. : {course?.ratingAndReviews?.length}</span>
                </div>
                <div>
                  <button onClick={() => dispatch(removeFromCart(course._id))}>
                    Remove
                  </button>
                </div>
                <div>Price : {course?.price}</div>
              </div>
            ))}
          </section>

          {/* //! Total Price section */}
          <section>
            <p>Total Amount</p>
            <p>Total amount :Rs.{totalAmount}</p>
            <button onClick={handleBuyCourse}>Buy Now</button>
          </section>
        </div>
      )}
    </div>
  );
}
