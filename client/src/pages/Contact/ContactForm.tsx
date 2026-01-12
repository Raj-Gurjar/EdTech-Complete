import React, { useState } from "react";
import { useForm } from "react-hook-form";
import countryCode from "../../data/countryCode.json";
import InputBox from "../../user interfaces/InputBox";
import { createContactUs } from "../../services/operations/contactAPI";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  countryCode?: string;
  contactNo?: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const ContactHandler = async (data: ContactFormData): Promise<void> => {
    setIsSubmitting(true);

    // Combine country code and contact number if both are provided
    let phoneNo: string | undefined;
    if (data.countryCode && data.contactNo) {
      phoneNo = `${data.countryCode}${data.contactNo}`;
    } else if (data.contactNo) {
      phoneNo = data.contactNo;
    }

    // Prepare data for API
    const contactData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ...(phoneNo && { phoneNo }),
    };

    const success = await createContactUs(contactData);

    if (success) {
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Share Your Thoughts or Queries
        </h2>
        <p className="text-white4 text-sm sm:text-base">
          Let us know what's on your mind. We're here to help!
        </p>
      </div>

      <form
        className="flex flex-col gap-5 sm:gap-6"
        onSubmit={handleSubmit(ContactHandler)}
      >
        {/* Name Fields - Stack on mobile, side by side on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="flex-1">
            <InputBox
              name="firstName"
              label="First Name"
              id="firstName"
              type={"text"}
              required={true}
              placeholder="Enter your first name"
              register={register("firstName", {
                required: "First Name is required",
              })}
              errors={errors.firstName}
            />
          </div>

          <div className="flex-1">
            <InputBox
              name="lastName"
              label="Last Name"
              id="lastName"
              type={"text"}
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
          name="email"
          label="Email Address"
          id="email"
          type={"email"}
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

        {/* Subject */}
        <div className="flex flex-col gap-y-1">
          <label htmlFor="subject" className="text-sm font-medium text-white">
            Subject <span className="text-red2">*</span>
          </label>
          <input
            className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors"
            id="subject"
            type="text"
            placeholder="What is this regarding?"
            {...register("subject", { required: "Subject is required" })}
          />
          {errors.subject && (
            <span className="text-red2 text-sm mt-1">{errors.subject.message}</span>
          )}
        </div>

        {/* Contact Number */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="contactNo" className="text-sm font-medium text-white">
            Contact Number (Optional)
          </label>
          <div className="flex gap-3">
            <select
              {...register("countryCode", {})}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-purple6 transition-colors flex-shrink-0"
              style={{ width: "120px" }}
            >
              {countryCode.map((country: { code: string }, index: number) => (
                <option key={index} value={country.code} className="bg-black2">
                  {country.code}
                </option>
              ))}
            </select>
            <div className="flex-1">
              <InputBox
                name="contactNo"
                id="contactNo"
                type={"number"}
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
            <span className="text-red2 text-sm">{errors.countryCode.message}</span>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="message" className="text-sm font-medium text-white">
            Message <span className="text-red2">*</span>
          </label>
          <textarea
            className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-purple6 transition-colors min-h-[150px] resize-y"
            id="message"
            rows={6}
            {...register("message", { required: "Message is required" })}
            placeholder="Tell us more about your query or feedback..."
          />
          {errors.message && (
            <span className="text-red2 text-sm mt-1">{errors.message.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-purple6 hover:bg-purple7 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-purple6/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
            }}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}

