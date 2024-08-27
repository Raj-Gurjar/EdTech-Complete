import React from "react";
import { Link } from "react-router-dom";

export default function Button({ btn_name, btn_link, btn_color }) {
  return (
    <div className="flex gap-7">
      <button
        className={`${btn_color} text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200`}
      >
        <Link to={btn_link}>{btn_name}</Link>
      </button>
    </div>
  );
}
