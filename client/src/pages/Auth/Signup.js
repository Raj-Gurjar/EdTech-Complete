import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

export default function SignUp() {
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    isAdmin: userType,
  });


  async function signUpHandler(event) {
    event.preventDefault();
    toast.success("Sign Up");
  }

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
 
  return (
    <div className="log-container">
      <h2 className="log-heading">Sign Up</h2>

      <form className="log-form flex flex-col" onSubmit={signUpHandler}>
        <h4>Sign Up as {userType === true ? "Admin" : "Customer"}</h4>

        <label htmlFor="username">Username:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="username"
          name="name"
          value={formData.name}
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
        <label htmlFor="confpassword">Confirm Password:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="password"
          id="confPassword"
          name="confPassword"
          value={formData.confPassword}
          onChange={changeHandler}
          required
        />

        <button type="submit" className="bg-red-300">
          Sign Up
        </button>

        <div>
          <h5>Already Signed Up?</h5>
          <Link to="/login">
            <btn className="btn">
              Login as {userType ? "Admin" : "Customer"}
            </btn>
          </Link>
        </div>
      </form>
    </div>
  );
}
