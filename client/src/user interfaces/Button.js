import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";


export default function Button({
  btn_name,
  btn_link,
  btn_color,
  px = "px-6",
  py = "py-3",
  text_color = "text-black",
  text_size = "13px",
}) {
  return (
    <div className="flex gap-7">
      <Link to={btn_link}>
        <button
          className={`${btn_color} text-center ${text_size} ${text_color}  ${px} ${py} rounded-md font-bold hover:scale-95 transition-all duration-200`}
        >
          {btn_name}
        </button>
      </Link>
    </div>
  );
}

export function SideArrowButton({btn_link , btn_text}) {
  return (
    <div>
      <Link to="/login">
        <div className="mt-4 flex justify-left items-center gap-1 text-[14px] hover:underline">
          <p>
            <FaArrowLeft />
          </p>
          <p>Back to Login</p>
        </div>
      </Link>
    </div>
  );
}
