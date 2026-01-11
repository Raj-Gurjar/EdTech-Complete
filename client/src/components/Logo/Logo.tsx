import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  showText?: boolean;
  className?: string;
  logoClassName?: string;
  textClassName?: string;
}

export default function Logo({ 
  showText = true, 
  className = "",
  logoClassName = "",
  textClassName = ""
}: LogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 ${className}`}
    >
      {showText && (
        <span 
          className={`text-lg sm:text-xl font-medium text-white hover:text-white/80 transition-colors ${textClassName}`}
          style={{
            fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.5px',
          }}
        >
          SkillScript
        </span>
      )}
      {!showText && (
        <div className={`w-8 h-8 bg-yellow8 rounded-lg flex items-center justify-center ${logoClassName}`}>
          <span className="text-black font-bold text-sm">SS</span>
        </div>
      )}
    </Link>
  );
}

