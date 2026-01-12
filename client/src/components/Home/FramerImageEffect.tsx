import React, { ReactNode } from "react";

interface FramerImageEffectProps {
  children: ReactNode;
  className?: string;
}

/**
 * FramerImageEffect - Wraps images with the Framer-style border, glow, and gradient line effect
 * 
 * Features:
 * - Dark background (rgb(8, 8, 8))
 * - Subtle white border (rgba(255, 255, 255, 0.05))
 * - Purple gradient line overlay at bottom
 * - Blurred purple glow effect behind
 */
export default function FramerImageEffect({ children, className = "" }: FramerImageEffectProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundColor: 'rgb(8, 8, 8)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '30px',
        padding: '10px',
      }}
    >
      {/* Glow effect - behind everything */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundColor: 'rgb(96, 28, 255)',
          filter: 'blur(40px)',
          borderRadius: '100%',
          opacity: 0.2,
          transform: 'scale(1.2)',
        }}
      ></div>
      
      {/* Inner container with border */}
      <div 
        className="relative"
        style={{
          borderRadius: '19px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {children}
        
        {/* Gradient line overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(96, 28, 255, 0) 0%, rgb(96, 28, 255) 50%, rgba(96, 28, 255, 0) 100%)',
          }}
        ></div>
      </div>
    </div>
  );
}
