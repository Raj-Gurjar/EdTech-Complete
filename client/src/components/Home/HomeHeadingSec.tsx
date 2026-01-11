import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import home_vid_1 from "../../assets/videos/home-vid-1.mp4";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import SecondaryCTA from "../../user interfaces/SecondaryCTA";

export default function HomeHeadingSec() {
  return (
    <div className="mt-6 sm:mt-8 lg:mt-12">
      {/* Heading and Description */}
      <div className="text-center space-y-4 sm:space-y-6 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
          Empower Your Future with{" "}
          <HighlightText textSize={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl"} text={"Coding Skills"} />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white4 max-w-2xl mx-auto leading-relaxed">
          Transform your career with industry-leading courses taught by experts. 
          Learn cutting-edge technologies and build the skills employers are looking for.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12 px-4">
        <PrimaryCTA to="/allCourses" className="w-full sm:w-auto">
          Browse Courses
        </PrimaryCTA>
        <SecondaryCTA to="/about" className="w-full sm:w-auto">
          Learn More
        </SecondaryCTA>
      </div>

      {/* Video Section */}
      <div className="mt-10 sm:mt-12 lg:mt-16 mx-auto max-w-4xl px-4">
        <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(96,_28,_255,_0.4),_0_0_20px_rgba(147,_51,_234,_0.3)]">
          <video 
            className="w-full h-auto"
            muted 
            loop 
            autoPlay
            playsInline
          >
            <source src={home_vid_1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

