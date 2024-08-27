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
import EnrolledCourses from "./components/DashBoard/Student/EnrolledCourses";
import Settings from "./components/DashBoard/Settings";
import MyCart from "./components/DashBoard/Student/MyCart";
import MyPurchases from "./components/DashBoard/Student/MyPurchases";
import CreateCourses from "./components/DashBoard/Instructor/Create Course/CreateCourse";
import ShowCourses from "./components/DashBoard/Instructor/My Courses/ShowCourses";
import EditCourse from "./components/DashBoard/Instructor/My Courses/EditCourse";
import AllCourses from "./pages/Courses/AllCourses";
import SingleCategory from "./pages/Courses/SingleCategory";
import CourseDetails from "./pages/Courses/CourseDetails";
import ShowDetails from "./pages/Courses/ShowSectionDetails";
import ShowSectionDetails from "./pages/Courses/ShowSectionDetails";
import EditProfile from "./components/DashBoard/EditProfile";
import ProtectedRoute from "./utils/ProtectedRoute";
import CourseMenu from "./pages/Users/Student/StudyCourse/CourseMenu";
import VideoDetails from "./pages/Users/Student/StudyCourse/VideoDetails";
import InstDashBoard from "./components/DashBoard/Instructor/InstructorDashboard/InstDashBoard";
import CategoryMenuAdmin from "./pages/Users/Admin/CategoryAdmin/CategoryMenuAdmin";
import CreateCategory from "./pages/Users/Admin/CategoryAdmin/CreateCategory";
import CourseMenuAdmin from "./pages/Users/Admin/CoursesAdmin/CoursesMenuAdmin";
import CourseDetailsAdmin from "./pages/Users/Admin/CoursesAdmin/CourseDetailsAdmin";
import AdminDashboard from "./pages/Users/Admin/Admin DashBoard/AdminDashboard";

function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="App">
      <Navbar />
      <div className="pt-14 w-screen min-h-screen text-white flex flex-col bg-black3 font-inter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* //!open routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/resetPasswordRequest" element={<ResetRequest />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />

          <Route path="allCourses" element={<AllCourses />} />
          <Route
            path="allCourses/category/:categoryName"
            element={<SingleCategory />}
          />

          <Route path="/allCourses/:courseId" element={<CourseDetails />} />
          <Route path="/sections/:sectionId" element={<ShowSectionDetails />} />

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
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="enrolledCourses" element={<EnrolledCourses />} />
                <Route path="myCart" element={<MyCart />} />
                <Route path="myPurchases" element={<MyPurchases />} />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="createCourse" element={<CreateCourses />} />
                <Route path="myCourses-Instructor" element={<ShowCourses />} />
                <Route path="edit-course/:courseId" element={<EditCourse />} />
                <Route
                  path="instructor-dashboard"
                  element={<InstDashBoard />}
                />
              </>
            )}

            {user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path="admin-dashboard" element={<AdminDashboard />} />
                <Route path="categoryMenu" element={<CategoryMenuAdmin />} />
                <Route path="createCategory" element={<CreateCategory />} />
                <Route path="courseMenu-admin" element={<CourseMenuAdmin />} />
                <Route
                  path="courseMenu-admin/:courseId"
                  element={<CourseDetailsAdmin />}
                />
              </>
            )}
          </Route>

          {/* //!Courses */}
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route path="/allCourses" element={<Courses />} />

          <Route
            element={
              <ProtectedRoute>
                <CourseMenu />
              </ProtectedRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="/courseMenu/:courseId/section/:sectionId/subSection/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )}
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
