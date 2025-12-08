import React, { useState, useEffect, useRef } from "react";
import { NavbarLinks } from "../../data/Navbar-links";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCart3 } from "react-icons/bs";
import ProfileDropDown from "./ProfileDropDown";
import { IoSearch, IoClose } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import Button from "../../user interfaces/Button";
import { ACCOUNT_TYPE } from "../../utils/constants";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const totalItems = localStorage.getItem("totalItem");

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Don't close if clicking on hamburger button
        if (!event.target.closest('.hamburger-button')) {
          setMobileMenuOpen(false);
        }
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/allCourses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="bg-black2 text-white fixed z-50 w-full flex h-14 sm:h-16 items-center justify-center border-b border-black5">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              className="hamburger-button lg:hidden text-white hover:text-yellow8 transition-colors p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <IoClose className="text-2xl" />
              ) : (
                <HiMenuAlt3 className="text-2xl" />
              )}
            </button>
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-bold text-yellow8 hover:text-yellow7 transition-colors"
            >
              Logo
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex">
            <ul className="flex gap-x-6 xl:gap-x-8">
              {NavbarLinks.map((link, index) => (
                <NavLink
                  to={link?.path}
                  key={index}
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
                      isActive 
                        ? "text-yellow8 font-semibold" 
                        : "text-white hover:text-yellow8"
                    }`
                  }
                >
                  <li>
                    {link.title === "Catalogs" ? (
                      <div></div>
                    ) : (
                      <p className="text-sm xl:text-base">{link.title}</p>
                    )}
                  </li>
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Search - Desktop */}
            {token !== null && (
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black3 border border-black5 rounded-lg px-4 py-1.5 pr-10 text-white text-sm w-48 lg:w-64 focus:outline-none focus:border-yellow8 transition-colors placeholder:text-white4"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white4 hover:text-yellow8 transition-colors"
                  >
                    <IoSearch className="text-lg" />
                  </button>
                </form>
              </div>
            )}

            {/* Search Icon - Mobile */}
            {token !== null && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden text-white hover:text-yellow8 transition-colors p-2"
                aria-label="Search"
              >
                {searchOpen ? (
                  <IoClose className="text-xl" />
                ) : (
                  <IoSearch className="text-xl" />
                )}
              </button>
            )}

            {/* Auth Buttons - Desktop */}
            {token === null && (
              <div className="hidden sm:flex gap-3 lg:gap-5">
                <Button
                  btn_color={"bg-yellow8 hover:bg-yellow9"}
                  btn_name={"Login"}
                  btn_link={"/login"}
                  text_color={"text-black"}
                  py={"py-1.5"}
                  px={"px-4"}
                />
                <Button
                  btn_color={"bg-black5 hover:bg-black4"}
                  btn_name={"Signup"}
                  btn_link={"/signup"}
                  text_color={"text-white"}
                  py={"py-1.5"}
                  px={"px-4"}
                />
              </div>
            )}

            {/* User Actions - Desktop */}
            {token !== null && (
              <div className="hidden sm:flex gap-4 lg:gap-5 items-center">
                {user && user.accountType === ACCOUNT_TYPE.STUDENT && (
                  <Link 
                    to="/dashboard/myCart" 
                    className="relative flex items-center p-2 hover:bg-black3 rounded-lg transition-colors group"
                    aria-label="Shopping cart"
                  >
                    <BsCart3 className="text-xl group-hover:text-yellow8 transition-colors" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow8 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <ProfileDropDown />
              </div>
            )}

            {/* User Actions - Mobile (in hamburger menu) */}
            {token !== null && (
              <div className="sm:hidden flex items-center gap-3">
                {user && user.accountType === ACCOUNT_TYPE.STUDENT && (
                  <Link 
                    to="/dashboard/myCart" 
                    className="relative flex items-center p-2"
                    aria-label="Shopping cart"
                  >
                    <BsCart3 className="text-xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow8 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <ProfileDropDown />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && token !== null && (
          <div className="absolute top-full left-0 right-0 bg-black2 border-b border-black5 p-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black3 border border-black5 rounded-lg px-4 py-2.5 pr-12 text-white w-full focus:outline-none focus:border-yellow8 transition-colors placeholder:text-white4"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white4 hover:text-yellow8 transition-colors"
              >
                <IoSearch className="text-xl" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black1 bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-black2 border-r border-black5 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Navigation Links */}
          <nav className="flex-1 p-6">
            <ul className="flex flex-col gap-2">
              {NavbarLinks.map((link, index) => (
                <NavLink
                  to={link?.path}
                  key={index}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-black3 text-yellow8 font-semibold"
                        : "text-white hover:bg-black3 hover:text-yellow8"
                    }`
                  }
                >
                  {link.title !== "Catalogs" && (
                    <li className="text-base">{link.title}</li>
                  )}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Mobile Auth Buttons */}
          {token === null && (
            <div className="p-6 border-t border-black5 space-y-3">
              <Button
                btn_color={"bg-yellow8 hover:bg-yellow9"}
                btn_name={"Login"}
                btn_link={"/login"}
                text_color={"text-black"}
                py={"py-2.5"}
                px={"px-4"}
              />
              <Button
                btn_color={"bg-black5 hover:bg-black4"}
                btn_name={"Signup"}
                btn_link={"/signup"}
                text_color={"text-white"}
                py={"py-2.5"}
                px={"px-4"}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
