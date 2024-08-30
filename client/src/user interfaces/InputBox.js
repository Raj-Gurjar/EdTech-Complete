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
  isPassword,
  errors,
  register,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-col flex gap-y-1 relative z-1">
      <label htmlFor={id} className="w-full text-[15px]">
        {label} {required && <span className="text-red5">*</span>}
      </label>
      <input
        className="bg-black4 rounded-md border-b-[1px] text-[14px] p-[6px] text-white text-semibold"
        type={isPassword && showPassword ? "text" : type} // Toggle type based on showPassword
        id={id}
        name={name}
        value={value}
        onChange={changeHandler}
        required={required}
        placeholder={placeholder}
        {...register}
      />
      {isPassword && (
        <span
          className="absolute cursor-pointer z-2 right-3 top-[35px]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}
      {errors && <span className="text-red-500">{errors.message}</span>}
    </div>
  );
}
