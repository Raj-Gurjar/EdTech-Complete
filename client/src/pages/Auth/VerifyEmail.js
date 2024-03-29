import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, signUp } from "../../services/operations/authAPI";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { loading, signupData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("signupData.. ", signupData);

  // useEffect(() => {
  //   if (signupData === null) {
  //     navigate("/signup");
  //   }
  // }, []);

  // const { accountType, firstName, lastName, email, password, confirmPassword } =
  //   signupData;

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // dispatch(
    //   signUp(
    //     accountType,
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //     confirmPassword,
    //     otp,
    //     navigate
    //   )
    // );
  };

  console.log(otp);
  return (
    <div className="flex flex-col w-11/12 justify-center m-auto pt-10">
      <h2>Verify its you</h2>
      <p>We have sent an email to your mail</p>
      <p>Enter OTP</p>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-11/12 justify-center m-auto"
      >
        <OtpInput
          // inputType="number"
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle="text-white bg-red-500"
        />

        <button type="submit">Verify Email</button>
      </form>
      <Link to="/login">Back to login</Link>
      <button onClick={() => dispatch(sendOTP(signupData.email, navigate))}>
        Resend otp
      </button>
    </div>
  );
}
