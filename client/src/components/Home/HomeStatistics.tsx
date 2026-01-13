import React, { useEffect, useState } from "react";
import { getPublicStatistics } from "../../services/operations/profileAPI";
import { FaBook, FaUsers, FaGraduationCap, FaClock } from "react-icons/fa";

interface Statistics {
  totalLessons?: number;
  totalStudents?: number;
  totalCourses?: number;
  totalMinutes?: number;
}

const formatNumber = (num: number | undefined): string => {
  if (!num && num !== 0) return "0";
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K+`;
  }
  return num.toString();
};

const formatMinutes = (minutes: number | undefined): string => {
  if (!minutes && minutes !== 0) return "0";
  
  if (minutes >= 1000000) {
    return `${(minutes / 1000000).toFixed(1)}M+`;
  } else if (minutes >= 1000) {
    return `${(minutes / 1000).toFixed(1)}K+`;
  }
  return minutes.toString();
};

export default function HomeStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async (): Promise<void> => {
      try {
        const data = await getPublicStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    {
      icon: <FaBook className="text-3xl sm:text-4xl" />,
      value: loading ? "..." : formatNumber(statistics?.totalCourses),
      label: "Courses",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      icon: <FaUsers className="text-3xl sm:text-4xl" />,
      value: loading ? "..." : formatNumber(statistics?.totalStudents),
      label: "Students",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    {
      icon: <FaGraduationCap className="text-3xl sm:text-4xl" />,
      value: loading ? "..." : formatNumber(statistics?.totalLessons),
      label: "Lessons",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
    {
      icon: <FaClock className="text-3xl sm:text-4xl" />,
      value: loading ? "..." : `${formatMinutes(statistics?.totalMinutes)} min`,
      label: "Content",
      color: "text-purple6",
      bgColor: "bg-purple6/10",
      borderColor: "border-purple6/20",
    },
  ];

  return (
    <div className="w-11/12 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Join Thousands of Learners
        </h2>
        <p className="text-white4 text-sm sm:text-base max-w-2xl mx-auto">
          Be part of a thriving community of learners and instructors building the future together
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-black3 rounded-xl p-6 sm:p-8 border ${stat.borderColor} hover:border-opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg ${stat.bgColor}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </h3>
              <p className="text-white4 text-sm sm:text-base font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





