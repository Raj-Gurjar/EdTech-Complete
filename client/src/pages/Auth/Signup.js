import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendOTP } from "../../services/operations/authAPI";
import { setSignupData } from "../../toolkit/slice/authSlice";

export default function SignUp() {
  const [accountType, setAccountType] = useState("Student");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const { firstName, lastName, email, password, confirmPassword } = formData;

  async function signUpHandler(event) {
    event.preventDefault();
    dispatch(setSignupData({ ...formData, accountType }));
    dispatch(sendOTP(email, navigate));
  }

  return (
    <div className="log-container">
      <h2 className="log-heading">Sign Up</h2>
      <form
        className="log-form flex flex-col m-auto justify-center w-11/12"
        onSubmit={signUpHandler}
      >
        <div className="my-5">
          Sign Up as {accountType}
          <div className="flex gap-x-5">
            <button
              type="button"
              onClick={() => setAccountType("Student")}
              className={`${accountType === "Student" ? "bg-blue-400" : ""} `}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Instructor")}
              className={`${
                accountType === "Instructor" ? "bg-blue-400" : ""
              } `}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Admin")}
              className={`${accountType === "Admin" ? "bg-blue-400" : ""} `}
            >
              Admin
            </button>
          </div>
        </div>

        <label htmlFor="firstName">First Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={changeHandler}
          required
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={changeHandler}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={changeHandler}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={changeHandler}
          required
        />

        <button type="submit" className="bg-red-300">
          Create Account
        </button>

        <div>
          <h5>Already Signed Up?</h5>
          <Link to="/login">
            <span className="btn">Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
