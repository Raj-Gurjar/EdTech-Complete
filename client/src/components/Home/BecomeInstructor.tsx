import React from "react";
import InstructorImg from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";

export default function BecomeInstructor() {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-purple6/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-purple6/20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
        {/* Image Section */}
        <div className="w-full lg:w-[45%] order-2 lg:order-1">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(96,_28,_255,_0.3),_0_0_20px_rgba(147,_51,_234,_0.2)]">
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
            <p className="text-sm sm:text-base text-white4 leading-relaxed max-w-md">
              Share your expertise with thousands of students worldwide. 
              Build your brand, earn income, and make an impact by teaching what you love.
            </p>
          </div>

          <div className="mt-2">
            <PrimaryCTA to="/signup" className="w-full sm:w-auto">
              Start Teaching Today
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  );
}

