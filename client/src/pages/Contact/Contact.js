import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

export default function Contact() {
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    message: "",
  });

  async function ContactHandler(event) {
    event.preventDefault();
    toast.success("Contact details sent");
    // navigate("/");
    console.log("Contact Details sent:", formData);
  }

  function changeHandler(event) {
    const { name, value, checked, type } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }
  console.log("contact details : ", formData);
  return (
    <div className="flex flex-col w-[90%] justify-center m-auto">
      <h2 className="log-heading">Contact Form</h2>

      <form className="log-form flex flex-col" onSubmit={ContactHandler}>
    

        <label htmlFor="firstName">First Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={changeHandler}
          required
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={changeHandler}
          required
        />

        <label htmlFor="email">Email Address:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          required
        />

        <label htmlFor="contactNo">Contact Number:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="number"
          id="contactNo"
          name="contactNo"
          value={formData.contactNo}
          onChange={changeHandler}
          
        />
        <label htmlFor="message">Message:</label>
        <textarea
          className="bg-black-200 border-[2px]"
          type="text"
          id="message"
          name="message"
          value={formData.message}
          onChange={changeHandler}
          required
        />

        <button type="submit" className="bg-red-300">
          Send Message
        </button>
      </form>
    </div>
  );
}
