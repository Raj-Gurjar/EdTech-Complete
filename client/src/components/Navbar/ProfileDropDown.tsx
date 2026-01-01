import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaTachometerAlt, 
  FaUserEdit, 
  FaCog, 
  FaSignOutAlt,
  FaShieldAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCrown
} from "react-icons/fa";

export default function ProfileDropDown() {
  const [profile, toggleProfile] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logOutHandler() {
    dispatch(logout(navigate) as any);
  }

  // Get role badge configuration
  const getRoleBadge = () => {
    const accountType = user?.accountType || "";
    
    if (accountType === "Student" || accountType === "STUDENT") {
      return {
        icon: <FaGraduationCap className="text-[10px]" />,
        bgColor: "bg-blue6",
        borderColor: "border-blue5",
      };
    } else if (accountType === "Instructor" || accountType === "INSTRUCTOR") {
      return {
        icon: <FaChalkboardTeacher className="text-[10px]" />,
        bgColor: "bg-yellow8",
        borderColor: "border-yellow7",
      };
    } else if (accountType === "Admin" || accountType === "ADMIN") {
      return {
        icon: <FaCrown className="text-[10px]" />,
        bgColor: "bg-pink6",
        borderColor: "border-pink5",
      };
    }
    
    return {
      icon: <FaShieldAlt className="text-[10px]" />,
      bgColor: "bg-black6",
      borderColor: "border-black5",
    };
  };

  const roleBadge = getRoleBadge();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleProfile(false);
      }
    }

    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profile]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="profile-pic">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile-pic"
            className="h-[40px] w-[40px] rounded-full cursor-pointer border-2 border-transparent hover:border-yellow8 transition-all duration-200 hover:scale-110 object-cover"
            onClick={() => toggleProfile(!profile)}
          />
        ) : (
          <div 
            className="h-[40px] w-[40px] rounded-full cursor-pointer border-2 border-transparent hover:border-yellow8 transition-all duration-200 hover:scale-110 bg-black5 flex items-center justify-center"
            onClick={() => toggleProfile(!profile)}
          >
            <FaUserCircle className="h-5 w-5 text-white4" />
          </div>
        )}
      </div>
      {profile && (
        <div className="absolute top-[45px] sm:top-[50px] right-0 w-64 max-w-[calc(100vw-2rem)] bg-black2 border border-black5 rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-black3 to-black4 px-4 py-3 border-b border-black5">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="h-10 w-10 rounded-full border-2 border-yellow8"
                  />
                ) : (
                  <FaUserCircle className="h-10 w-10 text-white4" />
                )}
                {/* Role Badge in Dropdown */}
                <div className={`absolute -bottom-0.5 -right-0.5 ${roleBadge.bgColor} ${roleBadge.borderColor} border rounded-full p-0.5 flex items-center justify-center shadow-md w-4 h-4`}>
                  <div className="text-white">
                    {roleBadge.icon}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-white4 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            <li>
              <Link
                to="/dashboard/myDashboard"
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-black3 transition-colors duration-150 group"
                onClick={() => toggleProfile(false)}
              >
                <FaTachometerAlt className="text-yellow8 group-hover:text-yellow7 transition-colors" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/editProfile"
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-black3 transition-colors duration-150 group"
                onClick={() => toggleProfile(false)}
              >
                <FaUserEdit className="text-yellow8 group-hover:text-yellow7 transition-colors" />
                <span className="text-sm">Edit Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-black3 transition-colors duration-150 group"
                onClick={() => toggleProfile(false)}
              >
                <FaCog className="text-yellow8 group-hover:text-yellow7 transition-colors" />
                <span className="text-sm">Settings</span>
              </Link>
            </li>
            <li className="border-t border-black5 mt-1">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  logOutHandler();
                  toggleProfile(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-red2 hover:bg-black3 transition-colors duration-150 group"
              >
                <FaSignOutAlt className="text-red2 group-hover:text-red1 transition-colors" />
                <span className="text-sm font-medium">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

