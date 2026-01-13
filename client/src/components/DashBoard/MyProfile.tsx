import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formateDate } from "../../utils/formatDate";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import { 
  FaUser,
  FaEdit,
  FaUserCircle,
  FaIdCard,
  FaShieldAlt
} from "react-icons/fa";
import { MdEmail, MdPhone, MdCake, MdTransgender } from "react-icons/md";
import { RootState } from "../../toolkit/reducer";
import "../../pages/Home/Home.scss";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  profileImage?: string;
  additionalDetails?: {
    gender?: string;
    contactNumber?: string;
    dateOfBirth?: string;
    about?: string;
  };
  [key: string]: any;
}

export default function MyProfile() {
  const { user } = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate();

  const accountTypeColors: Record<string, string> = {
    Student: "bg-purple6",
    Instructor: "bg-purple6",
    Admin: "bg-purple6",
    STUDENT: "bg-purple6",
    INSTRUCTOR: "bg-purple6",
    ADMIN: "bg-purple6",
  };

  const accountTypeText: Record<string, string> = {
    Student: "Student",
    Instructor: "Instructor",
    Admin: "Admin",
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    ADMIN: "Admin",
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>
    <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8 relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <HighlightText text={"My Profile"} />
        </h1>
        <p className="text-white4 text-sm sm:text-base">Manage your personal information and preferences</p>
      </div>

      {/* Profile Hero Card */}
      <div 
        className="rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div 
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 shadow-lg"
              style={{ borderColor: 'rgb(139, 92, 246)' }}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black6 flex items-center justify-center">
                  <FaUserCircle className="text-6xl text-white4" />
                </div>
              )}
            </div>
            {/* Account Type Badge */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg"
              style={{ backgroundColor: 'rgb(139, 92, 246)' }}
            >
              {accountTypeText[user?.accountType || ""] || "User"}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : "User Name"
              }
            </h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-black7">
                <MdEmail className="text-xl" />
                <span className="text-sm sm:text-base">{user?.email || "No email provided"}</span>
              </div>
            </div>
            <div className="mt-4">
              <PrimaryCTA
                to="/dashboard/editProfile"
                className="text-sm sm:text-base"
              >
                Edit Profile
              </PrimaryCTA>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Details Card */}
        <div 
          className="rounded-xl shadow-lg p-6 border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              >
                <FaIdCard className="text-purple6 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">General Details</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-purple6 hover:text-purple5 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <FaUser className="text-purple6 text-lg" />
              <div>
                <p className="text-white4 text-xs">Full Name</p>
                <p className="text-white text-sm font-medium">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : "Not set"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdEmail className="text-purple6 text-lg" />
              <div>
                <p className="text-white4 text-xs">Email Address</p>
                <p className="text-white text-sm font-medium">{user?.email || "Not set"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <FaShieldAlt className="text-purple6 text-lg" />
              <div className="flex-1">
                <p className="text-black8 text-xs">Role / Account Type</p>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: 'rgb(139, 92, 246)' }}
                  >
                    {accountTypeText[user?.accountType || ""] || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Details Card */}
        <div 
          className="rounded-xl shadow-lg p-6 border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              >
                <FaUserCircle className="text-purple6 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">Personal Details</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-purple6 hover:text-purple5 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdTransgender className="text-purple6 text-lg" />
              <div>
                <p className="text-white4 text-xs">Gender</p>
                <p className="text-white text-sm font-medium">
                  {user?.additionalDetails?.gender || "Not set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdPhone className="text-purple6 text-lg" />
              <div>
                <p className="text-white4 text-xs">Contact Number</p>
                <p className="text-white text-sm font-medium">
                  {user?.additionalDetails?.contactNumber || "Not set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdCake className="text-purple6 text-lg" />
              <div>
                <p className="text-black8 text-xs">Date of Birth</p>
                <p className="text-white text-sm font-medium">
                  {user?.additionalDetails?.dateOfBirth
                    ? formateDate(user.additionalDetails.dateOfBirth).split("|")[0]
                    : "Not set"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section Card - Full Width */}
        <div 
          className="lg:col-span-2 rounded-xl shadow-lg p-6 border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              >
                <FaUser className="text-purple6 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">About Me</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-purple6 hover:text-purple5 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          
          <div className="p-4 bg-black5 rounded-lg min-h-[100px]">
            <p className="text-white leading-relaxed">
              {user?.additionalDetails?.about || (
                <span className="text-black7 italic">
                  Write something about yourself. Share your interests, goals, or anything you'd like others to know.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

