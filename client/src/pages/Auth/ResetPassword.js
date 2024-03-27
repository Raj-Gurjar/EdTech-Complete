import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../../services/operations/authAPI";



export default function ResetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  function handleOnSubmit(e)
  { 
     e.preventDefault();
     dispatch(getPasswordResetToken(email,setEmailSent))
  }
  return (
    <div className="flex flex-col m-auto justify-center">
      {!emailSent ? (
        <div className="flex flex-col bg-green-100 m-auto justify-center w-11/12">
          <h3>Enter Your Email to reset Password</h3>

          <form onSubmit={handleOnSubmit}>
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
            <button type="submit">Send Mail</button>
          </form>

          <button><Link to='/login'>Back to Login</Link></button>
        </div>

      ) : (
        <div className="flex flex-col bg-green-100 m-auto justify-center w-11/12">
          <h3>Enter OTP</h3>

          <form action="" className="flex flex-col">
            <label htmlFor="otp">Email</label>
            <input
              required
              type="number"
              id="reset_opt"
              name="reset_otp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter OTP"
              className="bg-black-100 border-red-800 border-2"
            />
            <button className="bg-red-300" type="submit">Send OTP</button>
          </form>
        </div>
      )}
    </div>
  );
}
