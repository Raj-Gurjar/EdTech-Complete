import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import countryCode from "../../data/countryCode.json";
import { Link } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const ContactHandler = (data) => {
    toast.success("Contact details sent");
    console.log("Contact Details sent:", data);
    reset();
  };

  return (
    <div className="flex flex-col w-[90%] justify-center m-auto">
      <h2 className="log-heading">Contact Form</h2>
      <form className="log-form flex flex-col" onSubmit={handleSubmit(ContactHandler)}>
        <label htmlFor="firstName">First Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="firstName"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && <span>First Name is required</span>}

        <label htmlFor="lastName">Last Name:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="text"
          id="lastName"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && <span>Last Name is required</span>}

        <label htmlFor="email">Email Address:</label>
        <input
          className="bg-black-200 border-[2px]"
          type="email"
          id="email"
          {...register("email", { required: true })}
        />
        {errors.email && <span>Email is required</span>}

        <label htmlFor="contactNo">Contact Number:</label>
        <div className="contactNo flex gap-x-5">
          <select
            {...register("countryCode")}
            className="bg-red-300 w-[80px]"
          >
            {countryCode.map((country, index) => (
              <option key={index} value={country.code}>
                {country.code + "-" + country.name}
              </option>
            ))}
          </select>
          <input
            className="bg-black-200 border-[2px]"
            type="number"
            id="contactNo"
            {...register("contactNo", { required: true })}
          />
        </div>
        {errors.contactNo && <span>Contact Number is required</span>}

        <label htmlFor="message">Message:</label>
        <textarea
          className="bg-black-200 border-[2px]"
          id="message"
          {...register("message", { required: true })}
        />
        {errors.message && <span>Message is required</span>}

        <button type="submit" className="bg-red-300">
          Send Message
        </button>
      </form>
    </div>
  );
}
