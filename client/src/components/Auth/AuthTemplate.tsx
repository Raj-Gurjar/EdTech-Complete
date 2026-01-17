import React, { useState, useRef, useEffect } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleAuth } from "../../services/operations/authAPI";
import axios from "axios";
import AuthVisual from "./AuthVisual";
import { ACCOUNT_TYPE } from "../../utils/constants";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import HighlightText from "../../user interfaces/HighlightText";

interface AuthTemplateProps {
  title: string;
  desc1: string;
  desc2: string;
  sideImg: string;
  formType: "login" | "signup";
  setIsLoggedIn?: (value: boolean) => void;
}

export default function AuthTemplate({
  title,
  desc1,
  desc2,
  sideImg,
  formType,
  setIsLoggedIn,
}: AuthTemplateProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleAccountType, setGoogleAccountType] = useState<string>("Student");
  const [signupAccountType, setSignupAccountType] = useState<string>("Student");
  const [adminKey, setAdminKey] = useState<string>("");
  const [showAdminKey, setShowAdminKey] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google using the access token
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        
        // Create a credential-like object or send user info directly
        // For now, we'll send the access_token and user info to backend
        // The backend can verify the token with Google
        const credentialData = {
          access_token: tokenResponse.access_token,
          user: {
            email: userInfo.email,
            given_name: userInfo.given_name,
            family_name: userInfo.family_name,
            picture: userInfo.picture,
            sub: userInfo.sub,
          },
          // Include account type and admin key for signup flow
          accountType: formType === "signup" ? googleAccountType : undefined,
          adminKey: formType === "signup" && googleAccountType === ACCOUNT_TYPE.ADMIN ? adminKey : undefined,
        };

        // Send to backend - backend will verify and create/login user
        dispatch(googleAuth(credentialData, navigate) as any);
      } catch (error) {
        console.error("Failed to fetch user info from Google", error);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  return (
    <div className="w-11/12 max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 relative z-10">
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
        {/* Left Side - Form Section */}
        <div className="w-full lg:w-1/2 flex-shrink-0">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-white4 text-sm sm:text-base leading-relaxed">
              <span>{desc1}</span>
              <br />
              <span className="text-purple6 italic">{desc2}</span>
            </p>
          </div>

          <div 
            className="rounded-xl border p-6 sm:p-8 shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
              {formType === "login" ? (
                "Log In"
              ) : (
                <>
                  Create Account as <HighlightText text={signupAccountType} textSize="text-xl sm:text-2xl" />
                </>
              )}
            </h2>

            {formType === "signup" ? (
              <SignupForm 
                setIsLoggedIn={setIsLoggedIn} 
                accountType={signupAccountType}
                setAccountType={setSignupAccountType}
              />
            ) : (
              <LoginForm />
            )}

            {/* Divider */}
            <div className="flex w-full items-center gap-x-3 my-6">
              <div className="h-[1px] flex-1 bg-black5"></div>
              <p className="text-white4 font-medium text-sm">OR</p>
              <div className="h-[1px] flex-1 bg-black5"></div>
            </div>

            {/* Google Sign In Button with Dropdown */}
            <div className="flex gap-2">
              {/* Google Sign In Button */}
              <button
                onClick={() => {
                  if (formType === "signup" && googleAccountType === ACCOUNT_TYPE.ADMIN && !adminKey) {
                    toast.error("Please enter the admin secret key");
                    return;
                  }
                  handleGoogleLogin();
                }}
                className="flex-1 flex justify-center items-center gap-x-2 rounded-[10px] py-3 px-6 text-white font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(2.5px)',
                  WebkitBackdropFilter: 'blur(2.5px)',
                  borderWidth: '0px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                  fontWeight: 500,
                  letterSpacing: '-0.5px',
                  lineHeight: '26px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <FcGoogle className="text-2xl" />
                <span className="text-sm sm:text-base">
                  {formType === "login" ? "Sign In" : "Sign Up"} with Google
                </span>
              </button>

              {/* Account Type Dropdown - Only for Signup */}
              {formType === "signup" && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-4 py-3 rounded-[10px] text-white font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 border border-white/10 bg-black3 hover:bg-black4"
                    style={{
                      fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                      fontWeight: 500,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    <span className="text-sm sm:text-base capitalize">{googleAccountType}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-black2 border border-black5 rounded-lg shadow-xl z-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleAccountType(ACCOUNT_TYPE.STUDENT);
                          setShowAdminKey(false);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          googleAccountType === ACCOUNT_TYPE.STUDENT
                            ? "bg-purple6/20 text-purple6"
                            : "text-white4 hover:text-white hover:bg-black3"
                        }`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleAccountType(ACCOUNT_TYPE.INSTRUCTOR);
                          setShowAdminKey(false);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          googleAccountType === ACCOUNT_TYPE.INSTRUCTOR
                            ? "bg-purple6/20 text-purple6"
                            : "text-white4 hover:text-white hover:bg-black3"
                        }`}
                      >
                        Instructor
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleAccountType(ACCOUNT_TYPE.ADMIN);
                          setShowAdminKey(true);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          googleAccountType === ACCOUNT_TYPE.ADMIN
                            ? "bg-purple6/20 text-purple6"
                            : "text-white4 hover:text-white hover:bg-black3"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Key Input - Only shown when Admin is selected */}
            {formType === "signup" && showAdminKey && googleAccountType === ACCOUNT_TYPE.ADMIN && (
              <div className="mt-4">
                <label htmlFor="google-admin-key" className="text-sm font-medium text-white mb-2 block">
                  Admin Secret Key <span className="text-red2">*</span>
                </label>
                <input
                  id="google-admin-key"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin secret key"
                  className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors text-sm sm:text-base"
                />
              </div>
            )}

            {/* Switch between Login/Signup */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <p className="text-white4 text-sm sm:text-base">
                {formType === "login"
                  ? "Not Registered Yet?"
                  : "Already Signed Up?"}
              </p>
              <Link to={formType === "login" ? "/signup" : "/login"}>
                <button className="text-purple6 text-sm sm:text-base font-semibold hover:text-purple5 underline transition-colors">
                  {formType === "login" ? "Sign Up Now" : "Log In Now"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div className="relative max-w-full lg:max-w-[500px] w-full">
            <AuthVisual />
          </div>
        </div>
      </div>
    </div>
  );
}

