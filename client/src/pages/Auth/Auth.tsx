import React from "react";
import AuthTemplate from "../../components/Auth/AuthTemplate";
import loginImg from "../../assets/images/home-img-1.jpg";
import signupImg from "../../assets/images/home-img-1.jpg";
import "../Home/Home.scss";

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
}

export function Login({ setIsLoggedIn }: LoginProps) {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>
      <AuthTemplate
        title="Welcome Back"
        desc1="Build skills for tomorrow's opportunities"
        desc2="Continue your learning journey with us"
        sideImg={loginImg}
        formType="login"
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
}

export function Signup({ setIsLoggedIn }: LoginProps) {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>
      <AuthTemplate
        title="Join Us Today"
        desc1="Create your account and start your learning journey."
        desc2="Get access to all the resources and community support."
        sideImg={signupImg}
        formType="signup"
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
}

