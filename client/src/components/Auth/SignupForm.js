import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendOTP } from "../../services/operations/authAPI";
import { setSignupData } from "../../toolkit/slice/authSlice";
import { ACCOUNT_TYPE } from "../../utils/constants";
import InputBox from "../../user interfaces/InputBox";

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
          <p>Sign Up as {accountType}</p>

          <div className="flex gap-x-1 bg-black5 p-1  my-3 rounded-full max-w-max shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onClick={() => setAccountType("Student")}
              className={`${
                accountType === ACCOUNT_TYPE.STUDENT
                  ? "bg-black2"
                  : "bg-transparent text-white3"
              } py-1 px-5 rounded-full transition-all duration-200"
              } `}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Instructor")}
              className={`${
                accountType === ACCOUNT_TYPE.INSTRUCTOR
                  ? "bg-black2"
                  : "bg-transparent text-white3"
              } py-2 px-5 rounded-full transition-all duration-200"
            } `}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => setAccountType("Admin")}
              className={`${
                accountType === ACCOUNT_TYPE.ADMIN
                  ? "bg-black2"
                  : "bg-transparent text-white3"
              } py-2 px-5 rounded-full transition-all duration-200"
            } `}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full gap-y-5 mt-6">
          <div className="flex flex-row gap-5">
            <div className="w-1/2">
           
              <InputBox
                label="First Name"
                placeholder={"Enter First Name"}
                type="text"
                id="firstName"
                name="firstName"
                required={true}
                value={formData.firstName}
                changeHandler={changeHandler}
              />
            </div>

            <div className="w-1/2">
              <InputBox
                label="Last Name"
                placeholder="Enter Last Name"
                type="text"
                id="lastName"
                name="lastName"
                required={true}
                value={formData.lastName}
                changeHandler={changeHandler}
              />
            </div>
          </div>

          <InputBox
            label="Email"
            placeholder="Enter Email"
            type="email"
            id="email"
            name="email"
            required={true}
            value={formData.email}
            changeHandler={changeHandler}
          />

          <InputBox
            label="Password"
            placeholder="Enter Password"
            type="password"
            id="password"
            name="password"
            required={true}
            isPassword={true}
            value={formData.password}
            changeHandler={changeHandler}
          />

          <InputBox
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required={true}
            isPassword={true}
            value={formData.confirmPassword}
            changeHandler={changeHandler}
          />

          {accountType === ACCOUNT_TYPE.ADMIN && (
            <InputBox
              label="Admin's Secret Key"
              placeholder="Enter Admin's Secret Key"
              type="password"
              id="adminKey"
              name="adminKey"
              required={true}
              value={formData.adminKey}
              changeHandler={changeHandler}
            />
          )}

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
