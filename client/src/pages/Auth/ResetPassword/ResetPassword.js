import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../../../services/operations/authAPI";


export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confNewPassword: "",
  });

  const dispatch = useDispatch();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const onChangeHandler = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const { newPassword, confNewPassword } = formData;
  function onSubmitHandler(e) {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(newPassword, confNewPassword, token));
  }
  return (
    <div className="flex flex-col justify-center bg-red-200 w-11/12 m-auto">
      <h2>Choose a new Password</h2>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-3 w-11/12 m-auto"
      >
        <label htmlFor="newPassword">New Password</label>
        <input
          required
          type={showPassword ? "text" : "password"}
          className=""
          placeholder="Enter new Password"
          name="newPassword"
          value={newPassword}
          onChange={onChangeHandler}
          id="newPassword"
        />
        <span className="" onClick={() => setShowPassword(!showPassword)}>
          {!showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>

        <label htmlFor="confNewPassword">Confirm New Password</label>
        <input
          required
          type={showConfPassword ? "text" : "password"}
          className=""
          placeholder="Confirm new Password"
          name="confNewPassword"
          value={confNewPassword}
          onChange={onChangeHandler}
          id="confNewPassword"
        />
        <span onClick={() => setShowConfPassword(!showConfPassword)}>
          {!showConfPassword ? <FaEye /> : <FaEyeSlash />}
        </span>

        <button type="submit" className="bg-green-300">
          Reset Password
        </button>
      </form>

      <Link to="/login">Back to login</Link>
    </div>
  );
}
