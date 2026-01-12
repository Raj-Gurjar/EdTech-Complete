import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import FramerImageEffect from "./FramerImageEffect";

interface DevelopmentCard {
  id: number;
  title: string;
  imageUrl: string;
  alt: string;
  colSpan?: string;
}

const developmentCards: DevelopmentCard[] = [
  {
    id: 1,
    title: "Frontend Development",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    alt: "Frontend development with React and modern JavaScript",
    colSpan: "",
  },
  {
    id: 2,
    title: "Backend Development",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    alt: "Backend development with Node.js and server architecture",
    colSpan: "",
  },
  {
    id: 3,
    title: "Full Stack Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    alt: "Full stack development covering frontend and backend",
    colSpan: "sm:col-span-2 lg:col-span-1",
  },
];

export default function HomeRandomImgSection() {
  return (
    <div className="mt-12 sm:mt-16 lg:mt-24 mx-auto w-full">
      {/* Heading Section */}
      <div className="text-center capitalize mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight px-4 text-white">
          Your Swiss Knife for{" "}
          <HighlightText 
            text={"learning any programming language"} 
            textSize={"text-2xl sm:text-3xl lg:text-4xl"} 
          />
        </h2>
      </div>
      
      {/* Description */}
      <div className="mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
        <p className="text-base sm:text-lg text-white4 font-medium text-center leading-relaxed">
          Master multiple programming languages and frameworks with our comprehensive curriculum. 
          From Python to JavaScript, React to Node.js - learn it all in one place.
        </p>
      </div>

      {/* Image Grid */}
      <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
        {developmentCards.map((card) => (
          <FramerImageEffect
            key={card.id}
            className={`relative group transition-all duration-300 hover:scale-105 ${card.colSpan}`}
          >
            <div className="relative rounded-[19px] overflow-hidden">
              <img 
                src={card.imageUrl} 
                alt={card.alt}
                className="w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                <p className="text-white font-semibold text-base sm:text-lg">
                  {card.title}
                </p>
              </div>
            </div>
          </FramerImageEffect>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center justify-center my-8 sm:my-10 px-4">
        <PrimaryCTA to="/allCourses">
          Explore All Courses
        </PrimaryCTA>
      </div>
    </div>
  );
}

