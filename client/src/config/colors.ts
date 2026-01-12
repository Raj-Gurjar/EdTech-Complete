/**
 * Centralized Color Configuration (TypeScript)
 * 
 * NOTE: colors.js is the single source of truth for Tailwind config.
 * This file provides TypeScript types and utilities.
 * Always update colors.js first, then sync changes here.
 */

// Re-export the colors object structure for TypeScript usage
// The actual values are defined in colors.js
export type ColorName = 
  | 'black' | 'white' | 'transparent'
  | 'black1' | 'black2' | 'black3' | 'black4' | 'black5' | 'black6' | 'black7' | 'black8' | 'black9' | 'black10' | 'blackBg'
  | 'white1' | 'white2' | 'white3' | 'white4' | 'white5' | 'white6' | 'white7' | 'white8' | 'white9' | 'white10'
  | 'yellow1' | 'yellow2' | 'yellow3' | 'yellow4' | 'yellow5' | 'yellow6' | 'yellow7' | 'yellow8' | 'yellow9' | 'yellow10'
  | 'blue1' | 'blue2' | 'blue3' | 'blue4' | 'blue5' | 'blue6' | 'blue7' | 'blue8' | 'blue9' | 'blue10'
  | 'brown1' | 'brown2' | 'brown3' | 'brown4' | 'brown5' | 'brown6' | 'brown7' | 'brown8' | 'brown9' | 'brown10'
  | 'caribbeanGreen1' | 'caribbeanGreen2' | 'caribbeanGreen3' | 'caribbeanGreen4' | 'caribbeanGreen5' 
  | 'caribbeanGreen6' | 'caribbeanGreen7' | 'caribbeanGreen8' | 'caribbeanGreen9' | 'caribbeanGreen10'
  | 'pink1' | 'pink2' | 'pink3' | 'pink4' | 'pink5' | 'pink6' | 'pink7' | 'pink8' | 'pink9' | 'pink10'
  | 'grey1' | 'grey2' | 'grey3' | 'grey4' | 'grey5' | 'grey6' | 'grey7' | 'grey8' | 'grey9' | 'grey10'
  | 'red1' | 'red2' | 'red3' | 'red4' | 'red5'
  | 'purple1' | 'purple2' | 'purple3' | 'purple4' | 'purple5' | 'purple6' | 'purple7' | 'purple8' | 'purple9' | 'purple10'
  | 'framerPurple';

/**
 * RGB values for colors (for use in rgba() functions)
 * These are extracted from the hex colors in colors.js
 */
export const colorRGB = {
  // Blue colors (primary brand color)
  blue6: { r: 0, g: 181, b: 255 },    // #00b5ff
  blue7: { r: 0, g: 150, b: 204 },    // #0096cc
  blue5: { r: 26, g: 194, b: 255 },   // #1ac2ff
  blue4: { r: 77, g: 207, b: 255 },    // #4dcfff
  blue3: { r: 128, g: 221, b: 255 },   // #80ddff

  // Background colors
  blackBg: { r: 18, g: 18, b: 18 },   // #121212
  darkBg: { r: 10, g: 10, b: 10 },    // #0a0a0a
  
  // Purple colors (softer palette)
  purple6: { r: 139, g: 92, b: 246 },  // #8b5cf6 - Primary purple
  purple7: { r: 124, g: 58, b: 237 },  // #7c3aed - Muted purple
  framerPurple: { r: 139, g: 92, b: 246 }, // #8b5cf6 - Softer lavender
} as const;

/**
 * Helper function to create rgba color strings
 * @param color - RGB color object
 * @param alpha - Alpha value (0-1)
 * @returns rgba string
 */
export const rgba = (color: { r: number; g: number; b: number }, alpha: number): string => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
};

/**
 * Common color utilities for shadows and gradients
 */
export const colorUtilities = {
  // Blue shadow colors (for use in Tailwind shadow classes)
  blueShadow: {
    light: `rgba(0, 181, 255, 0.3)`,
    medium: `rgba(0, 181, 255, 0.4)`,
    dark: `rgba(0, 181, 255, 0.5)`,
  },
  
  // Blue gradient colors for backgrounds
  blueGradient: {
    light: rgba(colorRGB.blue6, 0.1),
    medium: rgba(colorRGB.blue6, 0.2),
    strong: rgba(colorRGB.blue6, 0.3),
  },
} as const;
