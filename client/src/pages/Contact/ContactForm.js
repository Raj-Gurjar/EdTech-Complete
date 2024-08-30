import React from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import countryCode from "../../data/countryCode.json";
import InputBox from "../../user interfaces/InputBox";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const ContactHandler = (data) => {
    toast.success("Contact details sent");
    console.log("Contact Details sent:", data);
    reset();
  };

  return (
    <div className="flex flex-col w-[90%] text-white justify-center m-auto border-[2px] border-white6 p-4 rounded-md ">
      <h2 className="text-2xl font-semibold mt-4">
        Share Your Thoughts or Queries with us
      </h2>
      <h3 className="text-[14px] text-blue7 italic mb-4">
        Let us know what's in your mind
      </h3>
      <form
        className="log-form flex flex-col gap-y-4"
        onSubmit={handleSubmit(ContactHandler)}
      >
        <div className="flex gap-5 ">
          <div className="w-1/2">
            <InputBox
              label="First Name"
              id="firstName"
              type="text"
              required={true}
              placeholder="Enter your first name"
              register={register("firstName", {
                required: "First Name is required",
              })}
              errors={errors.firstName}
            />
          </div>

          <div className="w-1/2">
            <InputBox
              label="Last Name"
              id="lastName"
              type="text"
              required={true}
              placeholder="Enter your last name"
              register={register("lastName", {
                required: "Last Name is required",
              })}
              errors={errors.lastName}
            />
          </div>
        </div>

        <InputBox
          label="Email Address"
          id="email"
          type="email"
          required={true}
          placeholder="Enter your email address"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          })}
          errors={errors.email}
        />

        <div className="flex flex-col gap-y-1">
          <label htmlFor="contactNo" className="w-full text-[15px]">
            Contact Number
          </label>

          <div className="flex items-end">
            <div className=" w-[20%]">
              <select
                {...register("countryCode", {})}
                className="bg-black4 w-[70%] h-[32px] p-[1px] rounded-md border-b-[1px] text-[14px]"
              >
                {countryCode.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} - {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full ">
              <InputBox
                id="contactNo"
                type="tel"
                placeholder="Enter your contact number"
                required={false}
                register={register("contactNo", {
                  minLength: {
                    value: 10,
                    message: "Contact Number should be at least 10 digits",
                  },
                  maxLength: {
                    value: 15,
                    message: "Contact Number should be at most 15 digits",
                  },
                })}
                errors={errors.contactNo}
              />
            </div>
          </div>
          {errors.countryCode && (
            <span className="text-red-500">{errors.countryCode.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="message" className="w-full text-[15px]">
            Message <span className="text-red5">*</span>
          </label>
          <textarea
            className="bg-black4 border-b-[1px] rounded-[0.5rem] p-[6px] text-white"
            id="message"
            rows="5"
            {...register("message", { required: "Message is required" })}
            placeholder="Enter your message"
          />
          {errors.message && (
            <span className="text-red-500">{errors.message.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-yellow9 text-black font-semibold p-2 rounded-md mt-4"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
