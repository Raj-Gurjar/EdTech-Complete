import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseInfoForm from "./CourseInfo/CourseInfoForm";
import CourseBuilder from "./CourseBuilder/CourseBuilder";
import CoursePublish from "./CoursePublish";

export default function RenderFormSteps() {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];
  return (
    <div>
      <div className="bg-red-500 flex">
        <div className="">
          {steps.map((item, index) => (
            <div key={index}>
              <div
                className={`${
                  step === item.id ? "bg-yellow-500" : "bg-slate-500"
                }`}
              >
                {step > item.id ? <FaCheck /> : item.id}
              </div>
            </div>
          ))}
        </div>
        <div>
          {steps.map((item, index) => (
            <div key={index}>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && <CourseInfoForm />}
      {step === 2 && <CourseBuilder />}
      {step === 3 && <CoursePublish />}
    </div>
  );
}
