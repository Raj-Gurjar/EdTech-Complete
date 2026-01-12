import React from "react";
import { Link } from "react-router-dom";

interface PrimaryCTAProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * PrimaryCTA - Primary call-to-action button with purple background
 * 
 * Features:
 * - Purple background (rgb(139, 92, 246)) - Softer lavender
 * - White border with 15% opacity
 * - Multi-layer box shadow with glow effects
 * - DM Sans font family
 * - Smooth hover transitions
 */
export default function PrimaryCTA({
  children,
  to,
  href,
  onClick,
  className = "",
  disabled = false,
}: PrimaryCTAProps) {
  const baseStyles = `
    inline-block
    text-white
    font-medium
    rounded-[10px]
    px-6
    py-3
    transition-all
    duration-300
    will-change-transform
    border
    border-white/15
    hover:scale-[1.02]
    active:scale-[0.98]
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  `;

  const primaryStyles = {
    backgroundColor: 'rgb(139, 92, 246)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: '1px',
    textAlign: 'center' as const,
    borderStyle: 'solid',
    borderRadius: '10px',
    boxShadow: 'rgba(139, 92, 246, 0.4) 0px 8px 40px 0px, rgba(255, 255, 255, 0) 0px 0px 10px 1px inset, rgba(124, 58, 237, 0.12) 0px 0px 0px 1px',
    fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
    fontWeight: 500,
    letterSpacing: '-0.5px',
    lineHeight: '26px',
    opacity: 1,
  };

  const hoverStyles = {
    boxShadow: 'rgba(139, 92, 246, 0.5) 0px 8px 50px 0px, rgba(255, 255, 255, 0.05) 0px 0px 10px 1px inset, rgba(124, 58, 237, 0.15) 0px 0px 0px 1px',
  };

  const content = (
    <span style={{ color: 'rgb(255, 255, 255)' }}>
      {children}
    </span>
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    Object.assign(e.currentTarget.style, primaryStyles);
  };

  const commonProps = {
    className: `${baseStyles} ${className}`,
    style: primaryStyles,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...commonProps}
    >
      {content}
    </button>
  );
}
