import { Route, Routes } from "react-router-dom";
import "./App.scss";

import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Cart from "./pages/Cart/Cart";
import Error404 from "./pages/Errors/Error404";
import Courses from "./pages/Courses/AllCourses";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ResetRequest from "./pages/Auth/ResetPassword/ResetRequest";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import DashBoard from "./pages/Users/DashBoard";
import MyDashBoard from "./components/DashBoard/MyDashBoard";
import MyProfile from "./components/DashBoard/MyProfile";
import MyCourses from "./components/DashBoard/MyCourses";
import Settings from "./components/DashBoard/Settings";
import MyCart from "./components/DashBoard/MyCart";


function App() {
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
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/myDashboard" element={<MyDashBoard />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/myCart" element={<MyCart />} />
          <Route path="/settings" element={<Settings />} />

          {/* //!Courses */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/allCourses" element={<Courses />} />

     

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
