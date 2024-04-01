import React from "react";
import { NavbarLinks } from "../../data/Navbar-links";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";
import { useSelector } from "react-redux";
import { BsCart3 } from "react-icons/bs";
import ProfileDropDown from "./ProfileDropDown";
import { IoSearch } from "react-icons/io5";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <div className=" bg-red-400 fixed z-50 max-w-maxContent w-[100%]  flex h-14 items-center justify-center border-b-[1px] border-b-black-700">
      <div className="navbar  flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">Logo</Link>

        <nav>
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, index) => (
              <NavLink to={link?.path} key={index}>
                <li>
                  {link.title === "Catalogs" ? (
                    <div></div>
                  ) : (
                    <p className="text-yellow-900">{link.title}</p>
                  )}
                </li>
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* //! Log In /SignUp / DashBoard */}
        <div className="dynamic-buttons ">
          {token === null && (
            <div className="auth-buttons flex gap-x-5">
              <NavLink to="/login">
                <button>Login</button>
              </NavLink>
              <NavLink to="/signup">
                <button>Sign Up</button>
              </NavLink>
            </div>
          )}
          {token !== null && (
            <div className="flex gap-x-5">
              <IoSearch className="text-xl" />

              {user && (
                // user?.accountType === "Student"

                <Link to="/dashboard/cart" className="relative flex">
                  <BsCart3 className="text-xl" />

                  {totalItems > 0 && <span className="bg-white rounded-full px-[3px] py-[1px]">{totalItems}</span>}
                </Link>
              )}
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
