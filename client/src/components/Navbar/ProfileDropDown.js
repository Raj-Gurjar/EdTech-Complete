import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileDropDown() {
  const [profile, toggleProfile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logOutHandler() {
    dispatch(logout(navigate));
  }
  return (
    <div>
      <div className="profile-pic">
        <RxAvatar
          className="text-xl cursor-pointer hover:bg-green-200"
          onClick={() => toggleProfile(!profile)}
        />
      </div>
      {profile && (
        <ul className="profile-dropDown bg-slate-500 absolute top-[50px] right-5">
          <li>
            <Link to="/dashboard">DashBoard</Link>
          </li>
          <li>
            <Link to="/dashboard">Edit Profile</Link>
          </li>
          <li>
            <Link to="/dashboard">Setting</Link>
          </li>
          <li>
            <Link to="/" onClick={logOutHandler}>
              LogOut
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
