import React, { useState } from "react";

import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

export default function InstructorChart({ courses }) {
  let [currentChart, setCurrentChart] = useState("students");

  console.log("cc", courses);

  if (!courses || courses.length === 0) {
    return <div>No data available</div>;
  }

  const getRandomColors = (numColors) => {
    const colors = [];

    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )},${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  //create data for chart displaying student info
  const chartDataForStudent = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };
  console.log("ff", chartDataForStudent);

  //create data for chart displaying income info
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  //create options
  const options = {};

  return (
    <div>
      <h1>Visualize</h1>

      <div className="flex gap-x-5">
        <button
          onClick={() => setCurrentChart("students")}
          className={`${
            currentChart === "students" ? "bg-yellow-400" : "bg-white"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setCurrentChart("income")}
          className={`${
            currentChart === "income" ? "bg-yellow-400" : "bg-white"
          }`}
        >
          Income
        </button>
      </div>

      <div>
        <Pie
          data={
            currentChart === "students"
              ? chartDataForStudent
              : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
}
