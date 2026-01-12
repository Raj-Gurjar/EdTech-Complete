import { IconType } from "react-icons";
import { FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaBriefcase } from "react-icons/fa";

export interface HomeTimeLineItem {
  id: number;
  Logo: IconType;
  heading: string;
  Description: string;
}

export const HomeTimeLineSec: HomeTimeLineItem[] = [
  {
    id: 1,
    Logo: FaChalkboardTeacher,
    heading: "Expert Instructors",
    Description: "Learn from industry professionals with years of real-world experience"
  },
  {
    id: 2,
    Logo: FaLaptopCode,
    heading: "Hands-on Projects",
    Description: "Build real-world applications and build a portfolio that stands out"
  },
  {
    id: 3,
    Logo: FaCertificate,
    heading: "Certified Learning",
    Description: "Earn industry-recognized certificates upon course completion"
  },
  {
    id: 4,
    Logo: FaBriefcase,
    heading: "Career Support",
    Description: "Get job placement assistance and career guidance from experts"
  },
];
