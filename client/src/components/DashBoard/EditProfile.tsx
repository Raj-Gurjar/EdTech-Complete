import React, { useState, ChangeEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAccount,
  updateProfile,
  updateProfileImage,
} from "../../services/operations/profileAPI";
import { setUser } from "../../toolkit/slice/profileSlice";
import Modal from "../Modals-Popups/Modal";
import { logout } from "../../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import HighlightText from "../../user interfaces/HighlightText";
import { 
  FaUser,
  FaCamera,
  FaUserCircle,
  FaTrash,
  FaSave,
  FaTimes,
  FaIdCard,
  FaArrowLeft
} from "react-icons/fa";
import { MdEmail, MdPhone, MdCake, MdTransgender, MdDescription } from "react-icons/md";
import { RootState } from "../../toolkit/reducer";
import "../../pages/Home/Home.scss";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  about?: string;
}

interface ModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

export default function EditProfile() {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [modal, setModal] = useState<ModalData | null>(null);
  const navigate = useNavigate();
  const [profileImg, setProfileImage] = useState<File | string>("");
  const [showImg, setShowImg] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData): Promise<void> => {
    const result = await updateProfile(data, token);

    if (result) {
      dispatch(setUser(result));
      toast.success("Profile updated successfully!");
      navigate("/dashboard/myProfile");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const deleteHandler = async (): Promise<void> => {
    const result = await deleteAccount(user?._id, token);

    if (result) {
      dispatch(logout(navigate) as any);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const img = e.target.files?.[0];
    if (img) {
      setProfileImage(img);
      TransformFile(img);
    }
  };

  const TransformFile = (file: File): void => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShowImg(reader.result as string);
      };
    } else {
      setProfileImage("");
      setShowImg("");
    }
  };

  const uploadImageHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!profileImg) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profileImage", profileImg as File);

    const result = await updateProfileImage(formData, token);

    if (result) {
      dispatch(setUser(result));
      setProfileImage("");
      setShowImg("");
      toast.success("Profile image updated successfully!");
    }
    setIsUploading(false);
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
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/myProfile")}
        className="flex items-center gap-2 text-white4 hover:text-white transition-colors mb-6 group"
      >
        <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Profile</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <HighlightText text={"Edit Profile"} />
        </h1>
        <p className="text-white4 text-sm sm:text-base">Update your personal information and preferences</p>
      </div>

      {/* Profile Image Upload Card */}
      <div 
        className="rounded-xl shadow-lg p-6 sm:p-8 mb-6 border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
          >
            <FaCamera className="text-purple6 text-xl" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Profile Picture</h2>
        </div>

        <form onSubmit={uploadImageHandler} className="flex flex-col sm:flex-row items-center gap-6">
          {/* Image Preview */}
          <div className="relative">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple6 shadow-lg">
              {showImg ? (
                <img
                  src={showImg}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black6 flex items-center justify-center">
                  <FaUserCircle className="text-6xl text-white4" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 w-full sm:w-auto">
            <label
              htmlFor="profImg"
              className="block mb-3 cursor-pointer"
            >
              <div className="bg-black5 hover:bg-black6 border-2 border-dashed border-black7 rounded-lg p-4 text-center transition-colors">
                <FaCamera className="text-purple6 text-2xl mx-auto mb-2" />
                <p className="text-white text-sm font-medium mb-1">Choose Image</p>
                <p className="text-black7 text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                id="profImg"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {showImg && (
              <button
                type="submit"
                disabled={isUploading}
                className="w-full sm:w-auto text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isUploading ? 'rgba(139, 92, 246, 0.5)' : 'rgb(139, 92, 246)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px',
                }}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information Card */}
        <div 
          className="rounded-xl shadow-lg p-6 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
            >
              <FaIdCard className="text-purple6 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-black7 mb-2">
                First Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <input
                  type="text"
                  id="firstName"
                  defaultValue={user?.firstName}
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all"
                  placeholder="Enter your first name"
                />
              </div>
              {errors.firstName && (
                <p className="text-red3 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-black7 mb-2">
                Last Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <input
                  type="text"
                  id="lastName"
                  defaultValue={user?.lastName}
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all"
                  placeholder="Enter your last name"
                />
              </div>
              {errors.lastName && (
                <p className="text-red3 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black7 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <input
                  type="email"
                  id="email"
                  defaultValue={user?.email}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red3 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple6 hover:bg-purple5 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/myProfile")}
                className="px-6 py-3 bg-black5 hover:bg-black6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information Card */}
        <div 
          className="rounded-xl shadow-lg p-6 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
            >
              <FaUserCircle className="text-purple6 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Additional Information</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-black7 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <MdCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <input
                  type="date"
                  id="dateOfBirth"
                  defaultValue={user?.additionalDetails?.dateOfBirth?.slice(0, 10)}
                  {...register("dateOfBirth")}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-black7 mb-2">
                Gender
              </label>
              <div className="relative">
                <MdTransgender className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <select
                  id="gender"
                  defaultValue={user?.additionalDetails?.gender || ""}
                  {...register("gender")}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-black7 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black6 text-lg" />
                <input
                  type="tel"
                  id="contactNumber"
                  defaultValue={user?.additionalDetails?.contactNumber}
                  {...register("contactNumber", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all"
                  placeholder="Enter your contact number"
                />
              </div>
              {errors.contactNumber && (
                <p className="text-red3 text-xs mt-1">{errors.contactNumber.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple6 hover:bg-purple5 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/myProfile")}
                className="px-6 py-3 bg-black5 hover:bg-black6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* About Section Card */}
      <div 
        className="rounded-xl shadow-lg p-6 border mb-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
          >
            <MdDescription className="text-purple6 text-xl" />
          </div>
          <h2 className="text-2xl font-semibold text-white">About Me</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="about" className="block text-sm font-medium text-black7 mb-2">
              Tell us about yourself
            </label>
            <textarea
              id="about"
              defaultValue={user?.additionalDetails?.about}
              {...register("about")}
              rows={6}
              className="w-full px-4 py-3 bg-black5 border border-black6 rounded-lg text-white placeholder-black7 focus:outline-none focus:ring-2 focus:ring-purple6 focus:border-transparent transition-all resize-none"
              placeholder="Share your interests, goals, or anything you'd like others to know..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-purple6 hover:bg-purple5 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaSave />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/myProfile")}
              className="px-6 py-3 bg-black5 hover:bg-black6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Card */}
      <div className="bg-gradient-to-br from-red5 to-red4 rounded-xl shadow-lg p-6 border-2 border-red3">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red3 bg-opacity-30 p-3 rounded-lg">
            <FaTrash className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Danger Zone</h2>
        </div>

        <div className="mb-4">
          <p className="text-white mb-2 font-medium">Delete Account</p>
          <p className="text-white2 text-sm">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>

        <button
          onClick={() => {
            setModal({
              text1: "Are You Sure?",
              text2: "Your account will be permanently deleted. This action cannot be undone.",
              btn1Text: "Delete Account",
              btn2Text: "Cancel",
              btn1Handler: () => deleteHandler(),
              btn2Handler: () => setModal(null),
            });
          }}
          className="bg-red3 hover:bg-red2 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <FaTrash />
          <span>Delete My Account</span>
        </button>
      </div>

      {modal && <Modal modalData={modal} />}
    </div>
    </div>
  );
}

