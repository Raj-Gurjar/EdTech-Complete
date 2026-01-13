import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/logos/logo-1.png";

interface LogoProps {
  showText?: boolean;
  showLogo?: boolean;
  className?: string;
  logoClassName?: string;
  textClassName?: string;
}

export default function Logo({ 
  showText = true, 
  showLogo = true,
  className = "",
  logoClassName = "",
  textClassName = ""
}: LogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 ${className}`}
    >
      {showLogo && (
        <img 
          src={logoImage} 
          alt="SkillScript Logo" 
          className={`h-8 w-8 sm:h-10 sm:w-10 object-contain ${logoClassName}`}
        />
      )}
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
      {!showText && !showLogo && (
        <div className={`w-8 h-8 bg-purple6 rounded-lg flex items-center justify-center ${logoClassName}`}>
          <span className="text-black font-bold text-sm">SS</span>
        </div>
      )}
    </Link>
  );
}

