import React from "react";
import { Link } from "react-router-dom";
import InstructorImg from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function BecomeInstructor() {
  return (
    <div className="bg-gradient-to-br from-black2 to-black3 rounded-2xl sm:rounded-3xl overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
        {/* Image Section */}
        <div className="w-full lg:w-[45%] order-2 lg:order-1">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-[-10px_-10px_20px_rgba(221,_221,_221,_0.3),_0_10px_20px_rgba(204,_204,_204,_0.3)]">
            <img 
              src={InstructorImg} 
              alt="instructor-img" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4 sm:gap-6 justify-center text-left order-1 lg:order-2">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-white">
              Become an <HighlightText text={"Instructor"} />
            </h1>
            <p className="text-sm sm:text-base text-white2 leading-relaxed max-w-md">
              Share your expertise with thousands of students worldwide. 
              Build your brand, earn income, and make an impact by teaching what you love.
            </p>
          </div>

          <div className="mt-2">
            <Link to="/signup">
              <button className="bg-yellow8 hover:bg-yellow9 text-black font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto">
                Start Teaching Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

