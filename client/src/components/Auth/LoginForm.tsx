import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../services/operations/authAPI";
import Loader from "../../components/Loader/Loader";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import InputBox from "../../user interfaces/InputBox";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const { email, password } = formData;
  function loginHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(login(email, password, navigate) as any);
  }
  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={loginHandler} className="flex flex-col">
          <div className="flex flex-col w-full gap-5 sm:gap-6">
            {/* Email Field */}
            <div className="flex-col flex gap-y-2">
              <InputBox
                label={"Email Address"}
                placeholder={"Enter your email address"}
                type={"email"}
                id={"email"}
                name={"email"}
                required={true}
                value={formData.email}
                changeHandler={changeHandler}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-y-2 relative">
              <InputBox
                label={"Password"}
                placeholder={"Enter your password"}
                type={showPassword ? "text" : "password"}
                id={"password"}
                name={"password"}
                required={true}
                value={formData.password}
                changeHandler={changeHandler}
                isPassword={true}
              />

              {/* Forgot Password Link */}
              <div className="text-sm text-purple6 cursor-pointer relative flex justify-end -mt-2">
                <Link to="/resetPasswordRequest">
                  <button className="hover:text-purple5 hover:underline transition-colors">
                    Forgot Password?
                  </button>
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2"
              style={{
                backgroundColor: 'rgb(139, 92, 246)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderWidth: '1px',
                textAlign: 'center' as const,
                borderStyle: 'solid',
                borderRadius: '10px',
                boxShadow: 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px, rgba(255, 255, 255, 0) 0px 0px 10px 1px inset, rgba(124, 58, 237, 0.12) 0px 0px 0px 1px',
                fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
                fontWeight: 500,
                letterSpacing: '-0.5px',
                lineHeight: '26px',
                color: 'rgb(255, 255, 255)',
                padding: '12px 24px',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(139, 92, 246, 0.5) 0px 8px 50px 0px, rgba(255, 255, 255, 0.05) 0px 0px 10px 1px inset, rgba(124, 58, 237, 0.15) 0px 0px 0px 1px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px, rgba(255, 255, 255, 0) 0px 0px 10px 1px inset, rgba(124, 58, 237, 0.12) 0px 0px 0px 1px';
              }}
            >
              Log In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

