import React from "react";
import AuthTemplate from "../../components/Auth/AuthTemplate";
import loginImg from "../../assets/images/home-img-1.jpg";
import signupImg from "../../assets/images/home-img-1.jpg";

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
}

export function Login({ setIsLoggedIn }: LoginProps) {
  return (
    <div>
      <AuthTemplate
        title="Welcome Back"
        desc1="Build sdfnsjd ijo sdkfldfjidkldjv dodkfj df"
        desc2="Educslfs sln as kscmasckaslkca s"
        sideImg={loginImg}
        formType="login"
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
}

export function Signup({ setIsLoggedIn }: LoginProps) {
  return (
    <div>
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

