/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import FramerImageEffect from "../../components/Home/FramerImageEffect";

export default function AboutSection1() {
  // Array of image data - using Unsplash images for online education theme
  const images: string[] = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <div className="flex justify-center flex-col text-center items-center pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="w-11/12 max-w-6xl items-center relative">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          <h1 className="text-white mb-2">Driving Innovation in Online Education for a</h1>
          <h2>
            <HighlightText text={"Bright Future"} textSize={"text-2xl sm:text-3xl lg:text-4xl"} />
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
          <FramerImageEffect
            key={index}
            className="flex-1 min-w-[150px] sm:min-w-[200px] max-w-[300px]"
          >
            <img 
              src={image} 
              alt={`About us image ${index + 1}`}
              className="w-full h-auto object-cover rounded-[19px]"
            />
          </FramerImageEffect>
        ))}
      </div>
    </div>
  );
}

