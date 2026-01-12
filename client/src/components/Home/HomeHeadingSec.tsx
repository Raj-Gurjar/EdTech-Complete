import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import SecondaryCTA from "../../user interfaces/SecondaryCTA";
import FramerImageEffect from "./FramerImageEffect";

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
      <div className="mt-8 sm:mt-10 lg:mt-16 mx-auto max-w-4xl px-3 sm:px-4">
        <FramerImageEffect className="w-full">
          <video 
            className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-none object-cover rounded-[19px]"
            muted 
            loop 
            autoPlay
            playsInline
            preload="auto"
          >
            <source src="https://cdn2.gro.care/e6c97ff1a07e_1768238676032.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </FramerImageEffect>
      </div>
    </div>
  );
}

