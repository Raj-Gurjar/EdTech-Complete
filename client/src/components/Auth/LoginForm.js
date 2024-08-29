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
          <div className="flex flex-col w-full gap-y-5 mt-6">
            <div className="flex-col flex gap-y-1">
              <InputBox
                label={"Email"}
                placeholder={"Enter Email Id"}
                type={"email"}
                id={"email"}
                name={"email"}
                required={true}
                value={formData.email}
                changeHandler={changeHandler}
              />
            </div>

            <div className="flex flex-col  gap-y-1 relative z-1">
              <InputBox
                label={"Password"}
                placeholder={"Enter First Name"}
                type={showPassword ? "text" : "password"}
                id={"password"}
                name={"password"}
                required={true}
                value={formData.password}
                changeHandler={changeHandler}
                isPassword={true}
              />

              <div className="text-[12px] text-blue6 cursor-pointer relative flex justify-end">
                <Link to="/resetPasswordRequest">
                  <button className="hover:underline">Forgot Password</button>
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="bg-yellow8 rounded py-1 text-black mt-2 font-semibold"
            >
              Log in
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
