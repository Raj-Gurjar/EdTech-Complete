import React from "react";
import { Link } from "react-router-dom";

interface SecondaryCTAProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * SecondaryCTA - Secondary call-to-action button with glassmorphic style
 * 
 * Features:
 * - Semi-transparent white background (rgba(255, 255, 255, 0.15))
 * - Backdrop blur effect
 * - No border
 * - No box shadow
 * - DM Sans font family
 * - Smooth hover transitions
 */
export default function SecondaryCTA({
  children,
  to,
  href,
  onClick,
  className = "",
  disabled = false,
}: SecondaryCTAProps) {
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
    hover:scale-[1.02]
    active:scale-[0.98]
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  `;

  const secondaryStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(2.5px)',
    WebkitBackdropFilter: 'blur(2.5px)',
    borderWidth: '0px',
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    textAlign: 'center' as const,
    boxShadow: 'none',
    fontFamily: '"DM Sans", "DM Sans Placeholder", sans-serif',
    fontWeight: 500,
    letterSpacing: '-0.5px',
    lineHeight: '26px',
    opacity: 1,
  };

  const hoverStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    Object.assign(e.currentTarget.style, secondaryStyles);
  };

  const commonProps = {
    className: `${baseStyles} ${className}`,
    style: secondaryStyles,
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
