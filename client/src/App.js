import { Outlet, Route, Routes } from "react-router-dom";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_TYPE } from "./utils/constants";

import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Error404 from "./pages/Errors/Error404";
import Courses from "./pages/Courses/AllCourses";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ResetRequest from "./pages/Auth/ResetPassword/ResetRequest";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import DashBoard from "./pages/Users/DashBoard";
import MyDashBoard from "./components/DashBoard/MyDashBoard";
import MyProfile from "./components/DashBoard/MyProfile";
import MyCourses from "./components/DashBoard/Student/MyCourses";
import Settings from "./components/DashBoard/Settings";
import MyCart from "./components/DashBoard/Student/MyCart";
import ProtectedRoute from "./components/ProtectedRoute";
import MyPurchases from "./components/DashBoard/Student/MyPurchases";
import CreateCourses from "./components/DashBoard/Instructor/CreateCourses";

function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="App">
      <Navbar />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* //!auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/resetPasswordRequest" element={<ResetRequest />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          {/* //!Users */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          >
            <Route path="myDashboard" element={<MyDashBoard />} />
            <Route path="myProfile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="myCourses" element={<MyCourses />} />
                <Route path="myCart" element={<MyCart />} />
                <Route path="myPurchases" element={<MyPurchases />} />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="createCourses" element={<CreateCourses />} />
              </>
            )}
          </Route>

          {/* //!Courses */}
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route path="/allCourses" element={<Courses />} />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
