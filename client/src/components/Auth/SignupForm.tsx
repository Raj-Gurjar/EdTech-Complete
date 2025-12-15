import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendOTP } from "../../services/operations/authAPI";
import { setSignupData } from "../../toolkit/slice/authSlice";
import { ACCOUNT_TYPE } from "../../utils/constants";
import InputBox from "../../user interfaces/InputBox";
import HighlightText from "../../user interfaces/HighlightText";

interface SignupFormProps {
  setIsLoggedIn?: (value: boolean) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey: string;
}

export default function SignupForm({ setIsLoggedIn }: SignupFormProps) {
  const [accountType, setAccountType] = useState<string>("Student");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const { firstName, lastName, email, password, confirmPassword } = formData;

  async function signUpHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(setSignupData({ ...formData, accountType }) as any);
    dispatch(sendOTP(email, navigate) as any);
  }

  return (
    <div className="">
      <form className="flex flex-col" onSubmit={signUpHandler}>
        {/* Account Type Selection */}
        <div className="mb-6">
          <p className="text-lg sm:text-xl font-semibold text-white mb-4">
            Sign Up as <HighlightText text={accountType} />
          </p>

          <div className="flex gap-2 bg-black3 p-1.5 rounded-full border border-black5">
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.STUDENT)}
              className={`flex-1 py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                accountType === ACCOUNT_TYPE.STUDENT
                  ? "bg-yellow8 text-black shadow-lg"
                  : "bg-transparent text-white4 hover:text-white"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.INSTRUCTOR)}
              className={`flex-1 py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                accountType === ACCOUNT_TYPE.INSTRUCTOR
                  ? "bg-yellow8 text-black shadow-lg"
                  : "bg-transparent text-white4 hover:text-white"
              }`}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.ADMIN)}
              className={`flex-1 py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                accountType === ACCOUNT_TYPE.ADMIN
                  ? "bg-yellow8 text-black shadow-lg"
                  : "bg-transparent text-white4 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col w-full gap-5 sm:gap-6">
          {/* Name Fields - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="flex-1">
              <InputBox
                label="First Name"
                placeholder="Enter your first name"
                type="text"
                id="firstName"
                name="firstName"
                required={true}
                value={formData.firstName}
                changeHandler={changeHandler}
              />
            </div>

            <div className="flex-1">
              <InputBox
                label="Last Name"
                placeholder="Enter your last name"
                type="text"
                id="lastName"
                name="lastName"
                required={true}
                value={formData.lastName}
                changeHandler={changeHandler}
              />
            </div>
          </div>

          {/* Email */}
          <InputBox
            label="Email Address"
            placeholder="Enter your email address"
            type="email"
            id="email"
            name="email"
            required={true}
            value={formData.email}
            changeHandler={changeHandler}
          />

          {/* Password */}
          <InputBox
            label="Password"
            placeholder="Enter your password"
            type="password"
            id="password"
            name="password"
            required={true}
            isPassword={true}
            value={formData.password}
            changeHandler={changeHandler}
          />

          {/* Confirm Password */}
          <InputBox
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required={true}
            isPassword={true}
            value={formData.confirmPassword}
            changeHandler={changeHandler}
          />

          {/* Admin Key - Only shown for Admin */}
          {accountType === ACCOUNT_TYPE.ADMIN && (
            <InputBox
              label="Admin's Secret Key"
              placeholder="Enter admin secret key"
              type="password"
              id="adminKey"
              name="adminKey"
              required={true}
              isPassword={true}
              value={formData.adminKey}
              changeHandler={changeHandler}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow8 hover:bg-yellow9 rounded-lg py-3 text-black font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg mt-2"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

