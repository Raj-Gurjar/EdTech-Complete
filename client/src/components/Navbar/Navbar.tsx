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
import { navItems } from "../../data/SideBarData";
import Logo from "../Logo/Logo";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import SecondaryCTA from "../../user interfaces/SecondaryCTA";

export default function Navbar() {
  const { token } = useSelector((state: any) => state.auth);
  const { user } = useSelector((state: any) => state.profile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = parseInt(localStorage.getItem("totalItem") || "0", 10);
  
  // Filter dashboard nav items based on user account type (show when logged in on mobile)
  const filteredDashboardItems = token !== null && user
    ? navItems.filter((item) => item.roles.includes(user?.accountType))
    : [];

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Don't close if clicking on hamburger button
        if (!(event.target as Element).closest('.hamburger-button')) {
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
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
      <nav 
        className="fixed z-50 w-full text-white"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'linear-gradient(180deg, rgb(19, 20, 21) 6.642384572072071%, rgba(0, 0, 0, 0.3) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: 1,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-maxContent mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          {/* Left Section: Logo and Separator */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Menu Button */}
            <button
              className="hamburger-button lg:hidden text-white hover:text-white/80 transition-colors p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <IoClose className="text-2xl" />
              ) : (
                <HiMenuAlt3 className="text-2xl" />
              )}
            </button>
            
            {/* Logo */}
            <Logo showText={true} textClassName="text-white" />
            
            {/* Separator - Gradient Line */}
            <div 
              className="hidden lg:block h-6 w-px"
              style={{
                background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
          </div>

          {/* Center Section: Navigation Links */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex gap-x-6 xl:gap-x-8">
              {NavbarLinks.map((link, index) => (
                <NavLink
                  to={link?.path}
                  key={index}
                  className={({ isActive }) =>
                    `transition-opacity duration-200 ${
                      isActive 
                        ? "opacity-100 font-medium" 
                        : "opacity-60 hover:opacity-100"
                    }`
                  }
                  style={{
                    fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                    fontWeight: 500,
                    letterSpacing: '-0.5px',
                    lineHeight: '26px',
                    color: 'rgb(255, 255, 255)',
                  }}
                >
                  <li>
                    {link.title !== "Catalogs" && (
                      <p className="text-sm xl:text-base">{link.title}</p>
                    )}
                  </li>
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Right Section: CTA Buttons and User Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* CTA Buttons - Desktop (when not logged in) */}
            {token === null && (
              <div className="hidden lg:flex items-center gap-3">
                <SecondaryCTA to="/login" className="text-md px-2 py-[8px]">
                  Login
                </SecondaryCTA>
                <PrimaryCTA to="/signup" className="text-md px-2 py-[8px]">
                  Signup
                </PrimaryCTA>
              </div>
            )}

            {/* User Actions - Desktop (when logged in) */}
            {token !== null && (
              <div className="hidden lg:flex gap-4 items-center">
                {/* Search - Desktop */}
                <div className="relative">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-1.5 pr-10 text-white text-sm w-48 lg:w-64 focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/40"
                      style={{
                        fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      <IoSearch className="text-lg" />
                    </button>
                  </form>
                </div>

                {user && user.accountType === ACCOUNT_TYPE.STUDENT && (
                  <Link 
                    to="/dashboard/myCart" 
                    className="relative flex items-center p-2 hover:bg-white/5 rounded-lg transition-colors group"
                    aria-label="Shopping cart"
                  >
                    <BsCart3 className="text-xl group-hover:text-white transition-colors" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple6 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <ProfileDropDown />
              </div>
            )}

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Search Icon - Mobile */}
              {token !== null && (
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white/80 hover:text-white transition-colors p-2"
                  aria-label="Search"
                >
                  {searchOpen ? (
                    <IoClose className="text-xl" />
                  ) : (
                    <IoSearch className="text-xl" />
                  )}
                </button>
              )}

              {/* User Actions - Mobile */}
              {token !== null && (
                <>
                  {user && user.accountType === ACCOUNT_TYPE.STUDENT && (
                    <Link 
                      to="/dashboard/myCart" 
                      className="relative flex items-center p-2"
                      aria-label="Shopping cart"
                    >
                      <BsCart3 className="text-xl" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-purple6 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  )}
                  <ProfileDropDown />
                </>
              )}

              {/* Auth Buttons - Mobile (when not logged in) */}
              {token === null && (
                <div className="flex gap-2">
                  <SecondaryCTA to="/login" className="text-xs px-4 py-2">
                    Login
                  </SecondaryCTA>
                  <PrimaryCTA to="/signup" className="text-xs px-4 py-2">
                    Signup
                  </PrimaryCTA>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && token !== null && (
          <div 
            className="absolute top-full left-0 right-0 p-4 md:hidden"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              background: 'linear-gradient(180deg, rgb(19, 20, 21) 6.642384572072071%, rgba(0, 0, 0, 0.3) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 pr-12 text-white w-full focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/40"
                style={{
                  fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                }}
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <IoSearch className="text-xl" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black1 bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-80 max-w-[85vw] bg-black2 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'linear-gradient(180deg, rgb(19, 20, 21) 6.642384572072071%, rgba(0, 0, 0, 0.95) 100%)',
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Navigation Links */}
          <nav className="flex-1 p-6">
            {/* Main Navigation Links (Home, Courses, About, Contact) */}
            <ul className="flex flex-col gap-2 mb-6">
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

            {/* Dashboard Navigation Links (shown when logged in on mobile) */}
            {token !== null && filteredDashboardItems.length > 0 && (
              <>
                <div className="border-t border-black5 my-4"></div>
                <div className="mb-4">
                  <h3 className="text-white4 text-xs font-semibold uppercase tracking-wider px-4 mb-3">
                    Dashboard
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {filteredDashboardItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={`/dashboard/${item.path}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-yellow8 text-black2 font-semibold"
                              : "text-white hover:bg-black3 hover:text-yellow8"
                          }`
                        }
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className="text-base">{item.label}</span>
                      </NavLink>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </nav>

          {/* Mobile Auth Buttons */}
          {token === null && (
            <div className="p-6 border-t border-white/10 space-y-3">
              <SecondaryCTA to="/login" className="w-full">
                Login
              </SecondaryCTA>
              <PrimaryCTA to="/signup" className="w-full">
                Signup
              </PrimaryCTA>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

