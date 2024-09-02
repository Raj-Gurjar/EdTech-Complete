import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formateDate } from "../../utils/formatDate";
import HighlightText from "../../user interfaces/HighlightText";
import Button from "../../user interfaces/Button";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(false);

  console.log("user data", user);

  console.table("cct ", [user.accountType, user.email]);
  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-3xl font-bold">
        <HighlightText text={"My Profile"} />
      </h1>

      {/* //! section 1 */}
      <section className="bg-black4 my-5 rounded-sm">
        <div className="flex justify-between  p-4">
          <div>
            <h1 className="text-2xl font-semibold">General Details</h1>
          </div>

          <div className="">
            <Button
              btn_name={"Edit"}
              btn_link={"/dashboard/editProfile"}
              btn_color={"bg-yellow8"}
              text_size={"1px"}
              px={"px-4"}
              py={"py-1"}
            />
          </div>
        </div>

        <div className="flex gap-3 items-center p-3">
          <div>
            <img
              src={user?.profileImage}
              alt={`profileImg-${user?.firstName}`}
              className="aspect-square w-[60px] object-cover rounded-full"
            />
          </div>
          <div className="align-center">
            <p>{user?.firstName + " " + user?.lastName}</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </section>

      {/* //! section 2 */}

      <section className="bg-black4 my-5 rounded-sm">
        <div className="flex justify-between  p-4">
          <div>
            <h1 className="text-2xl font-semibold">About</h1>
          </div>

          <div className="">
            <Button
              btn_name={"Edit"}
              btn_link={"/dashboard/editProfile"}
              btn_color={"bg-yellow8"}
              text_size={"1px"}
              px={"px-4"}
              py={"py-1"}
            />
          </div>
        </div>

        <div className="flex gap-3 items-center p-3">
          <p>
            About :
            {user?.additionalDetails?.about ??
              "Write something about Yourselves.btn-row"}
          </p>
        </div>
      </section>

      {/* //! section 3 */}
      <section className="bg-black4"></section>

      <section className="bg-black4 my-5 rounded-sm">
        <div className="flex justify-between  p-4">
          <div>
            <h1 className="text-2xl font-semibold">Other Details</h1>
          </div>

          <div className="">
            <Button
              btn_name={"Edit"}
              btn_link={"/dashboard/editProfile"}
              btn_color={"bg-yellow8"}
              text_size={"1px"}
              px={"px-4"}
              py={"py-1"}
            />
          </div>
        </div>

        <div className="flex gap-3 items-center p-3">
          
          <p>Gender :{user?.additionalDetails?.gender ?? "Add Gender"}</p>
          <p>
            Contact No. :
            {user?.additionalDetails?.contactNumber ?? "Add Contact"}
          </p>
          <p>
            DOB :
            {formateDate(user?.additionalDetails?.dateOfBirth).split("|")[0] ??
              "Add DOB"}
          </p>
        </div>
      </section>
    </div>
  );
}
