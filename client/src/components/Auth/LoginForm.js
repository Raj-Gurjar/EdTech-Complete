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
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const { email, password } = formData;
  function loginHandler(e) {
    e.preventDefault();
    dispatch(login(email, password, navigate));
    // toast.success("Logged In");
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
              <div className="text-sm text-yellow8 cursor-pointer relative flex justify-end -mt-2">
                <Link to="/resetPasswordRequest">
                  <button className="hover:text-yellow9 hover:underline transition-colors">
                    Forgot Password?
                  </button>
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow8 hover:bg-yellow9 rounded-lg py-3 text-black font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg mt-2"
            >
              Log In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
