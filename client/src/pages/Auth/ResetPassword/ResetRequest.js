import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../../../services/operations/authAPI";
import InputBox from "../../../user interfaces/InputBox";
import { SideArrowButton } from "../../../user interfaces/Button";

export default function ResetRequest() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  function handleOnSubmit(e) {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  }

  return (
    <div className="flex border-[1px] bg-black2 border-white flex-col my-auto w-[35%] self-center p-6 rounded-md">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-2">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </h1>
          <h3 className="text-[13px] text-white3 mb-5">
            {emailSent
              ? `We have sent you a reset link to your email at ${email}.`
              : "Have no fear, we will send you a reset password link to your registered email."}
          </h3>

          {!emailSent ? (
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-8">
              <InputBox
                name="email"
                type="email"
                required={true}
                id="email"
                label={"Enter Email Address"}
                value={email}
                changeHandler={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
              />
              <button
                type="submit"
                className="bg-yellow8 text-black rounded font-semibold py-1"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <div className="flex flex-col">
              <button
                className="bg-yellow8 text-black rounded font-semibold py-1 mt-3"
                onClick={() => setEmailSent(false)}
              >
                Resend Link or Edit Email
              </button>
            </div>
          )}

          <SideArrowButton btn_link={"/login"} btn_text={"Back to Login"} />
        </div>
      )}
    </div>
  );
}
