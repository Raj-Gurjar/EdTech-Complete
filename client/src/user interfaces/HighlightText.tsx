import React from "react";

interface HighlightTextProps {
  text: string;
  textSize?: string;
}

export default function HighlightText({ text, textSize }: HighlightTextProps) {
  return (
    <span
      className={`${textSize} bg-gradient-to-bl from-purple5 to-purple8 bg-clip-text text-transparent leading-normal`}
    >
      {text}
    </span>
  );
}

