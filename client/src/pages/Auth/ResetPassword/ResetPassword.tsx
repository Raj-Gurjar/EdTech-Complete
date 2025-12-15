import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../../../services/operations/authAPI";
import InputBox from "../../../user interfaces/InputBox";
import Loader from "../../../components/Loader/Loader";
import { SideArrowButton } from "../../../user interfaces/Button";

interface ResetPasswordFormData {
  newPassword: string;
  confNewPassword: string;
}

export default function ResetPassword() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confNewPassword: "",
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading } = useSelector((state: any) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfPassword, setShowConfPassword] = useState<boolean>(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const { newPassword, confNewPassword } = formData;

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
                className="absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

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
                className="absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setShowConfPassword(!showConfPassword)}
              >
                {showConfPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-yellow8 text-black rounded py-1 mt-2 font-semibold"
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

