import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
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
  return (
    <div className="w-11/12 max-w-7xl mx-auto py-8 sm:py-12 lg:py-16">
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
              <span className="text-yellow8 italic">{desc2}</span>
            </p>
          </div>

          <div className="bg-black2 rounded-xl border border-black5 p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
              {formType === "login" ? "Log In" : "Create Account"}
            </h2>

            {formType === "signup" ? (
              <SignupForm setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginForm />
            )}

            {/* Divider */}
            <div className="flex w-full items-center gap-x-3 my-6">
              <div className="h-[1px] flex-1 bg-black5"></div>
              <p className="text-white4 font-medium text-sm">OR</p>
              <div className="h-[1px] flex-1 bg-black5"></div>
            </div>

            {/* Google Sign In Button */}
            <button className="w-full flex justify-center items-center rounded-lg font-medium text-white3 border border-black5 px-4 py-3 gap-x-2 hover:bg-black3 hover:border-yellow8 transition-all duration-200">
              <FcGoogle className="text-2xl" />
              <span className="text-sm sm:text-base">
                {formType === "login" ? "Sign In" : "Sign Up"} with Google
              </span>
            </button>

            {/* Switch between Login/Signup */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <p className="text-white4 text-sm sm:text-base">
                {formType === "login"
                  ? "Not Registered Yet?"
                  : "Already Signed Up?"}
              </p>
              <Link to={formType === "login" ? "/signup" : "/login"}>
                <button className="text-yellow8 text-sm sm:text-base font-semibold hover:text-yellow9 underline transition-colors">
                  {formType === "login" ? "Sign Up Now" : "Log In Now"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div className="relative max-w-full lg:max-w-[500px]">
            <img
              src={sideImg}
              alt="auth-illustration"
              className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

