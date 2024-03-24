import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: userType,
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function loginHandler() {
    toast.success("Logged In");
  }
  return (
    <div className="log-container">
      <h2 className="log-heading">Login</h2>

      <div className="log-form flex flex-col ">
        <h4 className="log-type">
          Login as {userType === true ? "Admin" : "Customer"}
        </h4>

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

        <button onClick={loginHandler}>Log in</button>

        <h5>Not Registered Yet?</h5>
        <Link to="/signup">
          <btn className="btn">
            SignUp As {userType === true ? "Admin" : "Customer"}
          </btn>
        </Link>
      </div>
    </div>
  );
}
