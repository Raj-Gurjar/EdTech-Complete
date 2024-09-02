import React from "react";

export default function AboutSection3() {
  const achievements = [
    { number: "5K", label: "Lessons" },
    { number: "10K", label: "Students" },
    { number: "500+", label: "Courses" },
    { number: "1M+", label: "Hours watched" },
  ];

  return (
    <div className=" my-[70px] flex  bg-black justify-around p-3 items-center">
      {achievements.map((achievement, index) => (
        <div key={index} className="text-center">
          <h1 className="text-3xl font-bold">{achievement.number}</h1>
          <h2 className="text-[16px] text-white6">{achievement.label}</h2>
        </div>
      ))}
    </div>
  );
}
