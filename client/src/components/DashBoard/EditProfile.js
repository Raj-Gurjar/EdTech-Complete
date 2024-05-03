import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdditionalProfile,
  updateProfile,
} from "../../services/operations/profileAPI";
import { setUser } from "../../toolkit/slice/profileSlice";

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  console.log("user", user);

  const onSubmit = async (data) => {
    const result = await updateProfile(data, token);

    if (result) {
      dispatch(setUser(result));
    } else {
      toast.error("Changes can not update");
    }
  };

  return (
    <div>
      <h1 className="text-2xl">Edit Profile</h1>

      <div>Image</div>

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
    </div>
  );
}
