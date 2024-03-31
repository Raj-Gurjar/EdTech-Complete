import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate;

  console.log("user data", user);
  return (
    <div>
      <h1 className="text-3xl">My Profile</h1>

      {/* //! section 1 */}
      <section className="bg-red-300 my-5">
        <h1 className="text-2xl">General Details</h1>
        <div>
          <img
            src={user?.image}
            alt={`profileImg-${user?.firstName}`}
            className="aspect-square w-[70px] object-cover rounded-full"
          />
        </div>
        <div>
          <p>AccountType : {user?.accountType}</p>
          <p>Name : {user?.firstName + " " + user?.lastName}</p>
          <p>Email : {user?.email}</p>
        </div>

        <button>Edit</button>
      </section>

      {/* //! section 2 */}
      <section className="bg-red-400 my-5">
        <h1 className="text-2xl">About</h1>
        <p>
          About :
          {user?.additionalDetails?.about ??
            "Write something about Yourselves.btn-row"}
        </p>

        <button>Edit</button>
      </section>

      {/* //! section 3 */}
      <section className="bg-red-100">
        <h1 className="text-2xl">Other Details</h1>

        <p>Gender :{user?.additionalDetails?.gender ?? "Add Gender"}</p>
        <p>Contact No. :{user?.additionalDetails?.contactNumber ?? "Add Contact"}</p>
        <p>DOB :{user?.additionalDetails?.dateOfBirth ?? "Add DOB"}</p>
        
        <button>Edit</button>
      </section>
    </div>
  );
}
