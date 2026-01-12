import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import ContactForm from "./ContactForm";
import HighlightText from "../../user interfaces/HighlightText";
import { ReactElement } from "react";
import "../Home/Home.scss";

interface ContactInfo {
  icon: ReactElement;
  title: string;
  description: string;
  details: string;
}

export default function Contact() {
  const contactInfo: ContactInfo[] = [
    {
      icon: <FaLocationDot className="text-purple6" />,
      title: "Visit Us",
      description: "Come and say Hello to our HQ",
      details: "123, New Street Road, New Delhi, 342211",
    },
    {
      icon: <MdEmail className="text-purple6" />,
      title: "Email Us",
      description: "Our Friendly Team will help you",
      details: "info@skillscript.com",
    },
    {
      icon: <IoMdCall className="text-purple6" />,
      title: "Call Us",
      description: "Speak to our team for help or feedback",
      details: "+123 2323 3233",
    },
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>

      <div className="w-11/12 max-w-7xl mx-auto py-6 sm:py-8 pb-12 relative">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white">
          Contact <HighlightText text="Us" />
        </h1>
        <p className="text-white4 text-sm sm:text-base max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Get in touch with our team.
        </p>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Contact Info Cards - Full width on mobile, 1/3 on desktop */}
        <div className="w-full lg:w-1/3 space-y-4">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple6/50 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple6/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-purple6/50">
                  <span className="text-2xl">{info.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {info.title}
                  </h3>
                  <p className="text-white4 text-sm mb-2">{info.description}</p>
                  <p className="text-purple6 text-sm sm:text-base font-medium">
                    {info.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3">
          <ContactForm />
        </div>
      </div>
      </div>
    </div>
  );
}

