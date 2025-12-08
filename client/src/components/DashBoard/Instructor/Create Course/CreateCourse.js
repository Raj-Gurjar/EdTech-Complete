import React from "react";
import RenderFormSteps from "./RenderFormSteps";
import HighlightText from "../../../../user interfaces/HighlightText";
import { FaBook, FaInfoCircle, FaLightbulb } from "react-icons/fa";

export default function CreateCourses() {
  const instructions = [
    {
      icon: <FaInfoCircle className="text-yellow8" />,
      text: "Fill in all required course information accurately",
    },
    {
      icon: <FaBook className="text-yellow8" />,
      text: "Add at least one section with lectures in the course builder",
    },
    {
      icon: <FaLightbulb className="text-yellow8" />,
      text: "Review your course before publishing to ensure quality",
    },
    {
      icon: <FaInfoCircle className="text-yellow8" />,
      text: "You can save as draft and continue editing later",
    },
    {
      icon: <FaBook className="text-yellow8" />,
      text: "Make sure to add clear descriptions and learning objectives",
    },
  ];

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Create New <HighlightText text="Course" />
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Build and publish your course step by step. Follow the instructions below to get started.
        </p>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 mb-8 border border-black5 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FaLightbulb className="text-yellow8" />
          Quick Instructions
        </h2>
        <ul className="space-y-3">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-3 text-white3 text-sm sm:text-base">
              <span className="mt-1">{instruction.icon}</span>
              <span>{instruction.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form Steps */}
      <div>
        <RenderFormSteps />
      </div>
    </div>
  );
}
