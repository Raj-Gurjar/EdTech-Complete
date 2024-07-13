import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";

import CourseCard from "../Cards/CourseCard";

export default function CourseSlider({ courses }) {

  // console.log("cc",courses);
  return (
    <div className="m-5">
      {courses?.length ? (
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
            1000: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
          }}
          className="mySwiper"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <CourseCard course={course} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No Course Found</p>
      )}
    </div>
  );
}
