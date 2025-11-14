import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formateDate } from "../../utils/formatDate";
import HighlightText from "../../user interfaces/HighlightText";
import Button from "../../user interfaces/Button";
import { 
  FaUser,
  FaEdit,
  FaUserCircle,
  FaIdCard
} from "react-icons/fa";
import { MdEmail, MdPhone, MdCake, MdTransgender } from "react-icons/md";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const accountTypeColors = {
    STUDENT: "bg-blue6",
    INSTRUCTOR: "bg-yellow8",
    ADMIN: "bg-pink6",
  };

  const accountTypeText = {
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    ADMIN: "Admin",
  };

  return (
    <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <HighlightText text={"My Profile"} />
        </h1>
        <p className="text-black6 text-sm sm:text-base">Manage your personal information and preferences</p>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-gradient-to-br from-black4 to-black5 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-black6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-yellow8 shadow-lg">
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
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${accountTypeColors[user?.accountType] || "bg-black6"} text-black font-bold px-3 py-1 rounded-full text-xs shadow-lg`}>
              {accountTypeText[user?.accountType] || "User"}
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
              <Button
                btn_name={"Edit Profile"}
                btn_link={"/dashboard/editProfile"}
                btn_color={"bg-yellow8 hover:bg-yellow9"}
                text_size={"text-sm sm:text-base"}
                px={"px-6"}
                py={"py-2"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Details Card */}
        <div className="bg-black4 rounded-xl shadow-lg p-6 border border-black6 hover:border-yellow8 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue6 bg-opacity-20 p-3 rounded-lg">
                <FaIdCard className="text-blue5 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">General Details</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-yellow8 hover:text-yellow9 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <FaUser className="text-blue5 text-lg" />
              <div>
                <p className="text-black8 text-xs">Full Name</p>
                <p className="text-white text-sm font-medium">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : "Not set"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdEmail className="text-blue5 text-lg" />
              <div>
                <p className="text-black8 text-xs">Email Address</p>
                <p className="text-white text-sm font-medium">{user?.email || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Details Card */}
        <div className="bg-black4 rounded-xl shadow-lg p-6 border border-black6 hover:border-yellow8 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow8 bg-opacity-20 p-3 rounded-lg">
                <FaUserCircle className="text-yellow8 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">Personal Details</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-yellow8 hover:text-yellow9 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdTransgender className="text-yellow8 text-lg" />
              <div>
                <p className="text-black8 text-xs">Gender</p>
                <p className="text-white text-sm font-medium">
                  {user?.additionalDetails?.gender || "Not set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdPhone className="text-yellow8 text-lg" />
              <div>
                <p className="text-black8 text-xs">Contact Number</p>
                <p className="text-white text-sm font-medium">
                  {user?.additionalDetails?.contactNumber || "Not set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black5 rounded-lg">
              <MdCake className="text-yellow8 text-lg" />
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
        <div className="lg:col-span-2 bg-black4 rounded-xl shadow-lg p-6 border border-black6 hover:border-yellow8 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-caribbeanGreen6 bg-opacity-20 p-3 rounded-lg">
                <FaUser className="text-caribbeanGreen5 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">About Me</h3>
            </div>
            <button
              onClick={() => navigate("/dashboard/editProfile")}
              className="text-yellow8 hover:text-yellow9 transition-colors"
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
  );
}
