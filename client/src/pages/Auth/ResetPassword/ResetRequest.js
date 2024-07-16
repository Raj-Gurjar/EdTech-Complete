import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getPasswordResetToken } from "../../../services/operations/authAPI";

export default function ResetRequest() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();

  function handleOnSubmit(e) {
    e.preventDefault();
    // setEmailSent(true);
    dispatch(getPasswordResetToken(email, setEmailSent));
  }

  console.log("emailSent...", emailSent);
  return (
    <div className="flex flex-col m-auto justify-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {emailSent === false ? (
            <div className="flex flex-col bg-green-100 m-auto justify-center w-11/12">
              <h3>Enter Your Email to reset Password</h3>

              <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="bg-black-100 border-red-800 border-2"
                />
                <button type="submit" className="bg-red-400">
                  Reset Password
                </button>
              </form>

              <Link to="/login"> --- Back to Login</Link>
            </div>
          ) : (
            <div className="flex flex-col bg-green-100 m-auto justify-center w-11/12">
              <h3>Check Your Email</h3>
              <p>
                We have sent you a resent link on your email at
                <span className="text-2xl bg-blue-300">{email}</span>
              </p>

              <button
                className="bg-red-300"
                onClick={() => setEmailSent(false)}
              >
                Resend Link or Edit Email
              </button>

              <Link to="/login"> --- Back to Login</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
