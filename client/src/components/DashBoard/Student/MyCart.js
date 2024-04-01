import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import removeFromCart from "../../../toolkit/slice/cartSlice";

export default function MyCart() {
  const dispatch = useDispatch();
  const { totalAmount, totalItems, cart } = useSelector((state) => state.cart);

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    console.log("Bought these Courses:", courses);

    //TODO : API integrate for payment gateway 
  };
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
          <section>
            {/* //!Courses display section */}
            {cart.map((course, index) => (
              <div key={index}>
                <div>
                  Course Image:
                  <img src={course?.thumbnail} alt="course-thumbnail" />
                </div>

                <div>
                  <p>Course Name : {course?.courseName}</p>
                  <p>Course Category : {course?.category?.name}</p>
                </div>

                <div>
                  {/* //! Here to get average rating through backend */}
                  <ReactStars
                    count={5}
                    // onChange={ratingChanged}
                    size={24}
                    edit={false}
                    actionColor="ffd700"
                    emptyIcon={<FaRegStar />}
                    fullIcon={<FaRegStar />}
                  />
                  <span>Ratings : 4.8 //hardCoded</span>
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
