import React, { useEffect, useState } from "react";
import { getPublicStatistics } from "../../services/operations/profileAPI";

interface Achievement {
  number: string;
  label: string;
}

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

export default function AboutSection3() {
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

  const achievements: Achievement[] = [
    { 
      number: loading ? "..." : formatNumber(statistics?.totalLessons), 
      label: "Lessons" 
    },
    { 
      number: loading ? "..." : formatNumber(statistics?.totalStudents), 
      label: "Students" 
    },
    { 
      number: loading ? "..." : formatNumber(statistics?.totalCourses), 
      label: "Courses" 
    },
    { 
      number: loading ? "..." : formatNumber(statistics?.totalMinutes), 
      label: "Minutes watched" 
    },
  ];

  return (
    <div className="w-full bg-black/30 backdrop-blur-sm py-12 sm:py-16 lg:py-20 border-y border-white/10">
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-around items-center gap-6 sm:gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center flex-1 min-w-[120px] sm:min-w-[150px]">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple6 mb-2">
                {achievement.number}
              </h1>
              <h2 className="text-sm sm:text-base text-white4">{achievement.label}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

