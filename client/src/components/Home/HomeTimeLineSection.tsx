import React from "react";
import { HomeTimeLineSec } from "../../data/HomeTimeLineData";
import TimeLineImg from "../../assets/images/home-img-1.jpg";
import FramerImageEffect from "./FramerImageEffect";

export default function HomeTimeLineSection() {
  const items_length = HomeTimeLineSec.length;
  return (
    <div className="my-12 sm:my-16 lg:my-20">
      <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
        {/* Timeline Items */}
        <div className="w-full lg:w-[45%] flex flex-col items-start gap-6 sm:gap-8 p-4 sm:p-6">
          {HomeTimeLineSec.map((item, index) => (
            <div
              key={item.id}
              className="flex gap-4 sm:gap-6 justify-center align-middle items-start w-full"
            >
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-purple6/20 backdrop-blur-sm border border-purple6/50 rounded-full p-2 sm:p-2.5 flex items-center justify-center shadow-md shadow-purple6/30">
                  <item.Logo className="text-purple6 text-xl sm:text-2xl" />
                </div>
                {/* Dotted Line */}
                {index < items_length - 1 && (
                  <div className="absolute left-1/2 top-12 sm:top-14 transform -translate-x-1/2 w-0.5 h-12 sm:h-16 bg-purple6/50 border-l border-dotted border-purple6/30 z-0"></div>
                )}
              </div>

              <div className="flex flex-col items-start gap-1 sm:gap-2 flex-1 pt-1">
                <p className="text-base sm:text-lg font-semibold text-white">{item.heading}</p>
                <p className="text-sm sm:text-base text-white4 leading-relaxed">{item.Description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Image and Stats Section */}
        <div className="w-full lg:w-[45%] relative">
          <FramerImageEffect className="w-full">
            <img
              src={TimeLineImg}
              alt="timeline-sec-img"
              className="w-full h-auto max-h-[400px] object-cover rounded-[19px]"
            />
          </FramerImageEffect>

          {/* Stats Card */}
          <div className="bg-purple7/90 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-center py-4 sm:py-5 px-4 sm:px-6 gap-3 sm:gap-4 text-white uppercase w-[90%] sm:w-[80%] -mt-8 sm:-mt-12 lg:-mt-16 left-1/2 transform -translate-x-1/2 absolute rounded-lg sm:rounded-xl shadow-[rgba(96,_28,_255,_0.4)_0px_20px_30px_-10px]">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">10+</h1>
              <p className="text-white4 text-xs sm:text-sm text-center sm:text-left">Years of Experience</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white6"></div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">250+</h1>
              <p className="text-white4 text-xs sm:text-sm text-center sm:text-left">Types of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

