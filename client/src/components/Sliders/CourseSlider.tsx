import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CourseCard from "../Cards/CourseCard";

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

interface CourseSliderProps {
  courses: Course[];
}

export default function CourseSlider({ courses }: CourseSliderProps) {
  // Add custom styles for Swiper
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .courseSwiper .swiper-pagination-bullet {
        background: #ffd700 !important;
        opacity: 0.5 !important;
      }
      .courseSwiper .swiper-pagination-bullet-active {
        opacity: 1 !important;
        background: #ffd700 !important;
      }
      .courseSwiper .swiper-button-next,
      .courseSwiper .swiper-button-prev {
        color: #ffd700 !important;
      }
      .courseSwiper .swiper-button-next:hover,
      .courseSwiper .swiper-button-prev:hover {
        color: #ffea57 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-black7">No courses available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        loop={courses.length > 3}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        modules={[Pagination, Autoplay, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="courseSwiper"
      >
        {courses.map((course, index) => (
          <SwiperSlide key={course._id || index}>
            <CourseCard course={course} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

