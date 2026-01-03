import React from "react";
import img1 from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function AboutSection1() {
  // Array of image data
  const images: string[] = [img1, img1, img1];

  return (
    <div className="bg-black4 flex justify-center flex-col text-center items-center pt-10 sm:pt-16 pb-12 sm:pb-16">
      <div className="w-11/12 max-w-6xl items-center relative">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          <h1 className="text-white mb-2">Driving Innovation in Online Education for a</h1>
          <h2>
            <HighlightText text={"Bright Future"} />
          </h2>
        </div>
        <div className="w-full sm:w-4/5 lg:w-3/4 mx-auto">
          <p className="text-sm sm:text-base text-white4 mb-8 sm:mb-10 leading-relaxed">
            At SkillScript, we're revolutionizing the way people learn online. Our platform brings together 
            world-class instructors, cutting-edge technology, and a passion for education to create 
            transformative learning experiences. We believe that quality education should be accessible 
            to everyone, anywhere, at any time.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center w-11/12 max-w-6xl gap-3 sm:gap-4 lg:gap-6 flex-wrap">
        {images.map((image, index) => (
          <div 
            key={index}
            className="flex-1 min-w-[150px] sm:min-w-[200px] max-w-[300px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={image} 
              alt={`About us image ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

