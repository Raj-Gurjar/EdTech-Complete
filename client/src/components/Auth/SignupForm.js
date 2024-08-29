import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendOTP } from "../../services/operations/authAPI";
import { setSignupData } from "../../toolkit/slice/authSlice";
import { ACCOUNT_TYPE } from "../../utils/constants";

export default function SignForm() {
  const [accountType, setAccountType] = useState("Student");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
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
    <div className="">
      <form className="flex flex-col" onSubmit={signUpHandler}>
        <div className="my-5">
          Sign Up as {accountType}
          <div className="flex gap-x-5">
            <button
              type="button"
              onClick={() => setAccountType("Student")}
              className={`${
                accountType === ACCOUNT_TYPE.STUDENT ? "bg-blue-400" : ""
              } `}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Instructor")}
              className={`${
                accountType === ACCOUNT_TYPE.INSTRUCTOR ? "bg-blue-400" : ""
              } `}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Admin")}
              className={`${
                accountType === ACCOUNT_TYPE.ADMIN ? "bg-blue-400" : ""
              } `}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full gap-y-5 mt-6">
          <div className="flex-col flex gap-y-1">
            <label htmlFor="firstName" className="w-full text-[15px]">
              First Name <span className="text-red5">*</span>
            </label>
            <input
              className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            {accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <label htmlFor="adminKey">Admin's Secret Key:</label>
                <input
                  className="bg-black5 rounded-[0.5rem] border-b-[1px] text-[14px] p-[8px]"
                  type="password"
                  id="adminKey"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={changeHandler}
                  required
                />
              </>
            )}
          </div>

          <button
            type="submit"
            className="bg-yellow8 rounded py-1 text-black mt-2 font-semibold"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
