import React from "react";
import { NavbarLinks } from "../../data/Navbar-links";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <div className="bg-red-400 flex h-14 items-center justify-center border-b-[1px] border-b-black-700">
      <div className="navbar flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">Logo</Link>

        <nav>
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, index) => (
              <NavLink to={link?.path}>
                <li key={index}>
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

        <div className="dynamic-buttons ">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/login">Login</NavLink>
        </div>
      </div>
    </div>
  );
}
