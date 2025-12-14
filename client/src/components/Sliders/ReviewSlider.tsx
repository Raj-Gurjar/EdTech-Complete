import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";

import { getAllReviews } from "../../services/operations/courseDetailsAPI";
import ReviewCard from "../Cards/ReviewCard";
import HighlightText from "../../user interfaces/HighlightText";

interface ReviewSliderProps {
  reviewData?: any[];
}

export default function ReviewSlider({ reviewData }: ReviewSliderProps) {
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div className="mx-auto m-11/12 mt-[100px]">
      <div>
        <h1 className="text-3xl font-bold">Reviews from our <HighlightText text={"Learners"}/></h1>
      </div>
      {/* {reviewsData?.length ? (
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
        <p className="text-xl mt-10">No Reviews Found</p>
      )} */}
    </div>
  );
}

