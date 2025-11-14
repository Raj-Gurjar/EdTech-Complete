import React from "react";
import { Link } from "react-router-dom";
import HighlightText from "../../user interfaces/HighlightText";
import HomeRandomImg1 from "../../assets/images/home-img-1.jpg";

export default function HomeRandomImgSection() {
  return (
    <div className="mt-12 sm:mt-16 lg:mt-20 mx-auto w-full items-center">
      {/* Heading Section */}
      <div className="text-center capitalize mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight px-4">
          Your Swiss Knife for{" "}
          <HighlightText text={"learning any programming language"} textSize={"text-2xl sm:text-3xl lg:text-4xl"} />
        </h2>
      </div>
      
      {/* Description */}
      <div className="mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
        <p className="text-base sm:text-lg text-black3 font-medium text-center leading-relaxed">
          Master multiple programming languages and frameworks with our comprehensive curriculum. 
          From Python to JavaScript, React to Node.js - learn it all in one place.
        </p>
      </div>

      {/* Image Grid */}
      <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
        <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <img 
            src={HomeRandomImg1} 
            alt="programming-language-1" 
            className="w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white font-semibold">Frontend Development</p>
          </div>
        </div>
        
        <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <img 
            src={HomeRandomImg1} 
            alt="programming-language-2" 
            className="w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white font-semibold">Backend Development</p>
          </div>
        </div>
        
        <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
          <img 
            src={HomeRandomImg1} 
            alt="programming-language-3" 
            className="w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white font-semibold">Full Stack Development</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="items-center justify-center my-8 sm:my-10 flex px-4">
        <Link to="/allCourses">
          <button className="bg-yellow8 hover:bg-yellow9 text-black font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base">
            Explore All Courses
          </button>
        </Link>
      </div>
    </div>
  );
}
