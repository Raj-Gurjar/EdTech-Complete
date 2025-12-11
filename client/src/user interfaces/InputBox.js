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
    <div className="flex-col flex gap-y-2 relative">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label} {required && <span className="text-red2">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className="w-full bg-black3 border border-black5 rounded-lg px-4 py-3 text-white placeholder:text-white4 focus:outline-none focus:border-yellow8 transition-colors text-sm sm:text-base"
          type={isPassword && showPassword ? "text" : type}
          id={id}
          name={name}
          value={value}
          onChange={changeHandler}
          required={required}
          placeholder={placeholder}
          {...register}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white4 hover:text-yellow8 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {errors && (
        <span className="text-red2 text-sm mt-1">{errors.message}</span>
      )}
    </div>
  );
}
