import React from "react";
import img1 from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function AboutSection2() {
  return (
    <div className="my-8 sm:my-12 lg:my-16 flex flex-col mt-16 sm:mt-24 lg:mt-32 w-11/12 max-w-7xl mx-auto justify-center flex-wrap gap-12 sm:gap-16">
      {/* Founding Story Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="w-full lg:w-[45%] order-2 lg:order-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">
            <HighlightText text={"Our Founding Story"} />
          </h1>

          <div className="text-sm sm:text-base text-white4 flex gap-y-3 sm:gap-y-4 flex-col justify-start leading-relaxed">
            <p>
              EdTech was born from a simple yet powerful vision: to make quality education 
              accessible to everyone, regardless of their location or background. Founded in 2020 
              by a team of passionate educators and technologists, we recognized the growing need 
              for flexible, high-quality online learning solutions.
            </p>
            <p>
              What started as a small platform with a handful of courses has grown into a thriving 
              community of learners, instructors, and educational partners. Our journey has been 
              marked by continuous innovation, listening to our community, and staying true to our 
              mission of democratizing education. Today, we're proud to serve thousands of students 
              and work with hundreds of expert instructors worldwide.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[45%] order-1 lg:order-2">
          <img 
            src={img1} 
            alt="Our founding story" 
            className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[400px] lg:max-h-[500px]" 
          />
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[45%]">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">
            <HighlightText text={"Our Mission"} />
          </h1>

          <div className="text-sm sm:text-base text-white4 flex gap-y-3 sm:gap-y-4 flex-col justify-start leading-relaxed">
            <p>
              Our mission is to empower individuals worldwide to achieve their learning goals through 
              accessible, high-quality online education. We strive to break down barriers to education 
              by providing flexible learning paths, expert instruction, and comprehensive support. 
              We're committed to creating an inclusive learning environment where everyone can thrive 
              and reach their full potential.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-[45%]">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">
            <HighlightText text={"Our Vision"} />
          </h1>

          <div className="text-sm sm:text-base text-white4 flex gap-y-3 sm:gap-y-4 flex-col justify-start leading-relaxed">
            <p>
              We envision a world where quality education is universally accessible, personalized, 
              and transformative. Our goal is to become the leading platform that bridges the gap 
              between learners and knowledge, fostering a global community of lifelong learners. 
              Through innovation and dedication, we aim to shape the future of education and inspire 
              millions to pursue their passions and career aspirations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

