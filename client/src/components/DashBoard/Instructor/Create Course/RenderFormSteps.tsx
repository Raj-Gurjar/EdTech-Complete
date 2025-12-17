import React from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaLightbulb } from "react-icons/fa";
import CourseInfoForm from "./CourseInfo/CourseInfoForm";
import CourseBuilder from "./CourseBuilder/CourseBuilder";
import CoursePublish from "./CoursePublish";
import CourseDraft from "./CourseBuilder/CourseDraft";
import { RootState } from "../../../../toolkit/reducer";

interface Instruction {
  icon: React.ReactElement;
  text: string;
}

interface RenderFormStepsProps {
  instructions?: Instruction[];
}

interface Step {
  id: number;
  title: string;
  description: string;
}

export default function RenderFormSteps({ instructions = [] }: RenderFormStepsProps) {
  const { step } = useSelector((state: RootState) => state.course);

  const steps: Step[] = [
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
      {step === 1 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Information Form - 60% on desktop */}
          <div className="w-full lg:w-[80%] order-2 lg:order-1">
            <div className="bg-black2 rounded-xl p-6 sm:p-8 border border-black5 shadow-lg">
              <CourseInfoForm />
            </div>
          </div>

          {/* Quick Instructions - 30% on desktop, on top on mobile */}
          {instructions.length > 0 && (
            <div className="w-full lg:w-[30%] order-1 lg:order-2">
              <div className="bg-gradient-to-br from-black3 to-black4 rounded-xl p-6 border border-black5 shadow-lg lg:sticky lg:top-24">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow8" />
                  Quick Instructions
                </h2>
                <ul className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-white3 text-sm"
                    >
                      <span className="mt-1 flex-shrink-0">
                        {instruction.icon}
                      </span>
                      <span>{instruction.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-black2 rounded-xl p-6 sm:p-8 border border-black5 shadow-lg">
          {step === 2 && <CourseBuilder />}
          {step === 3 && <CourseDraft />}
        </div>
      )}
    </div>
  );
}

