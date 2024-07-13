import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";

import { getAllReviews } from "../../services/operations/courseDetailsAPI";
import ReviewCard from "../Cards/ReviewCard";
// import ReactStars from "rea ct-stars";

export default function ReviewSlider({ reviewData }) {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const truncateWords = 20;

  const showAllReviews = async () => {
    setLoading(true);
    const response = await getAllReviews();

    if (response.length > 0) {
      setReviewsData(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    showAllReviews();
  }, []);

  // console.log("rdd", reviewsData);

  return (
    <div className="m-5">
      {reviewsData?.length ? (
        <Swiper
          loop={true}
          slidesPerView={1}
          spaceBetween={40}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[Pagination, Autoplay, Navigation]}
          breakpoints={{
            1000: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
          }}
          className="mySwiper"
        >
          {reviewsData.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCard data={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No Reviews Found</p>
      )}
    </div>
  );
}
