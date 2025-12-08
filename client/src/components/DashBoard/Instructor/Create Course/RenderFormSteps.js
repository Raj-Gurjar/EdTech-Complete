import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseInfoForm from "./CourseInfo/CourseInfoForm";
import CourseBuilder from "./CourseBuilder/CourseBuilder";
import CoursePublish from "./CoursePublish";
import CourseDraft from "./CourseBuilder/CourseDraft";

export default function RenderFormSteps() {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
      description: "Add course details and metadata",
    },
    {
      id: 2,
      title: "Course Builder",
      description: "Create sections and lectures",
    },
    {
      id: 3,
      title: "Publish Course",
      description: "Review and publish your course",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="bg-black2 rounded-xl p-6 border border-black5 shadow-lg">
        <div className="flex items-center justify-between">
          {steps.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center flex-1 relative">
                {/* Step Circle */}
                <div
                  className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                    step === item.id
                      ? "bg-yellow8 text-black scale-110 shadow-lg"
                      : step > item.id
                      ? "bg-green-600 text-white"
                      : "bg-black5 text-white4"
                  }`}
                >
                  {step > item.id ? (
                    <FaCheck className="text-lg sm:text-xl" />
                  ) : (
                    item.id
                  )}
                </div>
                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      step >= item.id ? "text-white" : "text-white4"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-white4 mt-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-[60%] w-full h-0.5 ${
                      step > item.id ? "bg-yellow8" : "bg-black5"
                    } transition-colors duration-300`}
                    style={{ width: "calc(100% - 3.5rem)" }}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-black2 rounded-xl p-6 sm:p-8 border border-black5 shadow-lg">
        {step === 1 && <CourseInfoForm />}
        {step === 2 && <CourseBuilder />}
        {step === 3 && <CourseDraft />}
      </div>
    </div>
  );
}
