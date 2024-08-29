import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputBox({
  name,
  type,
  required,
  id,
  label,
  value,
  changeHandler,
  placeholder,
  isPassword, // New prop to identify if the field is a password
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-col flex gap-y-1 relative z-1">
      <label htmlFor={id} className="w-full text-[15px]">
        {label}{" "}
        <span className={`${required ? "text-red5" : "disabled"}`}>*</span>
      </label>
      <input
        className="bg-black4 rounded-[0.5rem] border-b-[1px] text-[14px] p-[6px] text-white text-semibold"
        type={isPassword && showPassword ? "text" : type} // Toggle type based on showPassword
        id={id}
        name={name}
        value={value}
        onChange={changeHandler}
        required={required}
        placeholder={placeholder}
      />
      {isPassword && (
        <span
          className="absolute cursor-pointer z-2 right-3 top-[35px]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}
    </div>
  );
}
