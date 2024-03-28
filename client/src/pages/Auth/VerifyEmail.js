import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, signUp } from "../../services/operations/authAPI";


export default function VerifyEmail() {
  const [otp, setOTP] = useState("");
  const { loading, signupData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  });

  const { accountType, firstName, lastName, email, password, confirmPassword } =
    signupData;

  const onSubmitHandler = (e) => {
    e.preventDefault();
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
  };
  return (
    <div className="flex flex-col w-11/12 justify-center m-auto">
      <h2>Verify its you</h2>
      <p>We have sent an email to your mail {email}</p>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-11/12 justify-center m-auto"
      >
        <label htmlFor="">Enter OTP</label>
        <OTPInput
          // inputType="number"
          value={otp}
          onChange={setOTP}
          numInputs={6}
          className="border-2 border-black-500"
          renderSeparator={<span className="bg-black-200">--</span>}
          renderInput={(props) => <input {...props} />}
        />

        <button type="submit">Verify Email</button>
      </form>
      <Link to="/login">Back to login</Link>
      <button onClick={() => dispatch(sendOTP(signupData.email,navigate))}>Resend otp</button>
    </div>
  );
}
