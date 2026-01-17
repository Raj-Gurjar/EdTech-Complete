import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { signUp, sendOTP } from "../../services/operations/authAPI";
import { SideArrowButton } from "../../user interfaces/Button";

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>("");
  const { loading, signupData } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const {
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    adminKey,
  } = signupData || {};

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
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
        adminKey,
        navigate
      ) as any
    );
  };

  return (
    <div className="flex border-[1px] bg-black2 border-white flex-col my-auto w-[35%] self-center p-6 rounded-md">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-2">Verify It's You</h1>
          <h3 className="text-[13px] text-white3 mb-5">
            We have sent an OTP to your registered email address.
          </h3>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-y-8">
            <h4 className="text-[14px]">Enter Your OTP Number below</h4>
            <div className="flex flex-wrap justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputType="tel"
                renderSeparator={<span className="m-1">-</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "30px",
                      padding: "10px",
                      textAlign: "center",
                    }} 
                    className="bg-black3 text-white rounded-md border-[1px]" 
                  />
                )}
              />
            </div>
            <button
              type="submit"
              className="bg-purple6 text-black rounded font-semibold py-1"
            >
              Verify Email
            </button>
          </form>

          <button
            className="bg-purple6 text-black rounded font-semibold py-1 mt-3"
            onClick={() => dispatch(sendOTP(email, navigate) as any)}
          >
            Resend OTP
          </button>

          <SideArrowButton btn_link={"/login"} btn_text={"Back to Login"} />
        </div>
      )}
    </div>
  );
}

