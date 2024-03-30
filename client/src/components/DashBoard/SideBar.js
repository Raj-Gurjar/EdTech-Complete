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

  return (
    <div>
      <div className=" bg-green-300 flex min-w-[222px] flex-col border-r-[1px] border-black-700 h-[calc(100vh-3.5rem)] bg-black-400 py-10">
        <div className="flex flex-col">
          <ul>
            <li>
              <NavLink to="/myDashboard">My DashBoard</NavLink>
            </li>
            <li>
              <NavLink to="/myCourses">My Courses</NavLink>
            </li>
            <li>
              <NavLink to="/myProfile">My Profile</NavLink>
            </li>
            <li>
              <NavLink to="/myCart">Cart</NavLink>
            </li>
            <li>
              <NavLink to="/myProfile">Settings</NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                onClick={() => dispatch(logout(navigate))}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
