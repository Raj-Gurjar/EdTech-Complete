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
      {/* Logo Placeholder - Replace this div with <img src="/logo.png" alt="SkillScript" /> when logo is ready */}
      <div className={`w-8 h-8 bg-yellow8 rounded-lg flex items-center justify-center ${logoClassName}`}>
        <span className="text-black font-bold text-sm">SS</span>
      </div>
      {showText && (
        <span className={`text-lg sm:text-xl font-bold text-yellow8 hover:text-yellow7 transition-colors ${textClassName}`}>
          SkillScript
        </span>
      )}
    </Link>
  );
}

