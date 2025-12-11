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
    <div className="w-11/12 mx-auto py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Create New <HighlightText text="Course" />
        </h1>
        <p className="text-white4 text-sm sm:text-base">
          Build and publish your course step by step. Follow the instructions to get started.
        </p>
      </div>

      {/* Form Steps with Instructions */}
      <RenderFormSteps instructions={instructions} />
    </div>
  );
}
