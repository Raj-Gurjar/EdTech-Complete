import React from "react";
import { Link } from "react-router-dom";
import HighlightText from "../../user interfaces/HighlightText";
import HomeTimeLineSection from "./HomeTimeLineSection";
import HomeRandomImgSection from "./HomeRandomImgSection";

export default function HomeWhiteSection() {
  return (
    <div className="bg-white text-black py-8 sm:py-12 lg:py-16">
      {/* Top CTA Section */}
      <div className="w-full max-w-maxContent mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link to="/allCourses">
            <button className="bg-yellow9 hover:bg-yellow8 text-black font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto">
              Explore Courses
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-black4 hover:bg-black5 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full max-w-maxContent mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 items-start">
          <div className="w-full lg:w-[45%]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Get the Skills for{" "}
              <HighlightText
                textSize={"text-2xl sm:text-3xl lg:text-4xl"}
                text={"Jobs that are in demand"}
              />
            </h2>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col gap-4 sm:gap-6">
            <p className="text-base sm:text-lg text-black3 leading-relaxed">
              Stay ahead of the curve with courses designed by industry experts. 
              Learn the most sought-after skills that top companies are looking for in today's job market.
            </p>
            <div>
              <Link to="/allCourses">
                <button className="bg-yellow7 hover:bg-yellow8 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="w-full max-w-maxContent mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <HomeTimeLineSection />
      </div>

      {/* Features Grid Section */}
      <div className="w-full max-w-maxContent mx-auto px-4 sm:px-6 lg:px-8">
        <HomeRandomImgSection />
      </div>
    </div>
  );
}

