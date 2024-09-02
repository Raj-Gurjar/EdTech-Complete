import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import Modal from "../Modals-Popups/Modal";

export default function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const { user } = useSelector((state) => state.profile);

  const handleLogout = () => {
    setModal({
      text1: "Are You Sure?",
      text2: "You will be logged out",
      btn1Text: "LogOut",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(logout(navigate)),
      btn2Handler: () => setModal(null),
    });
  };

  const navItems = [
    { label: "My DashBoard", path: "myDashboard" },
    { label: "My Profile", path: "myProfile" },
    { label: "Settings", path: "settings" },
    { label: "--- for students ---", isHeader: true },
    { label: "Cart", path: "myCart" },
    { label: "Enrolled Courses", path: "enrolledCourses" },
    { label: "My Purchases", path: "myPurchases" },
    { label: "--- for Instructors ---", isHeader: true },
    { label: "Instr-Dashboard", path: "instructor-DashBoard" },
    { label: "Create Course", path: "createCourse" },
    { label: "My Courses Inst", path: "myCourses-Instructor" },
    { label: "--- for Admin ---", isHeader: true },
    { label: "Admin Dashboard", path: "admin-dashboard" },
    { label: "All Courses", path: "courseMenu-admin" },
    { label: "Category Menu", path: "categoryMenu" },
  ];

  return (
    <div>
      <ul className="bg-yellow-100 p-3 w-full">
        {navItems.map((item, index) =>
          item.isHeader ? (
            <li key={index} className="bg-red-600">
              {item.label}
            </li>
          ) : (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "bg-yellow5 text-black2 font-bold w-full" : ""
                }
              >
                {item.label}
              </NavLink>
            </li>
          )
        )}
        <li>
          <button onClick={handleLogout} className="w-full text-left">
            Logout
          </button>
        </li>
      </ul>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
