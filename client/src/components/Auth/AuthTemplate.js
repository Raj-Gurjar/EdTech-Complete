import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function AuthTemplate({
  title,
  desc1,
  desc2,
  sideImg,
  formType,
  setIsLoggedIn,
}) {
  return (
    <div className="w-9/12 flex justify-between mx-auto mx-w-maxContent pt-[5%] gap-9 p-5">
      <div className="w-[45%]">
        <h1 className="text-white font-semibold text-[1.875rem] leading-[1.3rem]">
          {title}
        </h1>
        <p className="text-[14px] leading[1.625rem] mt-4">
          <span className="text-white3">{desc1}</span>
          <br />
          <span className="text-blue7 italic">{desc2}</span>
        </p>

        <h2 className="text-xl font-semibold mt-3">{
            formType === "login" ? "Log In" :"Sign Up"}</h2>

        {formType === "signup" ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}

        <div className="flex w-full items-center  gap-x-2 my-3">
          <div className="h-[1px] w-full bg-black5"></div>
          <p className="text-white4 font-medium leading-2">OR</p>
          <div className="h-[1px] w-full bg-black5"></div>
        </div>

        <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-white3 border border-black4 px-[12px] py-[8px] gap-x-2 ">
          <p className="text-[18px]">
            <FcGoogle />
          </p>

          <p>Sign Up with Google</p>
        </button>

        <div className="mt-5 flex justify-between">
          <div>
            <h5 className="text-[15px]">
              {" "}
              {formType === "login"
                ? "Not Registered Yet?"
                : "Already Signed Up?"}
            </h5>
          </div>
          <div>
            <Link to={formType === "login" ? "/signup" : "/login"}>
              <button className="text-blue6 text-[15px] font-semibold underline hover:text-blue3">
                {formType === "login" ? "Sign Up Now" : "Log In Now"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-[45%] relative max-w-[500px]">
        {/* <img src={frameImg} alt="frame-img"
        width={558}
        height={504}
        loading="lazy" /> */}

        <img
          src={sideImg}
          alt="auth-img1"
          width={558}
          height={490}
          loading="lazy"
          //   className="absolute -top-4 right-4"
        />
      </div>
    </div>
  );
}
