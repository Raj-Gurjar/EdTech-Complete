import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../services/operations/authAPI";
import Loader from "../../components/Loader/Loader";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const { email, password } = formData;
  function loginHandler(e) {
    e.preventDefault();
    dispatch(login(email, password, navigate));
    // toast.success("Logged In");
  }
  return (
    <div className="log-container">
      <h2 className="log-heading">Login</h2>
      {loading ? (
        <Loader/>
      ) : (
        <form onSubmit={loginHandler} className="log-form flex flex-col">
          <div className="log-form flex flex-col ">
            <h4 className="log-type">Login</h4>

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

            <button type="submit">Log in</button>

            <div className="reset-password">
              <Link to='/resetPasswordRequest'>
                <button>Reset Password</button>
              </Link>
            </div>

            <h5>Not Registered Yet?</h5>
            <Link to="/signup">
              <button className="btn">SignUp</button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
