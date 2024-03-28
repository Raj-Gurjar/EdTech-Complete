import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signUp } from "../../services/operations/authAPI";

export default function SignUp() {
  const [accountType, setAccountType] = useState("Student");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confPassword: "",
  });

  function changeHandler(event) {
    const { name, value, checked, type } = event.target;
    console.log(formData);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }



  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
  } = formData;

  async function signUpHandler(event) {
    event.preventDefault();
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
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
            <button onClick={()=>setAccountType("Student")} className={`${accountType === "Student" ? "bg-blue-400" : ""} `}>Student</button>
            <button onClick={()=>setAccountType("Instructor")} className={`${accountType === "Instructor" ? "bg-blue-400" : ""} `}>Instructor</button>
            <button onClick={()=>setAccountType("Admin")} className={`${accountType === "Admin" ? "bg-blue-400" : ""} `}>Admin</button>
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
            <btn className="btn">Login</btn>
          </Link>
        </div>
      </form>
    </div>
  );
}
