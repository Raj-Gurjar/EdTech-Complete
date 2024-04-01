import React from "react";
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

export default function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          <NavLink to="/" onClick={() => dispatch(logout(navigate))}>
            Logout
          </NavLink>
        </li>
        <li>
          <h1 className="bg-red-600">--- for students ---</h1>
        </li>
        <li>
          <NavLink to="myCart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="myCourses">My Courses</NavLink>
        </li>
        <li>
          <NavLink to="myPurchases">My Purchases</NavLink>
        </li>

        <li>
          <h1 className="bg-red-600">--- for Instructors ---</h1>
        </li>

        <li>
          <NavLink to="createCourses">Create Course</NavLink>
        </li>
      </ul>
    </div>
  );
}
