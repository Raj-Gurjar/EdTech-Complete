import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import Modal from "../Modals-Popups/Modal";
import { FaSignOutAlt } from "react-icons/fa"; // Importing specific icon
import { ACCOUNT_TYPE } from "../../utils/constants";
import { navItems } from "../../data/SideBarData";

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

  // Filter navItems based on user account type
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.accountType)
  );

  return (
    <div className="">
      <ul className="w-full flex gap-y-2 flex-col justify-center min-w-[222px]">
        {filteredNavItems.map((item, index) => (
          <li key={index} className="">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-yellow8 py-1 text-black2  font-bold flex items-center px-5"
                  : "flex items-center px-5 py-1"
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
