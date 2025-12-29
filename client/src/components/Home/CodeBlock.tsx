import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

interface CodeBlockProps {
  position: string;
  title: string;
  text: string;
  btn1: string;
  btn2: string;
  codeText: string;
  bgGradient?: string;
}

export default function CodeBlock({
  position,
  title,
  text,
  btn1,
  btn2,
  codeText,
  bgGradient = "",
}: CodeBlockProps) {
  const num: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className={`flex ${position} items-center gap-6 sm:gap-8 lg:gap-12`}>
      {/* Text Content */}
      <div className="w-full lg:w-[50%] flex flex-col gap-4 sm:gap-6 order-2 lg:order-1">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-white4 leading-relaxed">
          {text}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link to="/allCourses">
            <button className="bg-yellow8 hover:bg-yellow9 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto shadow-md">
              {btn1}
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-black4 hover:bg-black5 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-black5 text-sm sm:text-base w-full sm:w-auto">
              {btn2}
            </button>
          </Link>
        </div>
      </div>

      {/* Code Block */}
      <div className={`w-full lg:w-[50%] h-fit flex flex-row text-xs sm:text-sm lg:text-base bg-black2 rounded-lg sm:rounded-xl overflow-hidden border border-black5 ${bgGradient} order-1 lg:order-2`}>
        {/* Line Numbers */}
        <div className="w-[10%] flex flex-col text-black7 font-inter font-bold bg-black1 px-2 sm:px-3 py-4 text-right">
          {num.map((i, ind) => (
            <p key={ind} className="leading-6">{i}</p>
          ))}
        </div>
        {/* Code Content */}
        <div className="w-[90%] text-left flex flex-col gap-2 font-mono pr-3 sm:pr-4 py-4 bg-black2">
          <TypeAnimation
            sequence={[codeText, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={false}
            style={{
              whiteSpace: "pre-line",
              display: "block",
              color: "#ffffff",
              lineHeight: "1.6",
            }}
            speed={50}
          />
        </div>
      </div>
    </div>
  );
}

