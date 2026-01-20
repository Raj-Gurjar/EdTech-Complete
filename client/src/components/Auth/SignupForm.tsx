import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOTP } from "../../services/operations/authAPI";
import { setSignupData } from "../../toolkit/slice/authSlice";
import { ACCOUNT_TYPE } from "../../utils/constants";
import InputBox from "../../user interfaces/InputBox";
import { validatePassword, PasswordValidationResult } from "../../utils/passwordValidation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

interface SignupFormProps {
  setIsLoggedIn?: (value: boolean) => void;
  accountType?: string;
  setAccountType?: (type: string) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey: string;
}

export default function SignupForm({ setIsLoggedIn, accountType: propAccountType, setAccountType: setPropAccountType }: SignupFormProps) {
  const [internalAccountType, setInternalAccountType] = useState<string>("Student");
  const accountType = propAccountType || internalAccountType;
  const setAccountType = setPropAccountType || setInternalAccountType;
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
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate password in real-time
    if (name === "password") {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
      setShowPasswordValidation(value.length > 0);
    }
  }

  const { email, password, confirmPassword } = formData;

  async function signUpHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      toast.error("Please fix password validation errors", { duration: 4000 });
      setShowPasswordValidation(true);
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { duration: 4000 });
      return;
    }

    dispatch(setSignupData({ ...formData, accountType }) as any);
    dispatch(sendOTP(email, navigate) as any);
  }

  return (
    <div className="">
      <form className="flex flex-col" onSubmit={signUpHandler}>
        {/* Account Type Selection */}
        <div className="mb-6">
          <div className="flex gap-2 bg-black3 p-1.5 rounded-full border border-black5">
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.STUDENT)}
              className={`flex-1 py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                accountType === ACCOUNT_TYPE.STUDENT
                  ? "bg-purple6 text-white shadow-lg shadow-purple6/40"
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
                  ? "bg-purple6 text-white shadow-lg shadow-purple6/40"
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
                  ? "bg-purple6 text-white shadow-lg shadow-purple6/40"
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
          <div className="flex flex-col gap-2">
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
            
            {/* Password Validation Feedback */}
            {showPasswordValidation && passwordValidation && (
              <div className="bg-black3 border border-black5 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-white mb-2">Password must contain:</p>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.checks.minLength ? 'text-green-400' : 'text-white4'}`}>
                    {passwordValidation.checks.minLength ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaTimesCircle className="text-white4" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.checks.hasUpperCase ? 'text-green-400' : 'text-white4'}`}>
                    {passwordValidation.checks.hasUpperCase ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaTimesCircle className="text-white4" />
                    )}
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.checks.hasLowerCase ? 'text-green-400' : 'text-white4'}`}>
                    {passwordValidation.checks.hasLowerCase ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaTimesCircle className="text-white4" />
                    )}
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.checks.hasNumber ? 'text-green-400' : 'text-white4'}`}>
                    {passwordValidation.checks.hasNumber ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaTimesCircle className="text-white4" />
                    )}
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.checks.hasSpecialChar ? 'text-green-400' : 'text-white4'}`}>
                    {passwordValidation.checks.hasSpecialChar ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaTimesCircle className="text-white4" />
                    )}
                    <span>One special character (!@#$%^&*...)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
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
            {confirmPassword && password && confirmPassword !== password && (
              <span className="text-red2 text-sm">Passwords do not match</span>
            )}
            {confirmPassword && password && confirmPassword === password && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <FaCheckCircle /> Passwords match
              </span>
            )}
          </div>

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
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

