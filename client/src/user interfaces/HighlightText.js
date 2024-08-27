import React from "react";

export default function HighlightText({ text, textSize }) {
  return (
    <span
      className={`font-extrabold ${textSize} bg-gradient-to-bl from-blue5 to-blue8 bg-clip-text text-transparent leading-normal`}
    >
      {text}
    </span>
  );
}
