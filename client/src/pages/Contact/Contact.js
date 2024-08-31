import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import ContactForm from "./ContactForm";

export default function Contact() {
  const contactInfo = [
    {
      icon: <FaLocationDot />,
      title: "Visit Us",
      description: "Come and say Hello to our HQ",
      details: "123, New Street Road, New Delhi, 342211",
    },
    {
      icon: <MdEmail />,
      title: "Email Us",
      description: "Our Friendly Team will help you",
      details: "Email us on info@EdTech.com",
    },
    {
      icon: <IoMdCall />,
      title: "Call Us",
      description: "Speak to our team for help or feedback",
      details: "+123 2323 3233",
    },
  ];

  return (
    <div className="mt-5 w-11/12 mx-auto pb-8">
      <h1 className="flex justify-center my-6 text-3xl font-bold">Contact Us</h1>

      <div className="flex gap-5 w-11/12 justify-center align-top relative">
        
        <div className="cont-con w-1/3 p-7  rounded-md self-start  flex gap-y-6 text-[14px] flex-col bg-black4 ">
          {contactInfo.map((info, index) => (
            <div key={index} className="">
              <p className="flex items-center gap-2 text-[18px] font-semibold">
                <span>{info.icon}</span>
                {info.title}
              </p>
              <p className="text-white4">{info.description}</p>
              <p className="text-blue6">{info.details}</p>
            </div>
          ))}
        </div>


        <div className="w-1/2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
