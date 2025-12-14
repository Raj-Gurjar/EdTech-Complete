import React, { useEffect, useState, useRef } from "react";
import HighlightText from "../../user interfaces/HighlightText";
import Button from "../../user interfaces/Button";

interface Feature {
  id: number;
  heading: string;
  highlightText?: string;
  description: string;
  button?: {
    btn_color: string;
    btn_name: string;
    btn_link: string;
  };
}

export default function AboutSection4() {
  const features: Feature[] = [
    {
      id: 0,
      heading: "World Class Learning for",
      highlightText: "Anyone, Anywhere",
      description:
        "We partner with over 25+ universities and organizations worldwide, offering diverse courses and flexible learning paths to help you achieve your educational and professional goals anytime, anywhere.",
      button: {
        btn_color: "bg-yellow8",
        btn_name: "Learn More",
        btn_link: "/about",
      },
    },
    {
      id: 1,
      heading: "Certification",
      description:
        "Earn industry-recognized certificates upon course completion, enhancing your resume and proving your expertise in various subjects.",
    },
    {
      id: 2,
      heading: "Ready to Work",
      description:
        "Get job-ready with our practical, skills-based courses designed to prepare you for real-world challenges in your chosen field.",
    },
    {
      id: 3,
      heading: "Our Learning Method",
      description:
        "Experience personalized learning paths that adapt to your progress, ensuring you grasp concepts at your own pace.",
    },
    {
      id: 4,
      heading: "Expert Instructors",
      description:
        "Learn from industry professionals with years of experience, providing you with the knowledge and insights to excel.",
    },
    {
      id: 5,
      heading: "Interactive Courses",
      description:
        "Engage with course content through quizzes, assignments, and discussions to deepen your understanding and retention.",
    },
  ];

  const [minHeight, setMinHeight] = useState<number>(0);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (featureRef.current) {
      setMinHeight(featureRef.current.clientHeight);
    }
  }, []);

  return (
    <div className="">
      <div className="grid mx-auto grid-cols-1 lg:grid-cols-4 mb-10 w-11/12">
        {features.map((i) => (
          <div
            key={i.id}
            ref={i.id === 0 ? featureRef : null}
            className={`${i.id === 0 && "lg:col-span-2"} ${
              i.id % 2 === 1 ? "bg-black4" : "bg-black2"
            } ${i.id === 3 && "lg:col-start-2"}`}
          >
            {i.id === 0 ? (
              <div className="bg-black3 p-5">
                <h1 className="text-2xl font-bold">{i.heading}</h1>
                <h2 className="text-2xl font-bold">
                  <HighlightText text={i.highlightText || ""} />
                </h2>
                <p className="text-[14px] my-4">{i.description}</p>
                <div>
                  {i.button && (
                    <Button
                      btn_color={i.button.btn_color}
                      btn_name={i.button.btn_name}
                      btn_link={i.button.btn_link}
                      text_size={"text-[13px]"}
                      text_color={"text-black"}
                      px={"px-4"}
                      py={"py-2"}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-5 min-h-[${minHeight}px]`}>
                <h1 className="text-xl font-semibold mb-4">{i.heading}</h1>
                <p className="text-[14px] text-white3">{i.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

