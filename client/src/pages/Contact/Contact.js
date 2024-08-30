import React from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import countryCode from "../../data/countryCode.json";
import InputBox from "../../user interfaces/InputBox";
import ContactForm from "./ContactForm";
import { FaEye } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="mt-5 w-11/12 mx-auto">
      <h1 className="flex justify-center my-6 text-3xl font-bold">
        Contact Us
      </h1>

      <div className="flex gap-5 w-11/12 justify-center">
        <div className="w-1/3 flex gap-y-6 text-[14px] flex-col bg-black4 max-h-max my-auto">
          <div>
            <p>
              <span>
                <FaEye />
              </span>
              Visit Us
            </p>
            <p>Come and say Hello to our HQ</p>
            <p>123, New Street Road, New Delhi, 342211</p>
          </div>
          <div>
            <p>
              <span>
                <FaEye />
              </span>
              Email Us
            </p>
            <p>Our Friendly Team will help you</p>
            <p>Email us on info@EdTech.com</p>
          </div>
          <div>
            <p>
              <span>
                <FaEye />
              </span>
              Call Us
            </p>
            <p>Speak to our team for help or feedback</p>
            <p>+123 2323 3233</p>
          </div>
        </div>
        <div className="w-1/2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
