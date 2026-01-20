import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { resetPassword } from "../../../services/operations/authAPI";
import InputBox from "../../../user interfaces/InputBox";
import Loader from "../../../components/Loader/Loader";
import { SideArrowButton } from "../../../user interfaces/Button";
import { validatePassword, PasswordValidationResult } from "../../../utils/passwordValidation";
import toast from "react-hot-toast";

interface ResetPasswordFormData {
  newPassword: string;
  confNewPassword: string;
}

export default function ResetPassword() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confNewPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading } = useSelector((state: any) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfPassword, setShowConfPassword] = useState<boolean>(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password in real-time
    if (name === "newPassword") {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
      setShowPasswordValidation(value.length > 0);
    }
  };

  const { newPassword, confNewPassword } = formData;

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      toast.error("Please fix password validation errors", { duration: 4000 });
      setShowPasswordValidation(true);
      return;
    }

    // Check password match
    if (newPassword !== confNewPassword) {
      toast.error("Passwords do not match", { duration: 4000 });
      return;
    }

    const token = location.pathname.split("/").at(-1) || "";
    dispatch(resetPassword(newPassword, confNewPassword, token, navigate) as any);
  }

  return (
    <div className="flex flex-col my-auto justify-center bg-black2 border-[1px] border-white w-[35%] self-center p-6 rounded-md">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Choose a New Password</h2>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-2">
              <div className="relative">
                <InputBox
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  required={true}
                  value={newPassword}
                  changeHandler={onChangeHandler}
                  placeholder="Enter new Password"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-white4 hover:text-purple6 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              
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

            <div className="relative flex flex-col gap-2">
              <div className="relative">
                <InputBox
                  label="Confirm New Password"
                  type={showConfPassword ? "text" : "password"}
                  id="confNewPassword"
                  name="confNewPassword"
                  required={true}
                  value={confNewPassword}
                  changeHandler={onChangeHandler}
                  placeholder="Confirm new Password"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-white4 hover:text-purple6 transition-colors"
                  onClick={() => setShowConfPassword(!showConfPassword)}
                >
                  {showConfPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confNewPassword && newPassword && confNewPassword !== newPassword && (
                <span className="text-red2 text-sm">Passwords do not match</span>
              )}
              {confNewPassword && newPassword && confNewPassword === newPassword && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <FaCheckCircle /> Passwords match
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple6 text-black rounded py-1 mt-2 font-semibold"
            >
              Reset Password
            </button>
          </form>
          <SideArrowButton btn_link={"/login"} btn_text={"Back to Login"} />
        </div>
      )}
    </div>
  );
}

