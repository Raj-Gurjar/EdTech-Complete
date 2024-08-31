import React from "react";
import { NavbarLinks } from "../../data/Navbar-links";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCart3 } from "react-icons/bs";
import ProfileDropDown from "./ProfileDropDown";
import { IoSearch } from "react-icons/io5";
import Button from "../../user interfaces/Button";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const totalItems = localStorage.getItem("totalItem");

  return (
    <div className="bg-black2 text-white fixed z-50 max-w-maxContent w-[100%] flex h-14 items-center justify-center border-b-[1px] border-b-black5">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <div className="">
          <Link to="/">Logo</Link>
        </div>
        <div className="">
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, index) => (
              <NavLink
                to={link?.path}
                key={index}
                className={({ isActive }) =>
                  isActive ? "text-yellow8 font-semibold" : "text-white"
                }
              >
                <li>
                  {link.title === "Catalogs" ? (
                    <div></div>
                  ) : (
                    <p>{link.title}</p>
                  )}
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
        {/* //! Log In /SignUp / DashBoard */}
        <div className="dynamic-buttons">
          {token === null && (
            <div className="auth-buttons flex gap-x-5">
              <Button
                btn_color={"bg-yellow8"}
                btn_name={"Login"}
                btn_link={"/login"}
                text_color={"text-black"}
                py={"py-1"}
                px={"px-3"}
              />
              <Button
                btn_color={"bg-black5"}
                btn_name={"Signup"}
                btn_link={"/signup"}
                text_color={"text-white"}
                py={"py-1"}
                px={"px-3"}
              />
            </div>
          )}

          {token !== null && (
            <div className="flex gap-x-5 items-center">
              <div>
                <IoSearch className="text-xl" />
              </div>
              <div>
                {user && (
                  <Link to="/dashboard/myCart" className="relative flex">
                    <BsCart3 className="text-xl" />
                    {totalItems > 0 && (
                      <span className="bg-white rounded-full px-[3px] py-[1px]">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </div>
              <div>
                <ProfileDropDown />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
