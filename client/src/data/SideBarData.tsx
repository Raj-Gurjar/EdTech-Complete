import {
  FaUser,
  FaShoppingCart,
  FaBook,
  FaCogs,
  FaBookOpen,
  FaTag,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { ACCOUNT_TYPE } from "../utils/constants";
import { ReactElement } from "react";

const student = ACCOUNT_TYPE.STUDENT;
const instructor = ACCOUNT_TYPE.INSTRUCTOR;
const admin = ACCOUNT_TYPE.ADMIN;

export interface NavItem {
  label: string;
  path: string;
  icon: ReactElement;
  roles: string[];
}

export const navItems: NavItem[] = [
  {
    label: "My DashBoard",
    path: "myDashboard",
    icon: <BiSolidDashboard />,
    roles: [student, instructor, admin],
  },
  {
    label: "My Profile",
    path: "myProfile",
    icon: <FaUser />,
    roles: [student, instructor, admin],
  },
  {
    label: "Settings",
    path: "settings",
    icon: <FaCogs />,
    roles: [student, instructor, admin],
  },
  // "--- for Student ---"
  {
    label: "Cart",
    path: "myCart",
    icon: <FaShoppingCart />,
    roles: [student],
  },
  {
    label: "Enrolled Courses",
    path: "enrolledCourses",
    icon: <FaBook />,
    roles: [student],
  },
  {
    label: "My Purchases",
    path: "myPurchases",
    icon: <FaBookOpen />,
    roles: [student],
  },
  // "--- for instructor ---"
  {
    label: "Create Course",
    path: "createCourse",
    icon: <FaBook />,
    roles: [instructor],
  },
  {
    label: "My Courses Inst",
    path: "myCourses-Instructor",
    icon: <FaBookOpen />,
    roles: [instructor],
  },

  // "--- for Admin ---"
  {
    label: "All Courses",
    path: "courseMenu-admin",
    icon: <FaBook />,
    roles: [admin],
  },
  {
    label: "Category Menu",
    path: "categoryMenu",
    icon: <FaTag />,
    roles: [admin],
  },
];

