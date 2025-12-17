import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
import { FaUsers, FaRupeeSign } from "react-icons/fa";

Chart.register(...registerables);

interface Course {
  courseName: string;
  totalStudentsEnrolled?: number;
  totalAmountGenerated?: number;
  [key: string]: any;
}

interface InstructorChartProps {
  courses: Course[];
  totalStudents: number;
}

export default function InstructorChart({ courses, totalStudents }: InstructorChartProps) {
  const [currentChart, setCurrentChart] = useState<"students" | "income">("students");

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white4 text-lg">No course data available yet</p>
        <p className="text-white6 text-sm mt-2">
          Create courses and enroll students to see analytics
        </p>
      </div>
    );
  }

  // Modern color palette
  const colors: string[] = [
    "#F59E0B", // yellow8
    "#3B82F6", // blue
    "#10B981", // green
    "#8B5CF6", // purple
    "#EF4444", // red
    "#F97316", // orange
    "#06B6D4", // cyan
    "#EC4899", // pink
  ];

  const getColors = (numColors: number): string[] => {
    const result: string[] = [];
    for (let i = 0; i < numColors; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  // Chart data for students
  const chartDataForStudent = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled || 0),
        backgroundColor: getColors(courses.length),
        borderColor: "#1F2937",
        borderWidth: 2,
      },
    ],
  };

  // Chart data for income
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated || 0),
        backgroundColor: getColors(courses.length),
        borderColor: "#1F2937",
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#E5E7EB",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#E5E7EB",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            if (currentChart === "students") {
              return `${label}: ${value} students`;
            } else {
              return `${label}: ₹${value.toLocaleString()}`;
            }
          },
        },
      },
    },
  };

  const currentData = currentChart === "students" ? chartDataForStudent : chartDataForIncome;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Course Analytics</h2>
          <p className="text-white4 text-sm">
            Visualize your course performance and earnings
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex gap-2 bg-black3 p-1.5 rounded-lg border border-black5">
          <button
            onClick={() => setCurrentChart("students")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentChart === "students"
                ? "bg-yellow8 text-black shadow-lg"
                : "text-white4 hover:text-white"
            }`}
          >
            <FaUsers /> Students
          </button>
          <button
            onClick={() => setCurrentChart("income")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentChart === "income"
                ? "bg-yellow8 text-black shadow-lg"
                : "text-white4 hover:text-white"
            }`}
          >
            <FaRupeeSign /> Income
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-black3 rounded-lg p-6 border border-black5">
        <div className="max-w-2xl mx-auto">
          <Pie data={currentData} options={options} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black5">
        <div className="text-center sm:text-left">
          <p className="text-white4 text-sm mb-1">
            {currentChart === "students" ? "Total Students" : "Total Income"}
          </p>
          <p className="text-2xl font-bold text-yellow8">
            {currentChart === "students"
              ? totalStudents.toLocaleString()
              : `₹${courses.reduce((acc, curr) => acc + (curr.totalAmountGenerated || 0), 0).toLocaleString()}`}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-white4 text-sm mb-1">Active Courses</p>
          <p className="text-2xl font-bold text-white">{courses.length}</p>
        </div>
      </div>
    </div>
  );
}

