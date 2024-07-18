import React, { useState } from "react";
import { SideBarLinks } from "../../data/Dashboard-links";
import { logout } from "../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import * as Icons from "react-icons/vsc";
import {
  NavLink,
  matchRoutes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Modal from "../Modals-Popups/Modal";

export default function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);

  const { user } = useSelector((state) => state.profile);

  return (
    <div>
      <ul className="bg-yellow-100 p-3">
        <li>
          <NavLink to="myDashboard">My DashBoard</NavLink>
        </li>

        <li>
          <NavLink to="myProfile">My Profile</NavLink>
        </li>
        <li>
          <NavLink to="settings">Settings</NavLink>
        </li>

        <li>
          {/* <NavLink to="/"> */}
          <button
            onClick={() => {
              setModal({
                text1: "Are You Sure ?",
                text2: "You will be logged out",
                btn1Text: "LogOut",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setModal(null),
              });
            }}
          >
            Logout
          </button>
          {/* </NavLink> */}
        </li>
        <li>
          <h1 className="bg-red-600">--- for students ---</h1>
        </li>
        <li>
          <NavLink to="myCart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="enrolledCourses">Enrolled Courses</NavLink>
        </li>
        <li>
          <NavLink to="myPurchases">My Purchases</NavLink>
        </li>

        <li>
          <h1 className="bg-red-600">--- for Instructors ---</h1>
        </li>

        <li>
          <NavLink to="instructor-DashBoard">Instr-Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="createCourse">Create Course</NavLink>
        </li>
        <li>
          <NavLink to="myCourses-Instructor">My Courses Inst</NavLink>
        </li>

        <li>
          <h1 className="bg-red-600">--- for Admin ---</h1>
        </li>
        <li>
          <NavLink to="admin-dashboard">Admin Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="categoryMenu">Category Menu</NavLink>
        </li>
      </ul>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
