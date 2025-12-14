import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ButtonProps {
  btn_name: string;
  btn_link: string;
  btn_color: string;
  px?: string;
  py?: string;
  text_color?: string;
  text_size?: string;
}

export default function Button({
  btn_name,
  btn_link,
  btn_color,
  px = "px-6",
  py = "py-3",
  text_color = "text-black",
  text_size = "13px",
}: ButtonProps) {
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

interface SideArrowButtonProps {
  btn_link: string;
  btn_text: string;
}

export function SideArrowButton({ btn_link, btn_text }: SideArrowButtonProps) {
  return (
    <div>
      <Link to={btn_link}>
        <div className="mt-4 flex justify-left items-center gap-1 text-[14px] hover:underline">
          <p>
            <FaArrowLeft />
          </p>
          <p>{btn_text}</p>
        </div>
      </Link>
    </div>
  );
}

