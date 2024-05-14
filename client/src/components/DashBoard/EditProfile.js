import React, { useState } from "react";
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

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();
  const [profileImg, setProfileImage] = useState("");
  const [showImg, setShowImg] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // console.log("user", user);

  const onSubmit = async (data) => {
    const result = await updateProfile(data, token);

    console.log("res", result);
    if (result) {
      dispatch(setUser(result));
    } else {
      toast.error("Changes can not update");
    }
  };

  const deleteHandler = async () => {
    const result = await deleteAccount(user?._id, token);

    if (result) {
      dispatch(logout(navigate));
    }
  };

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    setProfileImage(img);
    TransformFile(img);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShowImg(reader.result);
      };
    } else {
      setProfileImage("");
      setShowImg("");
    }
  };

  const uploadImageHandler = async () => {
    const formData = new FormData();
    formData.append("profileImage", profileImg);

    const result = await updateProfileImage(formData, token);

    if (result) {
      dispatch(setUser(result));
    }
  };

  return (
    <div>
      <h1 className="text-2xl">Edit Profile</h1>

      <div>Image</div>

      <div className="bg-slate-500 my-5 p-5">
        <h1 className="text-2xl">Change Profile Image</h1>
        Current profile :
        {showImg ? (
          <img
            src={showImg}
            alt="user profile img"
            className="h-[100px] w-[100px] m-5"
          />
        ) : (
          <img
            src={user?.profileImage}
            alt="user profile img"
            className="h-[100px] w-[100px] m-5"
          />
        )}
        <div className="flex gap-x-4">
          <form onSubmit={handleSubmit(uploadImageHandler)}>
            <input
              type="file"
              accept="image/*"
              id="profImg"
              // name="profileImage"
              onChange={handleImageChange}
            />
            <button type="submit" className="bg-yellow-400">
              Upload Image
            </button>
          </form>
        </div>
      </div>

      <div className="bg-slate-400 my-5 p-5">
        <h1 className="text-2xl">Personal Info</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              defaultValue={user?.firstName}
              {...register("firstName")}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="lastName">last Name</label>
            <input
              type="text"
              id="lastName"
              defaultValue={user?.lastName}
              {...register("lastName")}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="email">Email </label>
            <input
              type="email"
              id="email"
              defaultValue={user?.email}
              {...register("email")}
              className="w-full"
            />
          </div>

          <div className="flex gap-x-5 my-3">
            <button type="submit" className="bg-yellow-300">
              Save Changes
            </button>

            <button type="reset" className="bg-yellow-300">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-300 my-5 p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl">Additional Info</h1>

          <div>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              defaultValue={user?.additionalDetails?.dateOfBirth?.slice(0, 10)}
              {...register("dateOfBirth")}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              defaultValue={user?.additionalDetails?.gender}
              {...register("gender")}
              className="w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="number"
              id="contactNumber"
              defaultValue={user?.additionalDetails?.contactNumber}
              {...register("contactNumber")}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="about">About YourSelf</label>
            <textarea
              className="w-full"
              id="about"
              defaultValue={user?.additionalDetails?.about}
              {...register("about")}
            />
          </div>

          <div className="flex gap-x-5 my-3">
            <button type="submit" className="bg-yellow-300">
              Save Changes
            </button>

            <button type="reset" className="bg-yellow-300">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-300 my-5 p-5">
        <h1 className="text-2xl">Delete Account</h1>

        <button
          onClick={() => {
            setModal({
              text1: "Are You Sure ?",
              text2: "You Account will be Permanently Deleted",
              btn1Text: "Delete Account",
              btn2Text: "Cancel",
              btn1Handler: () => deleteHandler(),
              btn2Handler: () => setModal(null),
            });
          }}
        >
          Delete Account
        </button>
      </div>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
